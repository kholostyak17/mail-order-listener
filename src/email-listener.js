const { MailListener } = require("mail-listener5");
const { startAssignProcess } = require("./services");

const mailListener = new MailListener({
  username: process.env.MAIL_RECEIVER_ADDRESS,
  password: process.env.MAIL_RECEIVER_PASSWORD,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  mailbox: "INBOX",
  markSeen: true,
  fetchUnreadOnStart: true,
  tlsOptions: { rejectUnauthorized: false },
});

const startEmailListener = () => {
  mailListener.start();

  mailListener.on("mail", (mail) => {
    console.log("INFO: new mail received \n from:", mail?.from?.text, "\n");
    let mailFrom = mail?.from?.text;
    if (mailFrom.includes(process.env.EXPECTED_MAIL_SENDERS)) {
      console.log(
        "!!!received email from ",
        process.env.EXPECTED_MAIL_SENDER,
        "\n",
        "loading..."
      );

      startAssignProcess();
    }
  });

  mailListener.on("server:connected", () => {
    console.log("INFO: connected to the mail server");
  });

  mailListener.on("server:disconnected", () => {
    console.log("INFO: disconnected from the mail server");
  });
};

module.exports = { startEmailListener };
