import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PSWD
    }

});

export const sendMail = (mailRecipientList: string, contentHTML: string, subject: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const mailOptions = {
                from: `"FactoryBike" <${process.env.MAIL_USER}>`,
                to: mailRecipientList,
                subject: subject,
                html: contentHTML
            };
            transporter.sendMail(mailOptions).then((resp) => {
                resolve(resp.envelope);
            }, (error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}