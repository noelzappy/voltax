"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";

interface PaymentResponse {
  success: boolean;
  reference?: string;
  authorizationUrl?: string;
  error?: string;
}

export default function FlutterwavePage() {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/flutterwave/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          email,
          mobileNumber: mobileNumber || undefined,
          customerName: customerName || undefined,
          description: description || undefined,
        }),
      });

      const data: PaymentResponse = await response.json();

      if (data.success && data.authorizationUrl) {
        // Store reference for verification later
        localStorage.setItem("lastPaymentRef", data.reference || "");
        localStorage.setItem("lastPaymentProvider", "flutterwave");
        // Redirect to Flutterwave checkout
        window.location.href = data.authorizationUrl;
      } else {
        setError(data.error || "Payment initiation failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← Back to providers
        </Link>

        <div className={styles.header}>
          <div className={styles.logo}>🦋</div>
          <h1 className={styles.title}>Flutterwave</h1>
          <p className={styles.subtitle}>Africa & Beyond</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="amount" className={styles.label}>
              Amount (NGN)
            </label>
            <input
              type="number"
              id="amount"
              className={styles.input}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5000.00"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="customerName" className={styles.label}>
              Your Name <span className={styles.optional}>(optional)</span>
            </label>
            <input
              type="text"
              id="customerName"
              className={styles.input}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mobileNumber" className={styles.label}>
              Mobile Number <span className={styles.optional}>(optional)</span>
            </label>
            <input
              type="tel"
              id="mobileNumber"
              className={styles.input}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="+234XXXXXXXXXX"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description <span className={styles.optional}>(optional)</span>
            </label>
            <input
              type="text"
              id="description"
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Payment for..."
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              <span className={styles.spinner}>Processing...</span>
            ) : (
              <>
                <span className={styles.buttonIcon}>🦋</span>
                Pay with Flutterwave
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Powered by <strong>Voltax SDK</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
