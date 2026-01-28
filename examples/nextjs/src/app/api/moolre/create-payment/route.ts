import { NextRequest, NextResponse } from "next/server";
import { Voltax, Currency } from "@noelzappy/voltax";

export async function POST(request: NextRequest) {
  try {
    const { amount, email, description } = await request.json();

    // Validate required fields
    if (!amount || !email) {
      return NextResponse.json(
        { error: "Amount and email are required" },
        { status: 400 },
      );
    }

    // Initialize Moolre provider
    const moolre = Voltax("moolre", {
      apiUser: process.env.MOOLRE_API_USER!,
      apiPublicKey: process.env.MOOLRE_API_PUBLIC_KEY!,
      accountNumber: process.env.MOOLRE_ACCOUNT_NUMBER!,
    });

    // Generate a unique reference
    const reference = `voltax-demo-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Initiate payment
    const payment = await moolre.initiatePayment({
      amount: Number(amount),
      email,
      currency: Currency.GHS,
      reference,
      description: description || "Voltax Moolre Demo Payment",
      callbackUrl: `${baseUrl}/api/moolre/webhook`,
      redirectUrl: `${baseUrl}/success`,
      linkReusable: false,
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
