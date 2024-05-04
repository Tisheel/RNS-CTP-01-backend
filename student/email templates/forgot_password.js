const forgot_password = (name, link) => {
    return `Subject: Reset Your Password - We Builddd

Dear ${name},

We have received a request to reset the password for your account on We Builddd. To initiate the password reset process, please click on the following link:

${link}

If you did not request this password reset or have any concerns regarding the security of your account, please ignore this email. Your existing password will remain unchanged.

For security reasons, please complete the password reset process with in 15 minutes. Once you click the link above, you will be directed to a page where you can create a new password for your account.

Please ensure that your new password is strong and unique, and avoid using easily guessable passwords like "123456" or "password."

If you encounter any issues during the password reset process or need further assistance, please don't hesitate to contact our customer support team at xxxxx@rnsit.ac.in or +91 999999999. We are here to help you.

Thank you for using We Builddd. We appreciate your trust in us, and we are committed to ensuring the security of your account.

Sincerely,

${name}
We Builddd
+91 999999999
`
}

module.exports = forgot_password