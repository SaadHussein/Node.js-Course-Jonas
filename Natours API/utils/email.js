const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require("html-to-text");

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.url = url;
        this.from = process.env.EMAIL_FROM;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return 1;
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(template, subject) {
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            html,
            text: htmlToText(html)
        };

        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome To Natours Family.');
    }
};

// const sendEmail = async (options) => {
// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

// const mailOptions = {
//     from: "Saad Hussein - Natours API",
//     to: options.email,
//     subject: options.subject,
//     text: options.message
// };

// await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;