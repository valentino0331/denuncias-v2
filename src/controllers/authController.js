const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
<<<<<<< HEAD
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');


const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
=======
const { sendVerificationEmail } = require('../utils/emailService');


const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c
};


exports.register = async (req, res) => {
    const {
<<<<<<< HEAD
        dni,
        nombres,
        apellidoPaterno,
        apellidoMaterno,
        fechaNacimiento,
        telefono,
        email,
        password,
        direccion,
        distrito,
=======
    dni,
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    fechaNacimiento,
    telefono,
    email,
    password,
    direccion,
    distrito,
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c
    } = req.body;

    try {

<<<<<<< HEAD
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR dni = $2',
            [email, dni]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El correo o DNI ya está registrado'
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationCode = generateVerificationCode();//cod veri


        const result = await pool.query( //ussuarioo.
=======
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR dni = $2',
        [email, dni]
    );

    if (userExists.rows.length > 0) {
        return res.status(400).json({ 
        success: false, 
        message: 'El correo o DNI ya está registrado' 
        });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = generateVerificationCode();//cod veri


    const result = await pool.query( //ussuarioo.
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c
            `INSERT INTO users (
            dni, nombres, apellido_paterno, apellido_materno,
            fecha_nacimiento, telefono, email, password,
            direccion, distrito,
            verification_code, is_admin
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id, email, nombres`,
            [
<<<<<<< HEAD
                dni, nombres, apellidoPaterno, apellidoMaterno,
                fechaNacimiento, telefono, email, hashedPassword,
                direccion, distrito,
                verificationCode, false
            ]
        );
        const newUser = result.rows[0];


        await sendVerificationEmail(email, verificationCode, nombres);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado. Revisa tu correo para verificar tu cuenta.',
            userId: newUser.id,
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario'
        });
=======
            dni, nombres, apellidoPaterno, apellidoMaterno,
            fechaNacimiento, telefono, email, hashedPassword,
            direccion, distrito,
            verificationCode, false
            ]
        );
    const newUser = result.rows[0];


    await sendVerificationEmail(email, verificationCode, nombres);

    res.status(201).json({
        success: true,
        message: 'Usuario registrado. Revisa tu correo para verificar tu cuenta.',
        userId: newUser.id,
    });
    } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
        success: false, 
        message: 'Error al registrar usuario' 
    });
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c
    }
};


exports.verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    try {
<<<<<<< HEAD
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND verification_code = $2',
            [email, code]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Código de verificación incorrecto'
            });
        }

        await pool.query(
            'UPDATE users SET email_verified = TRUE, verification_code = NULL WHERE email = $1',
            [email]
        );

        res.json({
            success: true,
            message: 'Email verificado exitosamente',
        });
    } catch (error) {
        console.error('Error en verificación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar email'
        });
=======
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND verification_code = $2',
        [email, code]
    );

    if (result.rows.length === 0) {
        return res.status(400).json({ 
        success: false, 
        message: 'Código de verificación incorrecto' 
        });
    }

    await pool.query(
        'UPDATE users SET email_verified = TRUE, verification_code = NULL WHERE email = $1',
        [email]
    );

    res.json({
        success: true,
        message: 'Email verificado exitosamente',
    });
    } catch (error) {
    console.error('Error en verificación:', error);
    res.status(500).json({ 
        success: false, 
        message: 'Error al verificar email' 
    });
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c
    }
};


exports.login = async (req, res) => {//--Log
    const { email, password } = req.body;

    console.log('Intento de login:', email);
    console.log('Password recibido:', password);

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        console.log('Usuario encontrado:', result.rows.length > 0);

        if (result.rows.length === 0) {
            console.log('Usuario no existe en la BD');
<<<<<<< HEAD
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
=======
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales incorrectas' 
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c
            });
        }

        const user = result.rows[0];

        console.log('Email verificado:', user.email_verified);
        console.log('Es admin:', user.is_admin);
        console.log('Hash en BD:', user.password);

        if (!user.email_verified) {
            console.log('Email no verificado');
<<<<<<< HEAD
            return res.status(403).json({
                success: false,
                message: 'Por favor verifica tu correo electrónico primero'
=======
            return res.status(403).json({ 
                success: false, 
                message: 'Por favor verifica tu correo electrónico primero' 
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c
            });
        }

        console.log('Comparando contraseñas...');
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('Contraseña válida:', isValidPassword);

        if (!isValidPassword) {
            console.log('Contraseña incorrecta');
<<<<<<< HEAD
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
=======
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales incorrectas' 
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c
            });
        }


        const token = jwt.sign(//tonk jwt
            { userId: user.id, isAdmin: user.is_admin },
            process.env.JWT_SECRET || 'tu_secreto_jwt',
            { expiresIn: '24h' }
        );

        console.log('Login exitoso para:', email);

        res.json({
            success: true,
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                dni: user.dni,
                nombres: user.nombres,
                apellidoPaterno: user.apellido_paterno,
                apellidoMaterno: user.apellido_materno,
                email: user.email,
                telefono: user.telefono,
                direccion: user.direccion,
                distrito: user.distrito,
                isAdmin: user.is_admin,
<<<<<<< HEAD
                reputation: user.reputation,
=======
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c
            },
        });
    } catch (error) {
        console.error('Error en login:', error);
<<<<<<< HEAD
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión'
        });
    }
};

exports.verifyToken = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const user = result.rows[0];

        res.json({
            success: true,
            user: {
                id: user.id,
                dni: user.dni,
                nombres: user.nombres,
                apellidoPaterno: user.apellido_paterno,
                apellidoMaterno: user.apellido_materno,
                email: user.email,
                telefono: user.telefono,
                direccion: user.direccion,
                distrito: user.distrito,
                isAdmin: user.is_admin,
                reputation: user.reputation,
            }
        });
    } catch (error) {
        console.error('Error en verificación de token:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar token'
        });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const code = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await pool.query(
            'INSERT INTO password_resets (email, code, expires_at) VALUES ($1, $2, $3)',
            [email, code, expiresAt]
        );

        await sendPasswordResetEmail(email, code);

        res.json({ success: true, message: 'Código de recuperación enviado' });
    } catch (error) {
        console.error('Error en forgotPassword:', error);
        res.status(500).json({ success: false, message: 'Error al procesar solicitud' });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    try {
        const resetResult = await pool.query(
            'SELECT * FROM password_resets WHERE email = $1 AND code = $2 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
            [email, code]
        );

        if (resetResult.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Código inválido o expirado' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
        await pool.query('DELETE FROM password_resets WHERE email = $1', [email]);

        res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error en resetPassword:', error);
        res.status(500).json({ success: false, message: 'Error al restablecer contraseña' });
    }
};
=======
        res.status(500).json({ 
            success: false, 
            message: 'Error al iniciar sesión' 
        });
    }
};
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c
