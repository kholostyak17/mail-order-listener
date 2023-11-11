const express = require("express");
const { startEmailListener } = require("./src/email-listener");

const app = express();
const port = 3000;

startEmailListener();

app.get("/", (req, res) => {
  res.send("hey, the server is up!!!");
});

app.listen(port, () => {
  console.log(`INFO: server ready listening on ${port}`);
});
