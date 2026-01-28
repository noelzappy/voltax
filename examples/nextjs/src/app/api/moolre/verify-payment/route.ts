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

    // Initialize Moolre provider
    const moolre = Voltax("moolre", {
      apiUser: process.env.MOOLRE_API_USER!,
      apiPublicKey: process.env.MOOLRE_API_PUBLIC_KEY!,
      accountNumber: process.env.MOOLRE_ACCOUNT_NUMBER!,
    });

    // Verify the transaction
    const result = await moolre.verifyTransaction(reference);
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
