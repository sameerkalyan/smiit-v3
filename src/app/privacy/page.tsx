import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--pa)]">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)] hover:text-[var(--brutalist-accent-light)] transition-colors mb-12">
          ← BACK TO HOME
        </Link>

        <h1 className="text-3xl md:text-4xl font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-[var(--ink3)] uppercase tracking-widest mb-12">
          Last updated: July 2026
        </p>

        <div className="space-y-8 text-sm font-mono text-[var(--ink2)] leading-relaxed">
          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">1. Who we are</h2>
            <p>SMIIT CyberAI Ltd is a London-based AI governance and infrastructure consultancy. Our registered office is in London, United Kingdom. We are the data controller for the personal information we process.</p>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">2. What data we collect</h2>
            <p>We may collect the following personal data:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Name and email address (when you subscribe to our newsletter or book a call)</li>
              <li>Company name and job title (when you provide them during booking)</li>
              <li>Usage data collected via cookies and similar technologies (see section 4)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">3. How we use your data</h2>
            <p>We use your personal data to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Respond to enquiries and booking requests</li>
              <li>Send our fortnightly Intelligence Brief newsletter (only with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">4. Cookies</h2>
            <p>We use essential cookies to ensure the website functions correctly. We may also use analytics cookies to understand how visitors use our site. You can manage your cookie preferences at any time via the cookie consent banner.</p>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">5. Data sharing</h2>
            <p>We do not sell your personal data. We may share data with trusted third-party service providers (such as calendar booking and email delivery services) solely for the purposes described above. All processors are bound by data processing agreements.</p>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">6. Your rights</h2>
            <p>Under UK GDPR and the Data Protection Act 2018, you have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request erasure of your data</li>
              <li>Object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">7. Data retention</h2>
            <p>We retain personal data only for as long as necessary for the purposes described above, or as required by law.</p>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">8. Contact</h2>
            <p>For any privacy-related enquiries, contact us at <a href="mailto:hello@smiitcyberai.com" className="text-[var(--brutalist-accent-light)] hover:underline">hello@smiitcyberai.com</a>.</p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--line)]">
          <p className="text-[10px] font-mono text-[var(--ink3)] uppercase tracking-widest">
            © 2026 SMIIT CyberAI Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
