"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import styles from "../page.module.css";

interface VerificationResult {
  success: boolean;
  status: string;
  reference: string;
  externalReference?: string;
  error?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      // Try to get reference from URL params or localStorage
      const urlReference =
        searchParams.get("reference") || searchParams.get("transaction_id");
      const storedReference = localStorage.getItem("lastPaymentRef");
      const provider = localStorage.getItem("lastPaymentProvider");
      const reference = urlReference || storedReference;

      if (!reference) {
        setResult({
          success: false,
          status: "UNKNOWN",
          reference: "",
          error: "No payment reference found",
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/${provider}/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });

        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error("Verification error:", error);
        setResult({
          success: false,
          status: "ERROR",
          reference: reference,
          error: "Failed to verify payment",
        });
      } finally {
        setLoading(false);
        // Clear stored reference
        localStorage.removeItem("lastPaymentRef");
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Verifying your payment...</p>
      </div>
    );
  }

  const isSuccess = result?.status === "SUCCESS";
  const isPending = result?.status === "PENDING";

  return (
    <div className={styles.successContainer}>
      <div
        className={`${styles.statusIcon} ${isSuccess ? styles.success : ""}`}
      >
        {isSuccess ? "✅" : isPending ? "⏳" : "❌"}
      </div>

      <h1 className={styles.statusTitle}>
        {isSuccess
          ? "Payment Successful!"
          : isPending
          ? "Payment Pending"
          : "Payment Failed"}
      </h1>

      <p className={styles.statusMessage}>
        {isSuccess
          ? "Your payment has been processed successfully. Thank you for your purchase!"
          : isPending
          ? "Your payment is still being processed. Please check back later."
          : result?.error || "Something went wrong with your payment."}
      </p>

      {result && result.reference && (
        <div className={styles.detailsCard}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Status</span>
            <span
              className={`${styles.detailValue} ${styles.status} ${
                styles[result.status]
              }`}
            >
              {result.status}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Reference</span>
            <span className={styles.detailValue}>{result.reference}</span>
          </div>
          {result.externalReference && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Transaction ID</span>
              <span className={styles.detailValue}>
                {result.externalReference}
              </span>
            </div>
          )}
        </div>
      )}

      <Link href="/" className={styles.backButton}>
        ← Make Another Payment
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Suspense
          fallback={
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p className={styles.loadingText}>Loading...</p>
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </main>
  );
}
