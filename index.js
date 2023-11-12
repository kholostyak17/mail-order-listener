require("dotenv").config();
const express = require("express");
const { startEmailListener } = require("./src/email-listener");
const { startAssignProcess } = require("./src/services");

const app = express();
const port = process.env.PORT || 3000;

startEmailListener(); // <-----

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <span>
          f2b35c54-3026-40f4-8b99-53093d0314db
        </span>
      </body>
    </html>
  `);
});

app.get("/test", async (req, res) => {
  if (process.env.TRY_MODE_ENABLED) {
    try {
      await startAssignProcess();
    } catch (error) {
      console.error("unexpected error:", error.message);
    }

    res.status(200).send();
  } else {
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`INFO: server ready listening on ${port}`);
});
