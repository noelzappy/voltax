import { NextRequest, NextResponse } from "next/server";
import { Voltax, Currency } from "@noelzappy/voltax";

export async function POST(request: NextRequest) {
  try {
    const { amount, email, mobileNumber, description } = await request.json();

    // Validate required fields
    if (!amount || !email) {
      return NextResponse.json(
        { error: "Amount and email are required" },
        { status: 400 }
      );
    }

    // Initialize LibertePay provider
    const libertepay = Voltax("libertepay", {
      secretKey: process.env.LIBERTEPAY_SECRET_KEY!,
      testEnv: process.env.LIBERTEPAY_TEST_ENV === "true",
    });

    // Generate a unique reference
    const reference = `voltax-demo-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;


    // Initiate payment
    const payment = await libertepay.initiatePayment({
      amount: Number(amount),
      email,
      currency: Currency.GHS,
      reference,
      mobileNumber: mobileNumber || undefined,
      description: description || "Voltax LibertePay Demo Payment",
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/libertepay/webhook`,
    });

    console.log("Payment initiated:", payment);

    return NextResponse.json({
      success: true,
      reference: payment.reference,
      authorizationUrl: payment.authorizationUrl,
      externalReference: payment.externalReference,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Payment initiation failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
