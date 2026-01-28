import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // apiVersion intentionally omitted to match the installed Stripe SDK types
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
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
      success_url: `${process.env.NEXT_PUBLIC_SUCCESS_URL}`,
      cancel_url: `${process.env.NEXT_PUBLIC_CANCEL_URL}`,
      ...(email ? { customer_email: email } : {}),
      metadata: {
        resortName,
        checkIn,
        checkOut,
        nights,
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
