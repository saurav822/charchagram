import "dotenv/config";
import express from "express";

import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";

const router = express.Router();

let emailAPI = new TransactionalEmailsApi();
emailAPI.authentications.apiKey.apiKey = process.env.Brevo_API_Key;
const charchagramEmailGrievances = "grievance.charchagram@gmail.com";

const getMessageBody = (caseType, messageObject, senderDetails, receiverDetails) => {
    switch (caseType) {
        case 'ack':
            messageObject.sender = { name: 'CharchaGram Team', email: charchagramEmailGrievances }; messageObject.to = charchagramEmailGrievances;
            messageObject.to = [{ name: receiverDetails.name, email: receiverDetails.email }];

            messageObject.subject = `चर्चाग्राम टीम से संपर्क करने के लिए धन्यवाद।`;
            messageObject.textContent = `नमस्ते ${receiverDetails.name}, चर्चाग्राम टीम से संपर्क करने के लिए धन्यवाद। हम जल्द ही आपसे संपर्क करेंगे।`;
            return messageObject;
        case 'grievance':
            messageObject.sender = { name: senderDetails.name, email: charchagramEmailGrievances }; messageObject.to = charchagramEmailGrievances;
            messageObject.to = [{ name: "CharchaGram team", email: charchagramEmailGrievances }];
            messageObject.subject = `Contact us message sent from ${senderDetails.name}. Contact information: ${senderDetails.email}`;
            messageObject.textContent = senderDetails.message;
            return messageObject;
    }
    return messageObject;
}

async function sendEmail(senderDetails, receiverDetails, caseType) {
    let message = new SendSmtpEmail();
    message = getMessageBody(caseType, message, senderDetails, receiverDetails);

    await emailAPI
        .sendTransacEmail(message)
        .then((response) => console.log(response))
        .catch((error) => console.log(error));

    return {
        success: true,
        message: "Email sent successfully",
    };
}

router.post("/send", async (req, res) => {
    try {
        const { name, senderEmail, message } = req.body;

        // Send grievance email from sender to CharchaGram inbox
        await sendEmail({ name, message, email: senderEmail }, { name: "CharchaGram Team", message: "", email: charchagramEmailGrievances }, 'grievance');

        sendEmail({ name: "CharchaGram Team", message: "", email: charchagramEmailGrievances }, { name: name, message: '', email: senderEmail }, 'ack').catch(err => console.error("Error sending acknowledgment email:", err));;

        return res.status(200).json({
            success: true,
            message: "Email sent successfully",
        });
    } catch (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message,
        });
    }
});

export default router;



