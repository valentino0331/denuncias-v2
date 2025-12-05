<<<<<<< HEAD
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, code, nombres) => {
    const msg = {
        to: email,
        from: process.env.EMAIL_USER || 'sisdenunciasdg@gmail.com',
        subject: 'Verificación de Cuenta - Denuncias Digitales',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Bienvenido a Denuncias Digitales</h2>
            <p>Hola <strong>${nombres}</strong>,</p>
            <p>Gracias por registrarte. Tu código de verificación es:</p>
            <div style="background-color: #EEF2FF; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <h1 style="color: #4F46E5; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h1>
            </div>
            <p>Este código expirará en 15 minutos.</p>
            <p>Si no solicitaste este registro, por favor ignora este mensaje.</p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
            <p style="color: #6B7280; font-size: 12px;">Este es un mensaje automático, por favor no respondas a este correo.</p>
        </div>
        `,
    };

    try {
        await sgMail.send(msg);
=======
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar transportador de email
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendVerificationEmail = async (email, code, nombres) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verificación de Cuenta - Denuncias Digitales',
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Bienvenido a Denuncias Digitales</h2>
        <p>Hola <strong>${nombres}</strong>,</p>
        <p>Gracias por registrarte. Tu código de verificación es:</p>
        <div style="background-color: #EEF2FF; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <h1 style="color: #4F46E5; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h1>
        </div>
        <p>Este código expirará en 15 minutos.</p>
        <p>Si no solicitaste este registro, por favor ignora este mensaje.</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
        <p style="color: #6B7280; font-size: 12px;">Este es un mensaje automático, por favor no respondas a este correo.</p>
    </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c
        console.log('Email enviado a:', email);
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
<<<<<<< HEAD
        if (error.response) {
            console.error('SendGrid error details:', error.response.body);
        }
=======
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c
        return false;
    }
};

<<<<<<< HEAD
const sendPasswordResetEmail = async (email, code) => {
    const msg = {
        to: email,
        from: process.env.EMAIL_USER || 'sisdenunciasdg@gmail.com',
        subject: 'Recuperación de Contraseña - Denuncias Digitales',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Recuperación de Contraseña</h2>
            <p>Hola,</p>
            <p>Has solicitado restablecer tu contraseña. Tu código de verificación es:</p>
            <div style="background-color: #EEF2FF; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <h1 style="color: #4F46E5; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h1>
            </div>
            <p>Este código expirará en 15 minutos.</p>
            <p>Si no solicitaste este cambio, por favor ignora este mensaje.</p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
            <p style="color: #6B7280; font-size: 12px;">Este es un mensaje automático, por favor no respondas a este correo.</p>
        </div>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Email de recuperación enviado a:', email);
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
        return false;
    }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
=======
module.exports = { sendVerificationEmail };
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c
