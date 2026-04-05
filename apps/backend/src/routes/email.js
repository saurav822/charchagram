import 'dotenv/config';
import express from 'express';
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';
import { createLogger } from '../utils/logger.js';

const log = createLogger('email-route');
const router = express.Router();

/** Brevo transactional email client — initialised once at module load. */
const emailAPI = new TransactionalEmailsApi();
emailAPI.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;

/** Shared sender inbox — all grievance emails route through this address. */
const CHARCHAGRAM_GRIEVANCE_EMAIL = 'grievance.charchagram@gmail.com';

/**
 * Builds a Brevo SendSmtpEmail message object for the given case type.
 *
 * @param {'ack'|'grievance'} caseType
 * @param {SendSmtpEmail} messageObject - Mutable Brevo message to populate
 * @param {{ name: string, email: string, message: string }} senderDetails
 * @param {{ name: string, email: string }} receiverDetails
 * @returns {SendSmtpEmail}
 */
function buildEmailMessage(caseType, messageObject, senderDetails, receiverDetails) {
  const teamSender = { name: 'CharchaGram Team', email: CHARCHAGRAM_GRIEVANCE_EMAIL };

  switch (caseType) {
    case 'ack':
      // Acknowledgment to the citizen who submitted the grievance
      messageObject.sender = teamSender;
      messageObject.to = [{ name: receiverDetails.name, email: receiverDetails.email }];
      messageObject.subject = 'चर्चाग्राम टीम से संपर्क करने के लिए धन्यवाद।';
      messageObject.textContent = `नमस्ते ${receiverDetails.name}, चर्चाग्राम टीम से संपर्क करने के लिए धन्यवाद। हम जल्द ही आपसे संपर्क करेंगे।`;
      break;

    case 'grievance':
      // Internal notification to the CharchaGram team inbox
      messageObject.sender = { name: senderDetails.name, email: CHARCHAGRAM_GRIEVANCE_EMAIL };
      messageObject.to = [{ name: 'CharchaGram Team', email: CHARCHAGRAM_GRIEVANCE_EMAIL }];
      messageObject.subject = `Contact us message from ${senderDetails.name} — ${senderDetails.email}`;
      messageObject.textContent = senderDetails.message;
      break;
  }

  return messageObject;
}

/**
 * Sends a transactional email via Brevo.
 *
 * @param {{ name: string, email: string, message: string }} senderDetails
 * @param {{ name: string, email: string }} receiverDetails
 * @param {'ack'|'grievance'} caseType
 * @returns {Promise<{ success: boolean, message: string }>}
 */
async function sendEmail(senderDetails, receiverDetails, caseType) {
  let message = new SendSmtpEmail();
  message = buildEmailMessage(caseType, message, senderDetails, receiverDetails);

  try {
    await emailAPI.sendTransacEmail(message);
    log.info(`Email sent (type=${caseType}) to ${receiverDetails.email}`);
  } catch (err) {
    log.error(`Failed to send email (type=${caseType})`, err);
    throw err;
  }

  return { success: true, message: 'Email sent successfully' };
}

/**
 * POST /api/email/send
 *
 * Accepts a contact-us form submission and:
 *  1. Forwards the message to the CharchaGram grievance inbox.
 *  2. Sends an acknowledgment email back to the sender (fire-and-forget).
 *
 * @body {{ name: string, senderEmail: string, message: string }}
 */
router.post('/send', async (req, res) => {
  try {
    const { name, senderEmail, message } = req.body;

    if (!name || !senderEmail || !message) {
      return res.status(400).json({
        success: false,
        message: 'name, senderEmail, and message are required',
      });
    }

    // Forward to CharchaGram team inbox
    await sendEmail(
      { name, message, email: senderEmail },
      { name: 'CharchaGram Team', message: '', email: CHARCHAGRAM_GRIEVANCE_EMAIL },
      'grievance'
    );

    // Acknowledge the sender (non-blocking — failure does not affect the 200 response)
    sendEmail(
      { name: 'CharchaGram Team', message: '', email: CHARCHAGRAM_GRIEVANCE_EMAIL },
      { name, message: '', email: senderEmail },
      'ack'
    ).catch((err) => log.error('Acknowledgment email failed', err));

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    log.error('POST /api/email/send failed', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
