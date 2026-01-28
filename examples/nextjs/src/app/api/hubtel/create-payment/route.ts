import { NextRequest, NextResponse } from "next/server";
import { Voltax, Currency } from "@noelzappy/voltax";

export async function POST(request: NextRequest) {
  try {
    const { amount, email, mobileNumber, description, returnUrl } =
      await request.json();

    // Validate required fields
    if (!amount || !email) {
      return NextResponse.json(
        { error: "Amount and email are required" },
        { status: 400 },
      );
    }

    // Initialize Hubtel provider
    const hubtel = Voltax("hubtel", {
      clientId: process.env.HUBTEL_CLIENT_ID!,
      clientSecret: process.env.HUBTEL_CLIENT_SECRET!,
      merchantAccountNumber: process.env.HUBTEL_MERCHANT_ACCOUNT_NUMBER!,
    });

    // Generate a unique reference
    const reference = `voltax-demo-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;

    const successUrl =
      returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/success`;

    // Initiate payment
    const payment = await hubtel.initiatePayment({
      amount: Number(amount),
      email,
      currency: Currency.GHS,
      reference,
      mobileNumber: mobileNumber || undefined,
      description: description || "Voltax Hubtel Demo Payment",
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/hubtel/webhook`,
      returnUrl: successUrl,
      cancellationUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/cancelled`,
    });

    return NextResponse.json({
      success: true,
      reference: payment.reference,
      authorizationUrl: payment.authorizationUrl,
      externalReference: payment.externalReference,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Payment initiation failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
