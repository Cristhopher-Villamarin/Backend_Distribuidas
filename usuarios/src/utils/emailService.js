const nodemailer = require('nodemailer');

function detectarServicio(email) {
  if (email.includes('@gmail.com')) return 'gmail';
  if (
    email.includes('@hotmail.com') ||
    email.includes('@outlook.com') ||
    email.includes('@live.com') ||
    email.includes('@espe.edu.ec')
  ) {
    return 'hotmail';
  }
  return null;
}

exports.enviarCodigo = async (to, codigo) => {
  const servicio = detectarServicio(process.env.EMAIL_USER);

  if (!servicio) {
    throw new Error('Proveedor de correo no soportado');
  }

  const transporter = nodemailer.createTransport({
    service: servicio, // Detecta automáticamente Gmail, Hotmail, etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Tu App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Código de Verificación 2FA',
    html: `<p>Tu código de verificación es: <strong>${codigo}</strong></p>`
  });

  console.log(`Código enviado a ${to}`);
};