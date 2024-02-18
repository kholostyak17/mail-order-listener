const { MailListener } = require("mail-listener2");
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

  mailListener.on("mail", async (mail) => {
    console.log("\n -> New email received from: ", mail?.from?.text);
    let mailFrom = mail?.from?.text;
    if (mailFrom.includes(process.env.EXPECTED_MAIL_SENDER)) {
      console.log("-> Loading process...");
      try {
        await startAssignProcess();
        console.log("-> Email processing completed!!!\n");
      } catch (error) {
        console.error("-> Unexpected error: ", error.message, "\n");
      }
    }
  });

  mailListener.on("server:connected", () => {
    console.log("INFO: Connected to the mail server");
  });

  mailListener.on("server:disconnected", () => {
    console.log("INFO: Disconnected from the mail server. Reconnecting...");
    throw new Error();
  });
};

module.exports = { startEmailListener };
