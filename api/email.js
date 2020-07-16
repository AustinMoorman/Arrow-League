const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});


const registrationEmail = (email, rangeName, verificationCode) => {
    const body = `
          <div>
            <p>Hello ${rangeName}</p>
            <br />
            <p>Thank you for registering for Archery League!</p>
            <p>To complete your registation please click the link below.</p>
            <br />
            <a href=${process.env.REACT_APP_EXPRESS_URL}/api/register/verification?email=${email}&verification_code=${verificationCode}>Confirm Registration</a>
          </div>
      `
    const plainText = `To complete your registration please click the link           ${process.env.REACT_APP_EXPRESS_URL}/api/register/verification?email=${email}&verification_code=${verificationCode}`

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Email confirmation for ArrowLeague.com`,
        html: body,
        text: plainText
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return reject('Error')
            } else {
                return resolve('OK')
            }
        });
    })
}

const resetPasswordEmail = (email,rangeName,resetCode) => {
    const body = `
          <div>
            <p>Hello ${rangeName}</p>
            <br />
            <p>Looks like you forgot your password.....</p>
            <p>Use the code below to reset your password.</p>
            <br />
            <p>${resetCode}</p>
          </div>
      `
    const plainText = `Use this code to reset your password         ${resetCode}`

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Password reset for ArrowLeague.com`,
        html: body,
        text: plainText
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return reject('Error')
            } else {
                return resolve('OK')
            }
        });
    })
}

module.exports = {registrationEmail,resetPasswordEmail}