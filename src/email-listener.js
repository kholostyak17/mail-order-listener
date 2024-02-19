const MailListener = require("mail-listener2");
const { startAssignProcess } = require("./services");

const mailListener = new MailListener({
  username: process.env.MAIL_RECEIVER_ADDRESS,
  password: process.env.MAIL_RECEIVER_PASSWORD,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  mailbox: "INBOX",
  markSeen: false,
  fetchUnreadOnStart: false,
  tlsOptions: { rejectUnauthorized: false },
});

const startEmailListener = () => {
  mailListener.start();

  mailListener.on("server:connected", () => {
    console.log("INFO: Connected to the mail server");
  });

  mailListener.on("server:disconnected", () => {
    console.log("INFO: Disconnected from the mail server. Reconnecting...");
  });

  mailListener.on("error", function (err) {
    console.log(err);
  });

  mailListener.on("mail", function (mail, seqno, attributes) {
    console.info(mail);
    let mailFrom = mail?.from?.text;
    if (mailFrom && mailFrom.includes(process.env.EXPECTED_MAIL_SENDER)) {
      console.log("New email received from ", mailFrom, ". Loading process...");
      try {
        startAssignProcess();
        console.log("Email processing completed!!!\n");
      } catch (error) {
        console.error("Unexpected error: ", error.message, "\n");
      }
    }
  });
};

module.exports = { startEmailListener };
