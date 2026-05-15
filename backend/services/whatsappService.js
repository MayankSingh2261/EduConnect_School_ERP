const sendWhatsAppMessage = async (
  phone,
  studentName,
  date
) => {
  try {

    // TEMP LOG
    console.log(`
===================================
WHATSAPP ALERT
===================================

Parent Phone: ${phone}

Message:
Dear Parent,

Your child ${studentName}
was absent on ${date}.

Please contact school administration.

- EduConnect Pro

===================================
`);

    return {
      success: true,
    };

  } catch (error) {

    console.log(error);

    return {
      success: false,
    };

  }
};

module.exports = {
  sendWhatsAppMessage,
};