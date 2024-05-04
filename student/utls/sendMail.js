const nodemailer = require("nodemailer")

const { EMAIL_PASSWORD, EMAIL } = process.env

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
    }
})

const sendMail = async (obj) => {
    const { to, subject, text, html } = obj

    const info = await transporter.sendMail({
        from: EMAIL,
        to,
        subject,
        text,
        html
    })

    console.log(`Message sent: ${info.messageId}`)
}

module.exports = sendMail