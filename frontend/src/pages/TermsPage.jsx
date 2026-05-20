import React from "react"
import { Link, useNavigate } from "react-router-dom"

const TermsPage = () => {
  const lastUpdated = "April 2, 2025"
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <section className="py-20 md:py-24 relative overflow-hidden min-h-screen">
      {/* Atmospheric background blooms */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/8 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/8 blur-[90px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        {/* Back link */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface mb-8 md:mb-12 transition-colors group bg-transparent border-none cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 gradient-text bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          <p className="text-on-surface-variant/70 max-w-2xl mx-auto leading-relaxed text-lg">
            Please read these terms carefully before using Campus Marketplace. By accessing or using our platform, you agree to be bound by these terms.
          </p>
          <p className="text-on-surface-variant text-sm mt-4">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8 md:space-y-12">
          {/* Section 1: Acceptance */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">1. Acceptance of Terms</h2>
            <div className="text-on-surface-variant/90 space-y-4 leading-relaxed">
              <p>
                Welcome to Campus Marketplace ("we", "our", or "us"). These Terms and Conditions ("Terms") govern your use of our campus marketplace platform, including all content, features, and services offered through our website and mobile application.
              </p>
              <p>
                By accessing, browsing, or using Campus Marketplace, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not access or use the platform.
              </p>
            </div>
          </div>

          {/* Section 2: User Responsibilities */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">2. User Responsibilities</h2>
            <div className="text-on-surface-variant/90 space-y-4 leading-relaxed">
              <p>As a user of Campus Marketplace, you agree to:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>Provide accurate, current, and complete information when creating an account</li>
                <li>Maintain the security of your account credentials and immediately notify us of any unauthorized access</li>
                <li>Use the platform only for lawful purposes and in accordance with these Terms</li>
                <li>Treat other users with respect and engage in fair, honest transactions</li>
                <li>Not create multiple accounts or misuse platform features</li>
                <li>Comply with all applicable campus rules and regulations when conducting transactions</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Product Listings */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">3. Product Listings</h2>
            <div className="text-on-surface-variant/90 space-y-4 leading-relaxed">
              <p>When creating product listings, you agree to:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>Accurately describe the condition, price, and details of items</li>
                <li>Only list items you have the right to sell</li>
                <li>Provide truthful, clear photographs of the items</li>
                <li>Not list prohibited items (see Section 4)</li>
                <li>Update listings promptly when items are no longer available</li>
              </ul>
              <p className="text-sm text-on-surface-variant mt-4">
                We reserve the right to remove any listings that violate these Terms or our community guidelines.
              </p>
            </div>
          </div>

          {/* Section 4: Prohibited Items */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">4. Prohibited Items</h2>
            <div className="text-on-surface-variant/90 space-y-4 leading-relaxed">
              <p>The following items are strictly prohibited on Campus Marketplace:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>Illegal substances, drugs, or drug paraphernalia</li>
                <li>Stolen property or items without proper ownership</li>
                <li>Weapons, firearms, or dangerous objects</li>
                <li>Counterfeit or pirated goods</li>
                <li>Hazardous materials or regulated substances</li>
                <li>Items that infringe on intellectual property rights</li>
                <li>Animals or living organisms (unless permitted by campus policy)</li>
                <li>Adult content or sexually explicit material</li>
                <li>Any items that violate campus, local, state, or federal laws</li>
              </ul>
              <p className="text-sm text-red-300 mt-4">
                Violations may result in immediate account termination and reporting to appropriate authorities.
              </p>
            </div>
          </div>

          {/* Section 5: Transactions */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">5. Transactions & Payments</h2>
            <div className="text-on-surface-variant/90 space-y-4 leading-relaxed">
              <p>Campus Marketplace facilitates connections between buyers and sellers. Users are responsible for:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>Arranging payment methods directly with the other party</li>
                <li>Meeting in safe, public campus locations for exchanges</li>
                <li>Verifying item condition before completing transactions</li>
                <li>Resolving disputes directly when possible</li>
              </ul>
              <p className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 text-sm">
                <strong className="text-indigo-300">Important:</strong> Campus Marketplace does not process payments or hold funds. All transactions occur directly between users. We are not liable for any transaction issues, fraud, or disputes between users.
              </p>
            </div>
          </div>

          {/* Section 6: Privacy */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">6. Privacy Policy</h2>
            <div className="text-on-surface-variant/90 space-y-4 leading-relaxed">
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy. By using Campus Marketplace, you consent to our data practices as described in the Privacy Policy.
              </p>
              <p>
                <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300 underline transition-colors">
                  View Privacy Policy (coming soon)
                </Link>
              </p>
            </div>
          </div>

          {/* Section 7: Modifications */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">7. Modifications to Terms</h2>
            <div className="text-on-surface-variant/90 space-y-4 leading-relaxed">
              <p>
                We reserve the right to update or modify these Terms at any time without prior notice. The most current version will be posted on this page with an updated revision date. Your continued use of Campus Marketplace after any changes constitutes your acceptance of the new Terms.
              </p>
              <p className="text-sm text-on-surface-variant">
                We encourage you to review these Terms periodically for any changes.
              </p>
            </div>
          </div>

          {/* Section 8: Termination */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">8. Account Termination</h2>
            <div className="text-on-surface-variant/90 space-y-4 leading-relaxed">
              <p>We may suspend or terminate your account at our sole discretion if you:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>Violate any provision of these Terms</li>
                <li>Engage in fraudulent or illegal activities</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to circumvent platform security measures</li>
                <li>Create multiple accounts to evade restrictions</li>
              </ul>
              <p>
                Upon termination, your access to the platform will cease, and we may delete your account information. We are not liable to you for any effects of termination.
              </p>
            </div>
          </div>

          {/* Section 9: Disclaimer */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">9. Disclaimer of Warranties</h2>
            <div className="text-on-surface-variant/90 space-y-4 leading-relaxed">
              <p>
                Campus Marketplace is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not guarantee that:
              </p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>The platform will be error-free or uninterrupted</li>
                <li>Defects will be corrected</li>
                <li>The platform meets your specific requirements</li>
                <li>Transactions will be successful or dispute-free</li>
                <li>Listings are accurate or items exist as described</li>
              </ul>
            </div>
          </div>

          {/* Section 10: Limitation of Liability */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">10. Limitation of Liability</h2>
            <div className="text-on-surface-variant/90 space-y-4 leading-relaxed">
              <p>
                To the fullest extent permitted by law, Campus Marketplace and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the platform, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>Loss of data, profits, or business opportunities</li>
                <li>Harm resulting from transactions with other users</li>
                <li>Unauthorized access to or alteration of your data</li>
                <li>Any errors or omissions in content</li>
              </ul>
            </div>
          </div>

          {/* Section 11: Contact */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">11. Contact Us</h2>
            <div className="text-on-surface-variant/90 space-y-4 leading-relaxed">
              <p>If you have any questions or concerns about these Terms & Conditions, please contact us:</p>
              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                <p className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-cyan-400">email</span>
                  <span>support:campusmarketplace@example.com</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-cyan-400"> Phone</span>
                  <span> [Your phone number] </span> </p>
                <p className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-cyan-400"> Location</span>
                  <span> [Your institution name] </span>
                </p>
              </div>
              <p className="text-sm text-on-surface-variant mt-4">
                We typically respond to inquiries within 24-48 business hours.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-20"></div>
      </div>
    </section>
  )
}

export default TermsPage
