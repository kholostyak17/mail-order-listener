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

  mailListener.on("server:connected", () => {
    console.log("INFO: Connected to the mail server");
  });

  mailListener.on("server:disconnected", () => {
    console.log("INFO: Disconnected from the mail server. Reconnecting...");
    throw new Error();
  });

  mailListener.on("error", (err) => {
    console.error(err);
  });

  mailListener.on("mail", async (mail) => {
    const mailFrom = mail?.from?.text;
    if (mailFrom && mailFrom.includes(process.env.EXPECTED_MAIL_SENDER)) {
      console.log("New email received from ", mailFrom, ". Loading process...");
      try {
        await startAssignProcess();
        console.log("Email processing completed!!!\n");
      } catch (error) {
        console.error("Unexpected error: ", error.message, "\n");
      }
    } else {
      console.log("New mail from", mailFrom, " --> ignored\n");
    }
  });
};

module.exports = { startEmailListener };
