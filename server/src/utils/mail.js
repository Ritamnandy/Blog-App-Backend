

import nodemailer from 'nodemailer'
import mailgen from 'mailgen'


const sendVerificationEmail = async ( userEmail, userName, VerificationCode ) =>
{
    const transporter = nodemailer.createTransport( {
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD
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
                instructions: "To verify your account, Use this code:",
                button: {
                    color: "#bc621d",
                    text: VerificationCode.toString(),
                    link: "#",
                },
            },
            outro:"Code will expire in 5 minutes",
            outro: "Need help, or have questions? Just reply to this email, we\'d love to help.",
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

export { sendVerificationEmail }