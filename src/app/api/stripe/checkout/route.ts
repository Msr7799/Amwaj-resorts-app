import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // apiVersion intentionally omitted to match the installed Stripe SDK types
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      resortId,
      resortName,
      checkIn,
      checkOut,
      nights,
      totalPrice,
      currency,
      deposit,
      fullName,
      email,
      phone,
      guests,
    } = body;

    const currencyCode = currency === "د.ب" ? "bhd" : "usd";
    const minorUnitMultiplier = currencyCode === "bhd" ? 1000 : 100;

    const bookingAmount = Math.round(Number(totalPrice) * minorUnitMultiplier);
    const depositAmount = Math.round(
      Number(deposit ?? 50) * minorUnitMultiplier
    );

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const defaultSuccessUrl = `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const envSuccessUrl = process.env.NEXT_PUBLIC_SUCCESS_URL;

    const successUrl =
      envSuccessUrl && envSuccessUrl.includes("{CHECKOUT_SESSION_ID}")
        ? envSuccessUrl
        : defaultSuccessUrl;

    const cancelUrl =
      process.env.NEXT_PUBLIC_CANCEL_URL || `${origin}/payment?canceled=1`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currencyCode,
            product_data: {
              name: `حجز ${resortName}`,
              description: `من ${checkIn} إلى ${checkOut} (${nights} ليلة)`,
              metadata: {
                checkIn,
                checkOut,
                nights,
                fullName,
                phone,
              },
            },
            unit_amount: bookingAmount,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: currencyCode,
            product_data: {
              name: "مبلغ التأمين (سيتم إرجاعه)",
              description: "يتم إرجاع مبلغ التأمين عند المغادرة",
            },
            unit_amount: depositAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...(email ? { customer_email: email } : {}),
      metadata: {
        ...(resortId ? { resortId } : {}),
        resortName,
        checkIn,
        checkOut,
        nights,
        currency,
        ...(fullName ? { fullName } : {}),
        phone,
        ...(guests ? { guests } : {}),
        ...(deposit != null ? { deposit: String(deposit) } : {}),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "فشل إنشاء جلسة الدفع" },
      { status: 500 }
    );
  }
}
