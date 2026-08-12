import express from "express";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import { ragEngine } from "./server/ragEngine";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");
const SMTP_FILE = path.join(DATA_DIR, "smtp.json");
const ADMISSIONS_FILE = path.join(DATA_DIR, "admissions.json");
const POPUP_FILE = path.join(DATA_DIR, "popup.json");

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
}
if (!fs.existsSync(ADMISSIONS_FILE)) {
  fs.writeFileSync(ADMISSIONS_FILE, JSON.stringify([], null, 2), "utf-8");
}

const DEFAULT_POPUP = {
  enabled: false,
  imageBase64: "",
  linkUrl: "",
  startDate: "",
  endDate: ""
};

if (!fs.existsSync(POPUP_FILE)) {
  fs.writeFileSync(POPUP_FILE, JSON.stringify(DEFAULT_POPUP, null, 2), "utf-8");
}

const DEFAULT_SMTP = {
  host: "",
  port: 587,
  secure: false,
  user: "",
  pass: "",
  sender: "contactenos@colegiobilingue.edu.co",
  recipient: "contactenos@colegiobilingue.edu.co",
  admissionsRecipient: "admisiones@colegiobilingue.edu.co, contactenos@colegiobilingue.edu.co",
  adminPassword: "admin", // Default password to access panel
  recaptchaEnabled: false,
  recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY || "",
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY || "",
  googleCalendarId: "",
  googleCalendarApiKey: "",
};

if (!fs.existsSync(SMTP_FILE)) {
  fs.writeFileSync(SMTP_FILE, JSON.stringify(DEFAULT_SMTP, null, 2), "utf-8");
}

function getSmtpSettings() {
  try {
    const raw = fs.readFileSync(SMTP_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SMTP,
      ...parsed,
      recaptchaSiteKey: parsed.recaptchaSiteKey || process.env.RECAPTCHA_SITE_KEY || "",
      recaptchaSecretKey: parsed.recaptchaSecretKey || process.env.RECAPTCHA_SECRET_KEY || "",
    };
  } catch (err) {
    return DEFAULT_SMTP;
  }
}

async function sendEmailNotification(submission: any) {
  const smtp = getSmtpSettings();
  if (!smtp.host || !smtp.user || !smtp.pass) {
    console.log("SMTP not configured. Skipping email notification. Saved in inbox locally.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: Number(smtp.port),
    secure: smtp.secure === true || smtp.port === 465,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `"${submission.name} via Web Form" <${smtp.sender || smtp.user}>`,
    to: smtp.recipient || "contactenos@colegiobilingue.edu.co",
    replyTo: submission.email,
    subject: `[Web Contacto] Nuevo mensaje de ${submission.name}`,
    text: `Nuevo mensaje recibido a través del formulario de contacto:\n\n` +
          `Nombre: ${submission.name}\n` +
          `Email: ${submission.email}\n` +
          `Teléfono: ${submission.phone || "No especificado"}\n` +
          `Fecha: ${new Date(submission.createdAt).toLocaleString()}\n\n` +
          `Mensaje:\n${submission.message}\n`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
        <h2 style="color: #1b3a6b; border-bottom: 2px solid #c9a961; padding-bottom: 8px; margin-top: 0;">Nuevo Mensaje de Contacto</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 120px; color: #475569;">Nombre:</td>
            <td style="padding: 6px 0; color: #1e293b;">${submission.name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #475569;">Email:</td>
            <td style="padding: 6px 0; color: #1e293b;"><a href="mailto:${submission.email}">${submission.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #475569;">Teléfono:</td>
            <td style="padding: 6px 0; color: #1e293b;">${submission.phone || "<i>No especificado</i>"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #475569;">Fecha:</td>
            <td style="padding: 6px 0; color: #1e293b;">${new Date(submission.createdAt).toLocaleString()}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 16px; background-color: #ffffff; border-left: 4px solid #c9a961; border-radius: 4px;">
          <h4 style="margin: 0 0 8px 0; color: #1b3a6b;">Mensaje:</h4>
          <p style="margin: 0; color: #334155; white-space: pre-wrap; line-height: 1.5;">${submission.message}</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 24px;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">Fundación Colegio Bilingüe de Valledupar — Portal Institucional</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log("Email notification sent successfully.");
}

async function sendAdmissionsEmailNotification(submission: any) {
  const smtp = getSmtpSettings();
  if (!smtp.host || !smtp.user || !smtp.pass) {
    console.log("SMTP not configured. Skipping email notification. Saved in admissions locally.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: Number(smtp.port),
    secure: smtp.secure === true || smtp.port === 465,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `"${submission.firstName} ${submission.lastName || ""} via Web Form" <${smtp.sender || smtp.user}>`,
    to: smtp.admissionsRecipient || "admisiones@colegiobilingue.edu.co, contactenos@colegiobilingue.edu.co",
    replyTo: submission.email,
    subject: `[Admisiones] Solicitud de ${submission.firstName} ${submission.lastName || ""}`,
    text: `Nueva solicitud de admisiones recibida:\n\n` +
          `Nombre: ${submission.firstName} ${submission.lastName || ""}\n` +
          `Email: ${submission.email}\n` +
          `Teléfono: ${submission.phone || "No especificado"}\n` +
          `Grado de Interés: ${submission.grade || "No especificado"}\n` +
          `Fecha: ${new Date(submission.createdAt).toLocaleString()}\n\n` +
          `Mensaje:\n${submission.message || "Sin mensaje adicional"}\n`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
        <h2 style="color: #1b3a6b; border-bottom: 2px solid #c9a961; padding-bottom: 8px; margin-top: 0;">Nueva Solicitud de Admisiones</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 150px; color: #475569;">Nombre Completo:</td>
            <td style="padding: 6px 0; color: #1e293b;">${submission.firstName} ${submission.lastName || ""}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #475569;">Email:</td>
            <td style="padding: 6px 0; color: #1e293b;"><a href="mailto:${submission.email}">${submission.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #475569;">Teléfono:</td>
            <td style="padding: 6px 0; color: #1e293b;">${submission.phone || "No especificado"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #475569;">Grado de Interés:</td>
            <td style="padding: 6px 0; color: #1e293b;"><strong>${submission.grade || "No especificado"}</strong></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #475569;">Fecha:</td>
            <td style="padding: 6px 0; color: #1e293b;">${new Date(submission.createdAt).toLocaleString()}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 16px; background-color: #ffffff; border-left: 4px solid #c9a961; border-radius: 4px;">
          <h4 style="margin: 0 0 8px 0; color: #1b3a6b;">Mensaje / Notas:</h4>
          <p style="margin: 0; color: #334155; white-space: pre-wrap; line-height: 1.5;">${submission.message || "<i>No se incluyeron notas adicionales.</i>"}</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 24px;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">Fundación Colegio Bilingüe de Valledupar — Portal de Admisiones</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log("Admissions email notification sent successfully.");
}

// Process-level error handling to prevent unexpected crashes in Cloud Run
process.on("unhandledRejection", (reason, promise) => {
  console.error("[Server] Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (error) => {
  console.error("[Server] Uncaught Exception:", error);
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Health check endpoint for Cloud Run and monitoring
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Body parsers
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Helper middleware for admin auth
  const authAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    const smtp = getSmtpSettings();
    if (authHeader && authHeader === `Bearer ${smtp.adminPassword}`) {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized admin access" });
    }
  };

  // Public API Route: Get public reCAPTCHA config for frontend
  app.get("/api/recaptcha-config", (req, res) => {
    try {
      const smtp = getSmtpSettings();
      res.json({
        enabled: smtp.recaptchaEnabled === true,
        siteKey: smtp.recaptchaSiteKey || "",
      });
    } catch (error) {
      res.json({ enabled: false, siteKey: "" });
    }
  });

  // API Route: Save submission
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, message, recaptchaToken } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing required fields (name, email, message)" });
      }

      // Verify reCAPTCHA if enabled
      const smtp = getSmtpSettings();
      if (smtp.recaptchaEnabled) {
        if (!recaptchaToken) {
          return res.status(400).json({ error: "Missing reCAPTCHA verification token" });
        }
        try {
          const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
          const verifyResponse = await fetch(verifyUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${encodeURIComponent(smtp.recaptchaSecretKey)}&response=${encodeURIComponent(recaptchaToken)}`,
          });
          const verifyData: any = await verifyResponse.json();
          if (!verifyData.success) {
            return res.status(400).json({ error: "reCAPTCHA verification failed" });
          }
        } catch (verifyErr) {
          console.error("reCAPTCHA validation error:", verifyErr);
          return res.status(500).json({ error: "reCAPTCHA verification system error" });
        }
      }

      const newSubmission = {
        id: Date.now().toString(),
        name,
        email,
        phone: phone || "",
        message,
        createdAt: new Date().toISOString(),
      };

      // 1. Save locally
      const fileData = fs.readFileSync(DATA_FILE, "utf-8");
      const submissions = JSON.parse(fileData);
      submissions.push(newSubmission);
      fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2), "utf-8");

      // 2. Dispatch real email notification asynchronously via SMTP (doesn't block response)
      try {
        await sendEmailNotification(newSubmission);
      } catch (emailError) {
        console.error("Failed to send SMTP email notification:", emailError);
        // We do not fail the request because we want local tracking to still succeed
      }

      res.status(201).json({ success: true, submission: newSubmission });
    } catch (error) {
      console.error("Error saving submission:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Protected API Route: Get all submissions
  app.get("/api/admin/contact", authAdmin, (req, res) => {
    try {
      const fileData = fs.readFileSync(DATA_FILE, "utf-8");
      const submissions = JSON.parse(fileData);
      res.json(submissions);
    } catch (error) {
      console.error("Error reading submissions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Protected API Route: Delete submission
  app.delete("/api/admin/contact/:id", authAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const fileData = fs.readFileSync(DATA_FILE, "utf-8");
      let submissions = JSON.parse(fileData);
      submissions = submissions.filter((sub: any) => sub.id !== id);
      fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2), "utf-8");
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting submission:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Helper to generate dynamic mock events relative to current month/year
  function getMockEvents() {
    const currentMonth = new Date().getMonth(); // 0-indexed
    
    const createDate = (monthOffset: number, day: number, hour: number) => {
      const d = new Date();
      d.setMonth(currentMonth + monthOffset);
      d.setDate(day);
      d.setHours(hour, 0, 0, 0);
      return d.toISOString();
    };

    return [
      {
        id: "mock-1",
        title: "Inicio del Bimestre Académico",
        description: "Bienvenida a estudiantes y docentes. Inicio formal de clases y asamblea general en el polideportivo.",
        start: createDate(0, 1, 7),
        end: createDate(0, 1, 14),
        allDay: true,
        location: "Campus Principal",
      },
      {
        id: "mock-2",
        title: "Reunión General de Padres de Familia",
        description: "Espacio de integración y socialización sobre las directrices académicas del bimestre actual.",
        start: createDate(0, 5, 18),
        end: createDate(0, 5, 20),
        allDay: false,
        location: "Auditorio Principal Julio Villazón Baquero",
      },
      {
        id: "mock-3",
        title: "Copa Inter-Houses & Día de la Familia",
        description: "Competencias deportivas, danzas, integraciones familiares y recreación entre las casas Red, White y Blue.",
        start: createDate(0, 15, 8),
        end: createDate(0, 15, 16),
        allDay: false,
        location: "Polideportivo y Zonas Verdes",
      },
      {
        id: "mock-4",
        title: "Exámenes Bimestrales",
        description: "Evaluaciones bimonthly académicas acumulativas para todas las asignaturas y niveles.",
        start: createDate(0, 22, 7),
        end: createDate(0, 24, 14),
        allDay: true,
        location: "Aulas de clase",
      },
      {
        id: "mock-5",
        title: "Feria de Ciencia, Tecnología y Arte",
        description: "Exposición pública de proyectos creativos e investigaciones desarrolladas por los estudiantes.",
        start: createDate(0, 28, 9),
        end: createDate(0, 28, 15),
        allDay: false,
        location: "Plaza de la Ciencia",
      },
      {
        id: "mock-6",
        title: "Taller Psicopedagógico para Padres",
        description: "Charla interactiva orientada por psicología escolar acerca del desarrollo emocional y asertividad.",
        start: createDate(1, 10, 18),
        end: createDate(1, 10, 19),
        allDay: false,
        location: "Auditorio de Preescolar",
      },
      {
        id: "mock-7",
        title: "Salida Ecológica y Trabajo Comunitario",
        description: "Inmersión práctica en preservación ecológica y proyectos de impacto social.",
        start: createDate(1, 18, 7),
        end: createDate(1, 18, 14),
        allDay: false,
        location: "Valledupar y alrededores",
      },
      {
        id: "mock-8",
        title: "Clausura del Bimestre y Boletines",
        description: "Ceremonia de mérito académico y entrega formal de calificaciones del bimestre.",
        start: createDate(1, 28, 8),
        end: createDate(1, 28, 12),
        allDay: false,
        location: "Salones de Orientación",
      }
    ];
  }

  // API Route: Google Calendar Events Proxy and Fallback
  app.get("/api/calendar/events", async (req, res) => {
    try {
      const smtp = getSmtpSettings();
      const calendarId = smtp.googleCalendarId;
      const apiKey = smtp.googleCalendarApiKey;

      if (!calendarId || !apiKey) {
        return res.json({ isMock: true, events: getMockEvents() });
      }

      const { timeMin, timeMax } = req.query;
      const tMin = timeMin || new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
      const tMax = timeMax || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${encodeURIComponent(apiKey)}&timeMin=${encodeURIComponent(tMin as string)}&timeMax=${encodeURIComponent(tMax as string)}&singleEvents=true&orderBy=startTime`;

      const response = await fetch(url);
      if (!response.ok) {
        console.warn("Google Calendar request status was not successful:", response.status);
        return res.json({
          statusError: "Failed to fetch from Google Calendar",
          detailsMessage: "Calendar access restricted or ID not found. Ensure the Google Calendar is public.",
          isPrivateOrNotFound: response.status === 404,
          isMock: true,
          events: getMockEvents()
        });
      }

      const data: any = await response.json();
      const events = (data.items || []).map((item: any) => ({
        id: item.id,
        title: item.summary || "Evento sin título",
        description: item.description || "",
        start: item.start?.dateTime || item.start?.date,
        end: item.end?.dateTime || item.end?.date,
        allDay: !!item.start?.date,
        location: item.location || "",
      }));

      res.json({ isMock: false, events });
    } catch (err: any) {
      console.warn("Google Calendar request caught an issue:", err?.message || err);
      res.json({ isMock: true, events: getMockEvents() });
    }
  });

  // API Route: Save admissions submission
  app.post("/api/admissions", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, grade, message, recaptchaToken } = req.body;

      if (!firstName || !email || !phone) {
        return res.status(400).json({ error: "Missing required fields (firstName, email, phone)" });
      }

      // Verify reCAPTCHA if enabled
      const smtp = getSmtpSettings();
      if (smtp.recaptchaEnabled) {
        if (!recaptchaToken) {
          return res.status(400).json({ error: "Missing reCAPTCHA verification token" });
        }
        try {
          const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
          const verifyResponse = await fetch(verifyUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${encodeURIComponent(smtp.recaptchaSecretKey)}&response=${encodeURIComponent(recaptchaToken)}`,
          });
          const verifyData: any = await verifyResponse.json();
          if (!verifyData.success) {
            return res.status(400).json({ error: "reCAPTCHA verification failed" });
          }
        } catch (verifyErr) {
          console.error("reCAPTCHA validation error:", verifyErr);
          return res.status(500).json({ error: "reCAPTCHA verification system error" });
        }
      }

      const newSubmission = {
        id: Date.now().toString(),
        firstName,
        lastName: lastName || "",
        email,
        phone,
        grade: grade || "Preschool",
        message: message || "",
        createdAt: new Date().toISOString(),
      };

      // Save locally
      const fileData = fs.readFileSync(ADMISSIONS_FILE, "utf-8");
      const admissions = JSON.parse(fileData);
      admissions.push(newSubmission);
      fs.writeFileSync(ADMISSIONS_FILE, JSON.stringify(admissions, null, 2), "utf-8");

      // Dispatch real email notification asynchronously via SMTP (doesn't block response)
      try {
        await sendAdmissionsEmailNotification(newSubmission);
      } catch (emailError) {
        console.error("Failed to send SMTP admissions email notification:", emailError);
      }

      res.status(201).json({ success: true, submission: newSubmission });
    } catch (error) {
      console.error("Error saving admissions submission:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Protected API Route: Get all admissions submissions
  app.get("/api/admin/admissions", authAdmin, (req, res) => {
    try {
      const fileData = fs.readFileSync(ADMISSIONS_FILE, "utf-8");
      const admissions = JSON.parse(fileData);
      res.json(admissions);
    } catch (error) {
      console.error("Error reading admissions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Protected API Route: Delete admissions submission
  app.delete("/api/admin/admissions/:id", authAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const fileData = fs.readFileSync(ADMISSIONS_FILE, "utf-8");
      let admissions = JSON.parse(fileData);
      admissions = admissions.filter((item: any) => item.id !== id);
      fs.writeFileSync(ADMISSIONS_FILE, JSON.stringify(admissions, null, 2), "utf-8");
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting admissions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Protected API Route: Get SMTP Config (hiding actual password for security, or returning full details to editing admin)
  app.get("/api/admin/smtp", authAdmin, (req, res) => {
    try {
      const smtp = getSmtpSettings();
      res.json(smtp);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Protected API Route: Update SMTP Config & Admin Password
  app.post("/api/admin/smtp", authAdmin, (req, res) => {
    try {
      const current = getSmtpSettings();
      const updated = {
        host: req.body.host !== undefined ? req.body.host : current.host,
        port: req.body.port !== undefined ? Number(req.body.port) : current.port,
        secure: req.body.secure !== undefined ? req.body.secure === true : current.secure,
        user: req.body.user !== undefined ? req.body.user : current.user,
        pass: req.body.pass !== undefined ? req.body.pass : current.pass,
        sender: req.body.sender !== undefined ? req.body.sender : current.sender,
        recipient: req.body.recipient !== undefined ? req.body.recipient : current.recipient,
        admissionsRecipient: req.body.admissionsRecipient !== undefined ? req.body.admissionsRecipient : current.admissionsRecipient,
        adminPassword: req.body.adminPassword !== undefined ? req.body.adminPassword : current.adminPassword,
        recaptchaEnabled: req.body.recaptchaEnabled !== undefined ? req.body.recaptchaEnabled === true : current.recaptchaEnabled,
        recaptchaSiteKey: req.body.recaptchaSiteKey !== undefined ? req.body.recaptchaSiteKey : current.recaptchaSiteKey,
        recaptchaSecretKey: req.body.recaptchaSecretKey !== undefined ? req.body.recaptchaSecretKey : current.recaptchaSecretKey,
        googleCalendarId: req.body.googleCalendarId !== undefined ? req.body.googleCalendarId : current.googleCalendarId,
        googleCalendarApiKey: req.body.googleCalendarApiKey !== undefined ? req.body.googleCalendarApiKey : current.googleCalendarApiKey,
      };

      fs.writeFileSync(SMTP_FILE, JSON.stringify(updated, null, 2), "utf-8");
      res.json({ success: true, smtp: updated });
    } catch (error) {
      console.error("Error saving SMTP config:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Protected API Route: Send a test email to verify connection
  app.post("/api/admin/smtp/test", authAdmin, async (req, res) => {
    try {
      const smtp = getSmtpSettings();
      if (!smtp.host || !smtp.user || !smtp.pass) {
        return res.status(400).json({ error: "SMTP settings are incomplete" });
      }

      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: Number(smtp.port),
        secure: smtp.secure === true || smtp.port === 465,
        auth: {
          user: smtp.user,
          pass: smtp.pass,
        },
      });

      await transporter.sendMail({
        from: `"Prueba SMTP Bilingüe" <${smtp.sender || smtp.user}>`,
        to: smtp.recipient || "contactenos@colegiobilingue.edu.co",
        subject: "Prueba de configuración de Servidor SMTP",
        text: `¡Felicidades! La conexión SMTP con el portal del Colegio Bilingüe de Valledupar está correctamente configurada.\n\n` +
              `Detalles de Servidor:\n` +
              `- Host: ${smtp.host}\n` +
              `- Puerto: ${smtp.port}\n` +
              `- Seguro: ${smtp.secure ? "Sí" : "No"}\n` +
              `- Usuario: ${smtp.user}\n` +
              `- Fecha: ${new Date().toLocaleString()}\n`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #10b981; border-radius: 12px; background-color: #f0fdf4;">
            <h2 style="color: #047857; margin-top: 0;">✔ Conexión de Servidor Exitosa</h2>
            <p style="color: #065f46; font-size: 14px;">La configuración SMTP para enviar correos electrónicos funciona correctamente.</p>
            <div style="background-color: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #d1fae5; margin-top: 16px;">
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #374151; line-height: 1.6;">
                <li><strong>Servidor Host:</strong> ${smtp.host}</li>
                <li><strong>Puerto:</strong> ${smtp.port}</li>
                <li><strong>Protocolo Seguro:</strong> ${smtp.secure ? "SSL/TLS habilitado" : "Ninguno / STARTTLS"}</li>
                <li><strong>Usuario:</strong> ${smtp.user}</li>
              </ul>
            </div>
            <p style="font-size: 11px; color: #6b7280; text-align: center; margin-top: 24px; margin-bottom: 0;">Prueba Automática de Servidor — Fundación Colegio Bilingüe de Valledupar</p>
          </div>
        `
      });

      res.json({ success: true, message: "Test email sent successfully to " + smtp.recipient });
    } catch (error: any) {
      console.error("SMTP Test failed:", error);
      res.status(500).json({ error: error.message || "Failed to send test email" });
    }
  });

  app.get("/api/popup", (req, res) => {
    try {
      const data = fs.readFileSync(POPUP_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: "Failed to read popup config" });
    }
  });

  app.get("/api/admin/popup", authAdmin, (req, res) => {
    try {
      const data = fs.readFileSync(POPUP_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: "Failed to read popup config" });
    }
  });

  app.post("/api/admin/popup", authAdmin, (req, res) => {
    try {
      fs.writeFileSync(POPUP_FILE, JSON.stringify(req.body, null, 2), "utf-8");
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to save popup config" });
    }
  });

  // Backward compatibility mock for static /api/contact get requests to avoid breaking older UI files
  app.get("/api/contact", (req, res) => {
    try {
      const fileData = fs.readFileSync(DATA_FILE, "utf-8");
      const submissions = JSON.parse(fileData);
      res.json(submissions);
    } catch (error) {
      res.json([]);
    }
  });

  // Google Calendar Proxy Endpoint
  app.get("/api/calendar/events", async (req, res) => {
    try {
      const calendarId = "c_745f306f7f6a4473035ad8e18878e58a3f90247aa82269fc69c91c5ae17e50d0@group.calendar.google.com";
      const apiKey = "AIzaSyCISHPcGyCUzREM12k6HqqFswb3ENq7Iks";

      const timeMin = (req.query.timeMin as string) || new Date(Date.now() - 45 * 86400000).toISOString();
      const timeMax = (req.query.timeMax as string) || new Date(Date.now() + 60 * 86400000).toISOString();

      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
        new URLSearchParams({
          key: apiKey,
          timeMin,
          timeMax,
          singleEvents: "true",
          orderBy: "startTime"
        }).toString();

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Google Calendar API returned status ${response.status}`);
      }
      const data: any = await response.json();
      const events = (data.items || []).map((item: any) => ({
        id: item.id || `gcal_${Math.random()}`,
        title: item.summary || "Evento sin título",
        description: item.description || "",
        start: item.start?.dateTime || item.start?.date,
        end: item.end?.dateTime || item.end?.date,
        allDay: !item.start?.dateTime && !!item.start?.date,
        location: item.location || ""
      }));

      res.json({ isMock: false, events });
    } catch (error: any) {
      console.warn("Dev Calendar API proxy error:", error.message);
      res.json({ isMock: true, events: [] });
    }
  });

  // Dynamic Gallery Setup and Endpoint (reads from src/assets/gallery in dev or dist/src/assets/gallery in prod)
  let galleryDir = path.join(process.cwd(), "src", "assets", "gallery");
  if (process.env.NODE_ENV === "production" || !fs.existsSync(galleryDir)) {
    const prodDir = path.join(process.cwd(), "dist", "src", "assets", "gallery");
    if (fs.existsSync(prodDir)) {
      galleryDir = prodDir;
    }
  }

  if (!fs.existsSync(galleryDir)) {
    fs.mkdirSync(galleryDir, { recursive: true });
  }

  // Serve all raw src/assets statically so hardcoded paths work in production
  app.use("/src/assets", express.static(path.join(process.cwd(), process.env.NODE_ENV === "production" ? "dist/src/assets" : "src/assets")));

  // Gallery API Route (reads dynamically from src/assets/gallery)
  app.get("/api/gallery", (req, res) => {
    try {
      if (!fs.existsSync(galleryDir)) {
        return res.json([]);
      }

      const albums: { id: string; name: string; subfolders: { name: string; images: string[] }[]; images: string[] }[] = [];
      const files = fs.readdirSync(galleryDir, { withFileTypes: true });

      for (const file of files) {
        if (file.isDirectory()) {
          const albumName = file.name;
          const albumPath = path.join(galleryDir, albumName);
          
          const subfolders: { name: string; images: string[] }[] = [];
          const flatImages: string[] = [];
          const albumContents = fs.readdirSync(albumPath, { withFileTypes: true });
          
          // Separate files and subfolders
          for (const entry of albumContents) {
            if (entry.isDirectory()) {
              const subfolderName = entry.name;
              const subfolderPath = path.join(albumPath, subfolderName);
              const subfolderFiles = fs.readdirSync(subfolderPath);
              
              const images = subfolderFiles
                .filter(f => {
                  const ext = path.extname(f).toLowerCase();
                  return [".jpg", ".jpeg", ".png", ".svg", ".webp", ".gif"].includes(ext);
                })
                .map(f => `/src/assets/gallery/${encodeURIComponent(albumName)}/${encodeURIComponent(subfolderName)}/${encodeURIComponent(f)}`);
                
              if (images.length > 0) {
                subfolders.push({
                  name: subfolderName,
                  images: images
                });
                flatImages.push(...images);
              }
            } else {
              // Direct file under the album
              const ext = path.extname(entry.name).toLowerCase();
              if ([".jpg", ".jpeg", ".png", ".svg", ".webp", ".gif"].includes(ext)) {
                flatImages.push(`/src/assets/gallery/${encodeURIComponent(albumName)}/${encodeURIComponent(entry.name)}`);
              }
            }
          }
          
          // If there are direct images, put them in a "General" virtual subfolder
          const directImages = albumContents
            .filter(entry => !entry.isDirectory() && [".jpg", ".jpeg", ".png", ".svg", ".webp", ".gif"].includes(path.extname(entry.name).toLowerCase()))
            .map(entry => `/src/assets/gallery/${encodeURIComponent(albumName)}/${encodeURIComponent(entry.name)}`);
            
          if (directImages.length > 0) {
            subfolders.unshift({
              name: "General",
              images: directImages
            });
          }

          // Sort subfolders (e.g. months/dates)
          subfolders.sort((a, b) => a.name.localeCompare(b.name));

          if (flatImages.length > 0) {
            albums.push({
              id: albumName.toLowerCase().replace(/\s+/g, "-"),
              name: albumName,
              subfolders,
              images: flatImages
            });
          }
        }
      }

      res.json(albums);
    } catch (error) {
      console.error("Error reading gallery folder:", error);
      res.status(500).json({ error: "Failed to read gallery" });
    }
  });

  // Chatbot RAG Route for institutional queries (Manual de Convivencia & PEI)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "El mensaje es requerido." });
      }

      const cleanQuery = message.trim();
      const sanitizedHistory = Array.isArray(history) ? history : [];
      const result = await ragEngine.answerQuestion(cleanQuery, sanitizedHistory);

      return res.json({
        response: result.answer,
        sources: result.sources,
        hasDirectMatch: result.hasDirectMatch,
      });
    } catch (error: any) {
      console.error("[Chat API] Error handling query:", error);
      return res.status(500).json({
        error: "Error interno al consultar los documentos",
        response: "Lo sentimos, ocurrió un inconveniente temporal al consultar los documentos institucionales. Por favor intenta de nuevo en unos momentos.",
        sources: [],
      });
    }
  });

  // Warm up RAG index in the background on startup
  ragEngine.ensureIndexed().catch((err) => {
    console.error("[RAG] Background warm up error:", err);
  });

  // Robust check for production mode vs development mode
  const isProduction = process.env.NODE_ENV === "production" || 
                       (typeof __filename !== "undefined" && (__filename.includes("dist") || __filename.endsWith(".cjs"))) ||
                       !fs.existsSync(path.join(process.cwd(), "server.ts"));

  // Vite middleware for development
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const srcAssetsPath = path.join(distPath, "src", "assets");
    const localAssetsPath = path.join(process.cwd(), "src", "assets");

    if (fs.existsSync(srcAssetsPath)) {
      app.use("/src/assets", express.static(srcAssetsPath));
    }
    if (fs.existsSync(localAssetsPath)) {
      app.use("/src/assets", express.static(localAssetsPath));
    }
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }

    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send("<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'><title>Fundación Colegio Bilingüe</title></head><body><div id='root'></div><script>location.reload();</script></body></html>");
      }
    });
  }

  const port = process.env.PORT || 3000;
  
  if (typeof port === "string" && isNaN(Number(port))) {
    // For Hostinger/Passenger using Unix sockets
    app.listen(port, () => {
      console.log(`Server running on Unix socket: ${port}`);
    });
  } else {
    // For Cloud Run and local dev requiring 0.0.0.0 binding
    app.listen(Number(port), "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  }
}

startServer();
