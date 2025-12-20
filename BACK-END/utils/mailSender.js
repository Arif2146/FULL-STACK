const nodeMailer = require('nodemailer');

const mailSender = async (email,title,body) => {
    try {
        let transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
        let info = await transporter.sendMail({
            from: 'StudyNotion || Arif Bepari',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        console.log(`Mail sent successfully to ${email} with info: ${info}`);
        return info;
    }
    catch (error) {
        console.log(`Error in mail sender utility: ${error.message}`);
    }
}
module.exports = mailSender;