

import nodemailer from 'nodemailer'
import mailgen from 'mailgen'


const sendMail = async ( userEmail, userName ) =>
{
    const transporter = nodemailer.createTransport( {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    } )
    const mailGenerator = new mailgen( {
        theme: "default",
        product: {
            name: "Blog App",
        }
    } )
    const email = {
        body: {
            name: "Hello " + userName,
            intro: "Welcome to Blog App! We're very excited to have you on board.",
            action: {
                instructions: "To verify your account, click here:",
                button: {
                    color: "#bc621d",
                    text: "Verify Account",
                    link: "https://yourwebsite.com/verify",
                },
            },
            outro: "Need help? Just reply to this email.",
        },
    };

    const emailHtml = mailGenerator.generate( email );

    const emailText = mailGenerator.generatePlaintext( email );

    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: "Blog App - Email Verification",
        html: emailHtml,
        text: emailText,
    };
    try
    {
        await transporter.sendMail( mailOptions )
    } catch ( error )
    {
        console.log( "mail error:- ", error );

    }
}

export { sendMail }