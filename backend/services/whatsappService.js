const axios = require("axios");

const WHATSAPP_API_URL = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

const sendWhatsAppText = async (phone, message) => {
  try {
    const formattedPhone = phone.startsWith("91")
      ? phone
      : `91${phone}`;

    console.log(`
===================================
WHATSAPP MESSAGE START
===================================

Sending To: ${formattedPhone}

Message:
${message}

===================================
`);

    const res = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "text",
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log(`
===================================
WHATSAPP MESSAGE SENT SUCCESSFULLY
===================================

WhatsApp Message ID:
${res.data.messages?.[0]?.id || "N/A"}

Meta Response:
${JSON.stringify(res.data, null, 2)}

===================================
`);

    return {
      success: true,
      data: res.data,
    };

  } catch (error) {

    console.log(`
===================================
WHATSAPP MESSAGE FAILED
===================================

Reason:
${JSON.stringify(
  error.response?.data || error.message,
  null,
  2
)}

===================================
`);

    return {
      success: false,
      error:
        error.response?.data || error.message,
    };
  }
};

const sendWhatsAppMessage = async (phone, studentName, date) => {
  const message = `Dear Parent,

Your child ${studentName} was absent on ${date}.

Please contact school administration.

- EduConnect Pro`;

  return await sendWhatsAppText(phone, message);
};

const sendGuardianCredentials = async (
  phone,
  parentName,
  studentName,
  loginId,
  password
) => {
  console.log("sendGuardianCredentials function called");

  const message = `Dear ${parentName},

EduConnect ERP login has been created for ${studentName}.

Login ID: ${loginId}
Temporary Password: ${password}

Please login and change your password after first login.

- EduConnect Pro`;

  return await sendWhatsAppText(phone, message);
};

const sendGuardianCredentialsTemplate = async (
  phone,
  parentName,
  studentName,
  loginId,
  password
) => {
  try {
    const formattedPhone = phone.startsWith("91")
      ? phone
      : `91${phone}`;

    const res = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "template",
        template: {
          name: "guardian_credentials",
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: parentName },
                { type: "text", text: studentName },
                { type: "text", text: loginId },
                { type: "text", text: password },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("Template message sent:", res.data);

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.log(
      "Template message failed:",
      error.response?.data || error.message
    );

    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

module.exports = {
  sendWhatsAppText,
  sendWhatsAppMessage,
  sendGuardianCredentials,
  sendGuardianCredentialsTemplate,
};