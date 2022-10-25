const nodemailer = require('nodemailer');

const sendEmail = async (id, email, url, option) => {
  // send email for the email verification option
  if (option === 'email verification') {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    // set the correct mail option
    const options = {
      from: process.env.ADMIN_EMAIL, // sender address
      to: email,
      subject: 'Verify Your Email',
      html: `<div>
                  <h2>Thanks for registering on our site</h2>
                  <h4>Please verify your email address to complete register and login into your account.</h4>
                  <a href=${url}>Verify Your Email</a>
              </div>`,
    };

    // Send Email
    await transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
  // send a mail for resetting password if forgot password
  else if (option === 'forgot password') {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    const options = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: 'Reset Password',
      html: `<div>
                  <h2>Reset Password for your account</h2>
                  <br/>
                  Forgot your password? 
                  <br/>
                  No worries! Just click this link to 
                  <a href="${url}">Reset Your Password</a>. 
                  <br>
                  Note that this link is valid for only the next 5 minutes.
              </div>`,
    };

    // Send Email
    await transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
};

module.exports = sendEmail;
