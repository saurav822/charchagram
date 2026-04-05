// Server-side OTP verification using MSG91 API
import axios from 'axios';

const verifyAccessToken = async (accessToken) => {
    const url = "https://control.msg91.com/api/v5/widget/verifyAccessToken";
  
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  
    const body = {
      authkey: "466248A6Z5Hjstly68b2aab4P1", // Your MSG91 auth key
      "access-token": accessToken,
    };
  
    try {
      const response = await axios.post(url, body, { headers });
      return response.data;
    } catch (error) {
      console.error("Error verifying access token:", error);
      throw error;
    }
  };
  
  // Example usage
  const handleOTPVerification = async (req, res) => {
    try {
      const { accessToken } = req.body;
  
      if (!accessToken) {
        return res.status(400).json({ error: "Access token is required" });
      }
  
      const verificationResult = await verifyAccessToken(accessToken);
      console.log('verificationResult ', verificationResult);
      
      // Check for both 'status' and 'type' fields for compatibility
      if (verificationResult.status === "success" || verificationResult.type === "success") {
        // OTP verification successful
        res.status(200).json({
          success: true,
          message: "OTP verified successfully",
          userData: verificationResult.data || verificationResult.message,
        });
      } else {
        // OTP verification failed
        res.status(400).json({
          success: false,
          message: "OTP verification failed",
          error: verificationResult.message,
        });
      }
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  
  // Export for use in your server
  export { verifyAccessToken, handleOTPVerification };
  
  // For direct testing
//   if (import.meta.url === `file://${process.argv[1]}`) {
//     // Test the verification
//     const testAccessToken =
//       "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXF1ZXN0SWQiOiIzNTY4NDQ3MTczNTQzNzM2MzUzNTM2MzYiLCJjb21wYW55SWQiOjQ2NjI0OH0.IvM0gvzJ5ajiPC15fTrWFof5m8cw3K9cyDCbr5R3dkU";
//     verifyAccessToken(testAccessToken)
//       .then((result) => console.log("Verification result:", result))
//       .catch((error) => console.error("Error:", error));
//   }
  