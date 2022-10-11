const email = require('../')
const nodemailer = require('nodemailer');

module.exports = {
    receiveEmail: async (req, res) => {
      console.log(req.body);
      /*let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MS365_USERNAME,
            pass: process.env.MS365_PASSWORD
        },
        tls: {
            ciphers:'SSLv3'
        }
      })*/
      let transporter;
      let message = {
        from: `Housing Repository Website <${process.env.MS365_USERNAME}@outlook.com>`, 
        to: process.env.DEST_EMAIL,
        subject: 'Message from Housing Repository',
        text: `${req.body.message} 
                This email is from ${req.body.email}
                Reply to ${req.body.email}`,
        html: `
                <h1>${req.body.message}</h1>
                <p>From ${req.body.name}</p>
                <p>This email is from ${req.body.email}</p>
                <p>Reply to ${req.body.email}</p>
                `
      }
      // in production mode, use outlook email to send mail.
      if(process.env.NODE_ENV === 'production') {
        transporter = nodemailer.createTransport(`smtp://${process.env.MS365_USERNAME}%40outlook.com:${process.env.MS365_PASSWORD}@smtp-mail.outlook.com`);
        transporter.sendMail(message, (err, info) => {
            if(err) {
                console.log("An error occurred sending mail. Error: ")
                console.log(err)
                return;
            }
            console.log("Successfully sent email.")
            console.log(info);
            console.log(`Preview email: ${nodemailer.getTestMessageUrl(info)}`);
          })
      }
      // otherwise, use ethereal to send dummy emails. 
      else {
        nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure, // true for 465, false for other ports
                auth: {
                    user: account.user, // generated ethereal user
                    pass: account.pass  // generated ethereal password
                }
            });
            console.log("Test account: ")
            console.log(`User: ${account.user}, pass: ${account.pass}`)
            transporter.sendMail(message, (err, info) => {
                if(err) {
                    console.log("An error occurred: " + err.message)
                    return process.exit(1)
                }
                console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
            })
        });
      }
      

      req.flash("success", {
        msg: "Message Sent!",
      });
      res.redirect("/contact");
    }
  };
  