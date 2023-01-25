const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
require("dotenv").config();
app.use(cors());

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/send-email", upload.array("files"), async (req, res) => {
  try {
    // Get the form data from the request body
    const { name, email, city, pronouns, message } = req.body;
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
      text: `Name: ${name}\nEmail: ${email}\nCity: ${city}\nPronouns: ${pronouns}\nMessage: ${message}`,
      attachments: req.files.map((file) => {
        return {
          filename: file.originalname,
          content: file.buffer,
        };
      }),
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
