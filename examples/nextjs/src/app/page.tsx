import Link from "next/link";
import styles from "./page.module.css";

const providers = [
  {
    id: "libertepay",
    name: "LibertePay",
    description: "Accept payments in Ghana via mobile money and cards",
    countries: ["Ghana"],
    icon: "🇬🇭",
    color: "#2563eb",
    status: "ready",
  },
  {
    id: "paystack",
    name: "Paystack",
    description: "Africa's leading payment gateway for Nigeria, Ghana & more",
    countries: ["Nigeria", "Ghana", "South Africa", "Kenya"],
    icon: "💳",
    color: "#00c3f7",
    status: "ready",
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    description: "Seamless payments across Africa and beyond",
    countries: ["Nigeria", "Ghana", "Kenya", "South Africa"],
    icon: "🦋",
    color: "#f5a623",
    status: "ready",
  },
  {
    id: "hubtel",
    name: "Hubtel",
    description: "Ghana's leading mobile commerce platform",
    countries: ["Ghana"],
    icon: "📱",
    color: "#00b894",
    status: "ready",
  },
  {
    id: "moolre",
    name: "Moolre",
    description: "Modern payment solutions for African businesses",
    countries: ["Ghana"],
    icon: "💰",
    color: "#9b59b6",
    status: "ready",
  },
].sort((a, b) => a.name.localeCompare(b.name));

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.heroContainer}>
        <div className={styles.header}>
          <div className={styles.logo}>⚡</div>
          <h1 className={styles.title}>Voltax Demo</h1>
          <p className={styles.subtitle}>The Unified Payment SDK for Africa</p>
          <p className={styles.description}>
            Select a payment provider to test the integration
          </p>
        </div>

        <div className={styles.providerGrid}>
          {providers.map((provider) => (
            <Link
              key={provider.id}
              href={provider.status === "ready" ? `/${provider.id}` : "#"}
              className={`${styles.providerCard} ${
                provider.status === "coming" ? styles.providerCardDisabled : ""
              }`}
              style={
                {
                  "--provider-color": provider.color,
                } as React.CSSProperties
              }
            >
              <div className={styles.providerIcon}>{provider.icon}</div>
              <div className={styles.providerInfo}>
                <h3 className={styles.providerName}>
                  {provider.name}
                  {provider.status === "coming" && (
                    <span className={styles.comingSoon}>Coming Soon</span>
                  )}
                </h3>
                <p className={styles.providerDescription}>
                  {provider.description}
                </p>
                <div className={styles.providerCountries}>
                  {provider.countries.map((country) => (
                    <span key={country} className={styles.countryTag}>
                      {country}
                    </span>
                  ))}
                </div>
              </div>
              {provider.status === "ready" && (
                <div className={styles.providerArrow}>→</div>
              )}
            </Link>
          ))}
        </div>

        <div className={styles.footer}>
          <p>
            Powered by <strong>Voltax SDK</strong>
          </p>
          <p className={styles.footerLink}>
            <a
              href="https://github.com/noelzappy/voltax"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub →
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
