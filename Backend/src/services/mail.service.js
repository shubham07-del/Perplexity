import * as brevo from '@getbrevo/brevo';

let defaultClient = brevo.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; 

let apiInstance = new brevo.TransactionalEmailsApi();

export const sendEmail = async ({ to, subject, text, html }) => {
  let sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.textContent = text;
  
  sendSmtpEmail.sender = { name: "Signature AI", email: process.env.GOOGLE_USER }; 
  sendSmtpEmail.to = [{ email: to }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Brevo Email sent successfully. ID: ' + data.messageId);
  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    throw error;
  }
};
