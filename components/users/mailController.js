const config = require("../../lib/config");
// const user = require('../models/users');
const nodemailer = require('nodemailer');
const adminEmail = config.ADMIN_FROM_EMAIL;
const key = config.ADMIN_FROM_EMAIL_KEY;
const toEmail = config.ADMIN_TO_EMAIL;
const emailHost = config.EMAIL_HOST;

const transPorterInfo = {
  maxConnections: 3, 
  pool: true,   
  host: emailHost,
  port: 587,
  secure: false,
  auth: {
    user: adminEmail,
    pass: key,
  },
  tls: {
    // used in local development
    rejectUnauthorized: false,
  }
}

const mail = {

  prospectEmailToAdmin: async (prospectInfo) => {
    try {
      let transporter = nodemailer.createTransport(transPorterInfo);

      let info = await transporter.sendMail({
        from: adminEmail,
        to: toEmail,
        subject: "You Have a New Prospect",
        text: `A prospect has been added to the prospects database. The new prospect info is:
        Name: ${prospectInfo.name}
        Address: ${prospectInfo.address}, ${prospectInfo.city}, ${prospectInfo.state} ${prospectInfo.postal_code}
        Phone: ${prospectInfo.phone}`,
        html: `<b>A prospect has been added to the X-Marketing Database. The new prospect info is: </br> 
          <ul>
            <li>Name: ${prospectInfo.name}</li>
            <li>Address: ${prospectInfo.address}, ${prospectInfo.city}, ${prospectInfo.state} ${prospectInfo.postal_code}</li>
            <li>Phone: ${prospectInfo.phone}</li>
          </ul>
          </b>`,
      });

      console.log("Message sent: %s", info.messageId);

      // For development implementing an Ethereal account
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.log('Prospect email error: ', error);
    }
  },

  adminAccountEmail: async (userInfo) => {
    try {
      let transporter = nodemailer.createTransport(transPorterInfo);

      let info = await transporter.sendMail({
        from: adminEmail,
        to: toEmail,
        subject: "You Have a New Client",
        text: `A user has created an account and the associated targets are stored in the database. The user's info is: 
          Name: ${userInfo.firstname} ${userInfo.lastname}
          Email: ${userInfo.email},
          Username: ${userInfo.username}`,
        html: `<b>
            A user has created an account and the associated targets are stored in the database. The user's info is: </br>
            <ul>
              <li>Name: ${userInfo.firstname} ${userInfo.lastname}</li>
              <li>Email: ${userInfo.email}</li>
              <li>Username: ${userInfo.username}</li>
            </ul>
          </b>`,
      });

      console.log("Message sent: %s", info.messageId);
      // For development implementing an Ethereal account
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    } catch (error) {
      console.log('Admin success email Error: ', error);
    }
  },

  userAccountEmail: async (userInfo) => {
    try {
      let transporter = nodemailer.createTransport(transPorterInfo);

      let info2 = await transporter.sendMail({
        from: adminEmail,
        to: userInfo.email,
        subject: "Welcome to X-Marketing",
        text: `Congratulations, your account with X-Marketing has been created. A copy of your referral list is attached to this email and your account details are listed below.

           Name: ${userInfo.firstname} ${userInfo.lastname}
           Email: ${userInfo.email}
           Username: ${userInfo.username}

          Thank you from the X-Marketing Team.`,
        html: `<b><p>Congratulations, your account with X-Marketing has been created. A copy of your referral list is attached to this email and your account details are listed below.</p></br>
        <ul>
          <li>Name: ${userInfo.firstname} ${userInfo.lastname}</li>
          <li>Email: ${userInfo.email}</li>
          <li>Username: ${userInfo.username}</li>
        </ul></br><p>Thank you from the X-Marketing Team.</p></b>`,
        attachments: [ 
          {
          filename: `${userInfo.username}_targets.csv`,
          path: `csv_files/${userInfo.username}_targets.csv` 
        } 
      ] 
      });

      console.log("Message sent: %s", info2.messageId);
      // For development implementing an Ethereal account
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    } catch (error) {
      console.log('User email Error: ', error);
    }
  },

  adminErrorEmail: async (userInfo, errMsg) => {
    try {
      let transporter = nodemailer.createTransport(transPorterInfo);

      let info = await transporter.sendMail({
        from: adminEmail,
        to: toEmail,
        subject: "Account Creation Eror",
        text: `It appears there has been an error creating an account for ${userInfo.username}. The error is: ${errMsg}`,
        html: `<b>It appears there has been an error creating an account for ${userInfo.username}. The error is: ${errMsg}</b>`
      });

      console.log("Message sent: %s", info.messageId);
      // For development implementing an Ethereal account
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.log('Admin error email Error: ', error);
    }
  },

}

module.exports = mail;