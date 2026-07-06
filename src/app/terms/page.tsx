import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--pa)]">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)] hover:text-[var(--brutalist-accent-light)] transition-colors mb-12">
          ← BACK TO HOME
        </Link>

        <h1 className="text-3xl md:text-4xl font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-2">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-[var(--ink3)] uppercase tracking-widest mb-12">
          Last updated: July 2026
        </p>

        <div className="space-y-8 text-sm font-mono text-[var(--ink2)] leading-relaxed">
          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">1. Agreement to terms</h2>
            <p>By accessing and using this website, you agree to be bound by these Terms of Service. If you do not agree, please do not use this website.</p>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">2. Services</h2>
            <p>SMIIT CyberAI Ltd provides AI governance and infrastructure consulting services. The information on this website is for general informational purposes and does not constitute professional advice. A formal engagement letter governs any consulting services.</p>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">3. Intellectual property</h2>
            <p>All content on this website — including text, design, code, and branding — is the intellectual property of SMIIT CyberAI Ltd unless otherwise stated. You may not reproduce, distribute, or create derivative works without written permission.</p>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">4. Booking and engagements</h2>
            <p>Booking a call through our website does not create a consulting engagement. Discovery calls are provided at no charge and carry no obligation. Formal engagements require a signed statement of work.</p>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">5. Limitation of liability</h2>
            <p>To the maximum extent permitted by law, SMIIT CyberAI Ltd shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or reliance on its content.</p>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">6. Third-party links</h2>
            <p>This website may contain links to third-party services (such as booking platforms). We are not responsible for the privacy practices or content of those external sites.</p>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">7. Governing law</h2>
            <p>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">8. Changes</h2>
            <p>We may update these terms from time to time. Continued use of the website constitutes acceptance of any changes.</p>
          </section>

          <section>
            <h2 className="text-base font-mono font-bold uppercase tracking-tight text-[var(--ink)] mb-3">9. Contact</h2>
            <p>For questions about these terms, contact <a href="mailto:hello@smiitcyberai.com" className="text-[var(--brutalist-accent-light)] hover:underline">hello@smiitcyberai.com</a>.</p>
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
