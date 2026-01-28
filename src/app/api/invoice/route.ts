import { NextRequest } from "next/server";
import Stripe from "stripe";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id") || "";

  if (!sessionId) {
    return new Response("Missing session_id", { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return new Response("Payment not confirmed", { status: 400 });
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    limit: 10,
  });

  const currency = session.currency || "";
  const md = session.metadata ?? {};

  const resortName = md.resortName || "";
  const checkIn = md.checkIn || "";
  const checkOut = md.checkOut || "";
  const nights = md.nights || "";
  const fullName = md.fullName || "";
  const phone = md.phone || "";
  const guests = md.guests || "";

  const bookingMinor = lineItems.data[0]?.amount_total ?? 0;
  const depositMinor = lineItems.data[1]?.amount_total ?? 0;
  const totalMinor = session.amount_total ?? bookingMinor + depositMinor;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4

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

  const invoiceNo = session.payment_intent ? String(session.payment_intent) : session.id;
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

  // Header
  page.drawRectangle({ x: tableX, y, width: tableW, height: 22, color: rgb(0.95, 0.95, 0.95) });
  page.drawText("Description", { x: tableX + 10, y: y + 7, size: 10, font: fontBold });
  page.drawText("Amount", { x: tableX + 410, y: y + 7, size: 10, font: fontBold });

  y -= 22;

  const drawRow = (desc: string, amount: string) => {
    page.drawRectangle({ x: tableX, y, width: tableW, height: 20, color: rgb(1, 1, 1) });
    page.drawLine({ start: { x: tableX, y }, end: { x: tableX + tableW, y }, thickness: 1, color: rgb(0.9, 0.9, 0.9) });
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

  return new Response(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${session.id}.pdf`,
    },
  });
}
