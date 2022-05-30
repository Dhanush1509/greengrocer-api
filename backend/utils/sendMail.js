const dotenv = require("dotenv")
dotenv.config()
const sendMail = (id, name, email, message) => {
  const token = new Token({
    _userId: id,
    token: crypto.randomBytes(16).toString("hex"),
  });
  const tokenSave = token.save();
  if (!tokenSave) {
    res.status(500);
    throw new Error("Error encountered!!");
  }

  // Send email (use credintials of SendGrid)

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    from: process.env.EMAIL,
    to: email,
    subject: "Account Verification Link",
    text:
      "Hello " +
      name +
      ",\n\n" +
      "Please verify your account by clicking the link: \n" +
      process.env.URL +
      "confirmation/" +
      email +
      "/" +
      token.token +
      "\n\nThank You!\n",
  };
  sgMail.send(msg).then(
    () => {
      res.status(200).json({
        message,
      });
    },
    (error) => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
      return res.status(500).json({
        message:
          "Technical Issue!, Please click on resend for verify your Email.",
      });
    }
  );
};
module.exports = sendMail