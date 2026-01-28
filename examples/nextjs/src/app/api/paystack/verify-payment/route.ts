import { NextRequest, NextResponse } from "next/server";
import { Voltax, PaymentStatus } from "@noelzappy/voltax";

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { error: "Transaction reference is required" },
        { status: 400 },
      );
    }

    // Initialize Paystack provider
    const paystack = Voltax("paystack", {
      secretKey: process.env.PAYSTACK_SECRET_KEY!,
    });

    // Verify the transaction
    const result = await paystack.verifyTransaction(reference);
    console.log("Payment verification result:", result);

    return NextResponse.json({
      success: result.status === PaymentStatus.SUCCESS,
      status: result.status,
      reference: result.reference,
      externalReference: result.externalReference,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Payment verification failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
