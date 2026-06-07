

import nodemailer from 'nodemailer'
import mailgen from 'mailgen'


const sendVerificationEmail = async ( userEmail, userName, VerificationCode ) =>
{

    const transporter = nodemailer.createTransport( {
        service: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD
        }
    } )
    const mailGenerator = new mailgen( {
        theme: "default",
        product: {
            name: "Blog App",
            link: "https://blog-app-ten.vercel.app/",
            logo: process.env.APP_LOGO,
            logoHeight: "120px"
        }
    } )

    const email = {
        body: {
            name: userName,
            intro: "Welcome to Blog App! We're very excited to have you on board.",
            action: {
                instructions: "To verify your account, Use this code:",
                button: {
                    color: "#bc621d",
                    text: VerificationCode.toString(),
                    link: "#",
                },
            },
            outro: "Code will expire in 5 minutes.\nNeed help, or have questions? Just reply to this email, we\'d love to help.",
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
        console.log( "Email send " );

    } catch ( error )
    {
        console.log( "mail error:- ", error );

    }
}

const sendForgotPasswordEmail = async ( userEmail, userName, VerificationCode ) =>
{

    const transporter = nodemailer.createTransport( {
        service: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD
        }
    } )
    const mailGenerator = new mailgen( {
        theme: "default",
        product: {
            name: "Blog App",
            link: "https://blog-app-ten.vercel.app/",
            logo: process.env.APP_LOGO,
            logoHeight: "120px"
        }
    } )

    const email = {
        body: {
            name: userName,
            intro: "Welcome to Blog App! We're very excited to have you on board.",
            action: {
                instructions: "To Reset your password, Use this code:",
                button: {
                    color: "#1dbc52",
                    text: VerificationCode.toString(),
                    link: "#",
                },
            },
            outro: "Code will expire in 5 minutes.\nNeed help, or have questions? Just reply to this email, we\'d love to help.",
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
        console.log( "SMTP Ready" );
    } catch ( error )
    {
        console.log( "mail error:- ", error );
        throw error

    }
}



export { sendVerificationEmail, sendForgotPasswordEmail }