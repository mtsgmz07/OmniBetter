require("dotenv").config()
const nodemailer = require("nodemailer")
const ejs = require("ejs")
module.exports = function (omnibetter_email, user_email, title_email, ejs_path, ejs_object) {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASS
        }
    })
    ejs.renderFile(ejs_path, ejs_object, (err, dataEjs) => {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                from: `OmniBetter <${omnibetter_email}@omnibetter.fr>`,
                to: user_email,
                subject: title_email,
                html: dataEjs
            };
            transport.sendMail(mailOptions);
            transport.close();
        }
    });
    return
}