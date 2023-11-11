require("dotenv").config();
const express = require("express");
const { startEmailListener } = require("./src/email-listener");

const app = express();
const port = process.env.PORT || 3000;

startEmailListener();

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

app.listen(port, () => {
  console.log(`INFO: server ready listening on ${port}`);
});
