import Stripe from "stripe";
import nodemailer from "nodemailer";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // apiVersion intentionally omitted to match the installed Stripe SDK types
});

async function generateInvoicePdf(opts: {
  session: Stripe.Checkout.Session;
  bookingMinor: number;
  depositMinor: number;
  totalMinor: number;
  currency: string;
}) {
  const { session, bookingMinor, depositMinor, totalMinor, currency } = opts;
  const md = session.metadata ?? {};

  const resortName = md.resortName || "";
  const checkIn = md.checkIn || "";
  const checkOut = md.checkOut || "";
  const nights = md.nights || "";
  const fullName = md.fullName || "";
  const phone = md.phone || "";
  const guests = md.guests || "";

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const marginX = 50;
  let y = 780;

  page.drawText("Amwaj Resorts", {
    x: marginX,
    y,
    size: 18,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText("INVOICE", {
    x: 440,
    y,
    size: 18,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  y -= 35;

  const invoiceNo = session.payment_intent
    ? String(session.payment_intent)
    : session.id;
  const dateStr = new Date().toISOString().slice(0, 10);

  page.drawText(`Invoice No: ${invoiceNo}`, {
    x: marginX,
    y,
    size: 10,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });
  page.drawText(`Date: ${dateStr}`, {
    x: 440,
    y,
    size: 10,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 30;
  page.drawLine({
    start: { x: marginX, y },
    end: { x: 545, y },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });

  y -= 25;
  page.drawText("Customer", {
    x: marginX,
    y,
    size: 12,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  y -= 16;
  const email = session.customer_details?.email || "";
  if (fullName) {
    page.drawText(`Name: ${fullName}`, { x: marginX, y, size: 10, font });
    y -= 14;
  }
  if (email) {
    page.drawText(`Email: ${email}`, { x: marginX, y, size: 10, font });
    y -= 14;
  }
  if (phone) {
    page.drawText(`Phone: ${phone}`, { x: marginX, y, size: 10, font });
    y -= 14;
  }
  if (guests) {
    page.drawText(`Guests: ${guests}`, { x: marginX, y, size: 10, font });
    y -= 14;
  }

  y -= 10;
  page.drawText("Booking", {
    x: marginX,
    y,
    size: 12,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  y -= 16;
  if (resortName) {
    page.drawText(`Resort: ${resortName}`, { x: marginX, y, size: 10, font });
    y -= 14;
  }
  if (checkIn) {
    page.drawText(`Check-in: ${checkIn}`, { x: marginX, y, size: 10, font });
    y -= 14;
  }
  if (checkOut) {
    page.drawText(`Check-out: ${checkOut}`, { x: marginX, y, size: 10, font });
    y -= 14;
  }
  if (nights) {
    page.drawText(`Nights: ${nights}`, { x: marginX, y, size: 10, font });
    y -= 14;
  }

  y -= 25;
  const tableX = marginX;
  const tableW = 495;

  page.drawRectangle({
    x: tableX,
    y,
    width: tableW,
    height: 22,
    color: rgb(0.95, 0.95, 0.95),
  });
  page.drawText("Description", {
    x: tableX + 10,
    y: y + 7,
    size: 10,
    font: fontBold,
  });
  page.drawText("Amount", {
    x: tableX + 410,
    y: y + 7,
    size: 10,
    font: fontBold,
  });

  y -= 22;
  const drawRow = (desc: string, amount: string) => {
    page.drawRectangle({
      x: tableX,
      y,
      width: tableW,
      height: 20,
      color: rgb(1, 1, 1),
    });
    page.drawLine({
      start: { x: tableX, y },
      end: { x: tableX + tableW, y },
      thickness: 1,
      color: rgb(0.9, 0.9, 0.9),
    });
    page.drawText(desc, { x: tableX + 10, y: y + 6, size: 10, font });
    page.drawText(amount, { x: tableX + 410, y: y + 6, size: 10, font });
    y -= 20;
  };

  drawRow("Booking", formatMoneyFromMinor(bookingMinor, currency));
  drawRow("Security Deposit", formatMoneyFromMinor(depositMinor, currency));

  y -= 5;
  page.drawLine({
    start: { x: tableX, y },
    end: { x: tableX + tableW, y },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  y -= 20;
  page.drawText("TOTAL", { x: tableX + 330, y, size: 12, font: fontBold });
  page.drawText(formatMoneyFromMinor(totalMinor, currency), {
    x: tableX + 410,
    y,
    size: 12,
    font: fontBold,
    color: rgb(0.2, 0.45, 0.85),
  });

  y -= 40;
  page.drawText("Payment confirmed by Stripe.", {
    x: marginX,
    y,
    size: 10,
    font,
    color: rgb(0.35, 0.35, 0.35),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

function minorUnitDivisor(currency?: string) {
  const code = (currency || "").toLowerCase();
  return code === "bhd" ? 1000 : 100;
}

function formatMoneyFromMinor(amountMinor: number, currency?: string) {
  const divisor = minorUnitDivisor(currency);
  const code = (currency || "").toUpperCase();
  const fraction = divisor === 1000 ? 3 : 2;
  return `${(amountMinor / divisor).toFixed(fraction)} ${code}`;
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  if (!webhookSecret) {
    return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response("Ignored", { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== "paid") {
    return new Response("Not paid", { status: 200 });
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "").trim();
  const emailFrom = (process.env.EMAIL_FROM || "").trim();
  const appPassword = (process.env.EMAIL_APP_PASSWORD || "").trim();
  const smtpHost = (process.env.EMAIL_SERVER_HOST || "").trim();
  const smtpPort = Number(process.env.EMAIL_SERVER_PORT || 0);
  const smtpUser = (process.env.EMAIL_SERVER_USER || "").trim();
  const smtpPass = (process.env.EMAIL_SERVER_PASSWORD || "").trim();

  if (!adminEmails || !emailFrom) {
    return new Response("Missing email configuration", { status: 500 });
  }

  const recipients = adminEmails
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!recipients.length) {
    return new Response("No recipients", { status: 500 });
  }

  const currency = session.currency || "";
  const md = session.metadata ?? {};

  const resortName = md.resortName || "";
  const checkIn = md.checkIn || "";
  const checkOut = md.checkOut || "";
  const nights = md.nights || "";
  const fullName = md.fullName || "";
  const phone = md.phone || "";
  const guests = md.guests || "";
  const deposit = md.deposit || "";

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 10,
  });

  const bookingMinor = lineItems.data[0]?.amount_total ?? 0;
  const depositMinor = lineItems.data[1]?.amount_total ?? 0;
  const totalMinor = session.amount_total ?? bookingMinor + depositMinor;

  const smtpConfigured =
    Boolean(smtpHost) &&
    Boolean(smtpPort) &&
    Boolean(smtpUser) &&
    Boolean(smtpPass) &&
    smtpPass !== "your_resend_api_key";

  const transport = smtpConfigured
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: true,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    : nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailFrom,
          pass: appPassword,
        },
      });

  const customerEmail = session.customer_details?.email || "";

  const subject = `حجز جديد مدفوع - ${resortName || "Amwaj Resorts"} (${session.id})`;

  const text =
    `تم تأكيد عملية الدفع بنجاح.\n\n` +
    `الشاليه: ${resortName}\n` +
    `الدخول: ${checkIn}\n` +
    `الخروج: ${checkOut}\n` +
    (nights ? `الليالي: ${nights}\n` : "") +
    (guests ? `الضيوف: ${guests}\n` : "") +
    `\n` +
    (fullName ? `الاسم: ${fullName}\n` : "") +
    (phone ? `الهاتف: ${phone}\n` : "") +
    (customerEmail ? `البريد: ${customerEmail}\n` : "") +
    `\n` +
    `رصيد المؤجر (قيمة الحجز): ${formatMoneyFromMinor(bookingMinor, currency)}\n` +
    `مبلغ التأمين (يرجع للضيف): ${formatMoneyFromMinor(depositMinor, currency)}${deposit ? ` (مذكور: ${deposit})` : ""}\n` +
    `الإجمالي: ${formatMoneyFromMinor(totalMinor, currency)}\n` +
    `\n` +
    `رقم العملية: ${session.id}\n`;

  try {
    await transport.sendMail({
      from: emailFrom,
      to: recipients,
      subject,
      text,
    });

    if (customerEmail) {
      const pdfBuffer = await generateInvoicePdf({
        session,
        bookingMinor,
        depositMinor,
        totalMinor,
        currency,
      });

      await transport.sendMail({
        from: emailFrom,
        to: customerEmail,
        subject: `فاتورة الحجز - ${resortName || "Amwaj Resorts"}`,
        text:
          `شكراً لك، تم تأكيد عملية الدفع بنجاح.\n` +
          `تم إرفاق الفاتورة بصيغة PDF.\n\n` +
          `رقم العملية: ${session.id}\n`,
        attachments: [
          {
            filename: `invoice-${session.id}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });
    }
  } catch {
    return new Response("Failed to send email", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
