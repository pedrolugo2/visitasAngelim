import * as nodemailer from "nodemailer";

// Email configuration (use environment variables in production)
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "noreply@escolaangelim.com.br",
    pass: process.env.SMTP_PASS || "",
  },
});

interface VisitEmailData {
  parentName: string;
  parentEmail: string;
  childName?: string;
  unitName: string;
  visitDateTime: string; // ISO string
  slotStartTime: string; // ISO string
  slotEndTime: string; // ISO string
}

export async function sendVisitConfirmation(data: VisitEmailData): Promise<void> {
  const formattedDate = new Date(data.visitDateTime).toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(data.slotStartTime).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const mailOptions = {
    from: '"Escola Angelim" <noreply@escolaangelim.com.br>',
    to: data.parentEmail,
    subject: "Confirmação de Visita - Escola Angelim",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #3E2723; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #5B8C5A; color: #FDF8F0; padding: 20px; text-align: center; }
          .content { background: #ffffff; padding: 30px; }
          .footer { background: #f9f5ef; padding: 20px; text-align: center; font-size: 14px; color: #8c7b6b; }
          .button { display: inline-block; padding: 12px 24px; background: #D4874D; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Escola Angelim</h1>
            <p>Educação Waldorf</p>
          </div>
          <div class="content">
            <h2>Visita Confirmada!</h2>
            <p>Olá, ${data.parentName}!</p>
            <p>Sua visita à Escola Angelim foi confirmada com sucesso.</p>

            <h3>Detalhes da Visita:</h3>
            <ul>
              <li><strong>Data:</strong> ${formattedDate}</li>
              <li><strong>Horário:</strong> ${formattedTime}</li>
              <li><strong>Unidade:</strong> ${data.unitName}</li>
              ${data.childName ? `<li><strong>Criança:</strong> ${data.childName}</li>` : ""}
            </ul>

            <p>Estamos muito felizes em recebê-lo(a) em nossa escola!</p>

            <p><strong>Endereço:</strong><br>
            [Endereço da Escola Angelim]</p>

            <p>Em caso de dúvidas, entre em contato conosco.</p>

            <p>Atenciosamente,<br>
            <strong>Equipe Escola Angelim</strong></p>
          </div>
          <div class="footer">
            <p>Escola Angelim - Educação Waldorf<br>
            www.escolaangelim.com.br</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendVisitReminder(data: VisitEmailData): Promise<void> {
  const formattedDate = new Date(data.visitDateTime).toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(data.slotStartTime).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const mailOptions = {
    from: '"Escola Angelim" <noreply@escolaangelim.com.br>',
    to: data.parentEmail,
    subject: "Lembrete: Sua visita é amanhã! - Escola Angelim",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #3E2723; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6BA3BE; color: #FDF8F0; padding: 20px; text-align: center; }
          .content { background: #ffffff; padding: 30px; }
          .footer { background: #f9f5ef; padding: 20px; text-align: center; font-size: 14px; color: #8c7b6b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Lembrete de Visita</h1>
          </div>
          <div class="content">
            <p>Olá, ${data.parentName}!</p>
            <p>Este é um lembrete de que sua visita à Escola Angelim está agendada para <strong>amanhã</strong>!</p>

            <h3>Detalhes:</h3>
            <ul>
              <li><strong>Data:</strong> ${formattedDate}</li>
              <li><strong>Horário:</strong> ${formattedTime}</li>
              <li><strong>Unidade:</strong> ${data.unitName}</li>
            </ul>

            <p>Aguardamos você!</p>

            <p>Atenciosamente,<br>
            <strong>Equipe Escola Angelim</strong></p>
          </div>
          <div class="footer">
            <p>Escola Angelim - Educação Waldorf<br>
            www.escolaangelim.com.br</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}
