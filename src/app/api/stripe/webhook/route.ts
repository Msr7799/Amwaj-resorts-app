import Stripe from "stripe";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // apiVersion intentionally omitted to match the installed Stripe SDK types
});

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

  if (!adminEmails || !emailFrom || !appPassword) {
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

  const transport = nodemailer.createTransport({
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
  } catch {
    return new Response("Failed to send email", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
