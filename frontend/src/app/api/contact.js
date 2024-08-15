import nodemailer from "nodemailer";
import { getSession } from "@auth0/nextjs-auth0";

export async function POST(req) {
  try {
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response("Usuario no autenticado", { status: 401 });
    }
    const { nombre, email, mensaje } = await req.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_EMAIL_USER,
        pass: process.env.NODEMAILER_EMAIL_APP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL_USER,
      to: process.env.NODEMAILER_EMAIL_USER,
      subject: "Formulario Contacto Dionisio",
      text: `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`,
    };

    await transporter.sendMail(mailOptions);

    return new Response("Mensaje enviado correctamente", { status: 200 });
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    return new Response("Error al enviar el mensaje", { status: 500 });
  }
}
