const express = require("express");
const app = express();
app.use(express.json());
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/send-email", async (req, res) => {
  try {
    // Get the form data from the request body
    const { name, email, city, pronouns, files, message } = req.body;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `${email}`, // sender address
      to: "harz5tattoos@gmail.com", // list of receivers
      subject: `${city}`, // Subject line
      text: `Name: ${name}\nEmail: ${email}\nCity: ${city}\nPronouns: ${pronouns}\nMessage: ${message}`, // plain text body
      attachments: files, // add attachments
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.status(200).send("Email sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
