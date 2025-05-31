import nodemailer from "nodemailer";
import "dotenv/config"

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
});

export const sendEmail = async({to,subject,text})=>{
    const mailOptions={
        from:process.env.EMAIL,
        to,
        subject,
        text
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log("email sent to ",to)
        
    } catch (error) {
          console.error("Email sending failed:", error);
    throw new Error("Failed to send email");
    }

}