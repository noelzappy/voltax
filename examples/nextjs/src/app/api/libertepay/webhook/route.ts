import { NextRequest, NextResponse } from "next/server";

// This endpoint receives webhook callbacks from LibertePay
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    console.log("Webhook received:", JSON.stringify(payload, null, 2));

    // In a production app, you would:
    // 1. Verify the webhook signature
    // 2. Update your database with the payment status
    // 3. Trigger any necessary business logic

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
