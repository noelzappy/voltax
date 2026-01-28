import { NextRequest, NextResponse } from "next/server";
import { Voltax, PaymentStatus } from "@noelzappy/voltax";

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { error: "Transaction reference is required" },
        { status: 400 }
      );
    }

    // Initialize LibertePay provider
    const libertepay = Voltax("libertepay", {
      secretKey: process.env.LIBERTEPAY_SECRET_KEY!,
      testEnv: process.env.LIBERTEPAY_TEST_ENV === "true",
    });

    // Verify the transaction
    const result = await libertepay.verifyTransaction(reference);
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
