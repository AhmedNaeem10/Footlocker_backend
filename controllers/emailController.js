const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "mailerhere10@gmail.com", // generated ethereal user
        pass: "90260405575", // generated ethereal password
    },
});

exports.fillForm = async (username) => {
    let info = await transporter.sendMail({
        from: 'mailerhere10@gmail.com', // sender address
        to: username, // list of receivers
        subject: "Your order has been placed!", // Subject line
        html: `<div>
                    <h1>Fill the form details!</h1>
                    <p>You are required to fill the form details as you haven't completed your profile yet.</p>
                </div>`, // html body
    });
    console.log("Email sent: ", info.messageId)
}


exports.solvePuzzle = async (username) => {
    let info = await transporter.sendMail({
        from: 'mailerhere10@gmail.com', // sender address
        to: username, // list of receivers
        subject: "Your order has been placed!", // Subject line
        html: `<div>
                    <h1>Solve the recapctha!</h1>
                    <p>You are required to solve the recaptcha to comeplete the order placement.</p>
                </div>`, // html body
    });
    console.log("Email sent: ", info.messageId)
}