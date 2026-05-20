import React from "react"
import { Link, useNavigate } from "react-router-dom"

const PrivacyPolicy = () => {
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
          className="inline-flex items-center gap-2 dark:text-gray-400 hover:text-on-surface mb-8 md:mb-12 transition-colors group bg-transparent border-none cursor-pointer"
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
            Privacy Policy
          </h1>
          <p className="dark:text-gray-300/70 max-w-2xl mx-auto leading-relaxed text-lg">
            Your privacy matters to us. This policy explains how we collect, use, and protect your personal information when you use Campus Marketplace.
          </p>
          <p className="dark:text-gray-400 text-sm mt-4">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Privacy Policy Content */}
        <div className="space-y-8 md:space-y-12">
          {/* Section 1: Introduction */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">1. Introduction</h2>
            <div className="dark:text-gray-300/90 space-y-4 leading-relaxed">
              <p>
                Campus Marketplace ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
              <p>
                By using Campus Marketplace, you consent to the practices described in this policy. We encourage you to read this policy carefully to understand our privacy practices.
              </p>
            </div>
          </div>

          {/* Section 2: Information We Collect */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">2. Information We Collect</h2>
            <div className="dark:text-gray-300/90 space-y-4 leading-relaxed">
              <h3 className="text-xl font-semibold text-on-surface mt-4">Personal Information</h3>
              <p>We may collect the following personal information:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Account credentials (username, password)</li>
                <li>Profile information (profile photo, bio, location)</li>
                <li>Academic affiliation (school, program, etc.)</li>
              </ul>

              <h3 className="text-xl font-semibold text-on-surface mt-4">Usage Information</h3>
              <p>We automatically collect certain information when you use our platform:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Platform usage data (pages visited, features used, time spent)</li>
                <li>Location information (approximate location based on IP address)</li>
                <li>Cookies and similar tracking technologies (see Cookie Policy below)</li>
              </ul>

              <h3 className="text-xl font-semibold text-on-surface mt-4">User Content</h3>
              <p>We store content you voluntarily provide:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>Product listings (descriptions, photos, prices)</li>
                <li>Messages sent through our chat system</li>
                <li>Feedback and reviews you submit</li>
              </ul>
            </div>
          </div>

          {/* Section 3: How We Use Your Information */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">3. How We Use Your Information</h2>
            <div className="dark:text-gray-300/90 space-y-4 leading-relaxed">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>Provide, maintain, and improve our platform</li>
                <li>Create and manage your account</li>
                <li>Facilitate transactions between users</li>
                <li>Enable communication through our messaging system</li>
                <li>Personalize your experience and recommend relevant content</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze platform usage and trends</li>
                <li>Detect, prevent, and address fraudulent or illegal activities</li>
                <li>Enforce our Terms and Conditions</li>
                <li>Send you administrative notifications and updates</li>
              </ul>
            </div>
          </div>

          {/* Section 4: Sharing Your Information */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">4. Sharing Your Information</h2>
            <div className="dark:text-gray-300/90 space-y-4 leading-relaxed">
              <p className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 text-sm">
                <strong className="text-indigo-300">Important:</strong> We do not sell your personal information to third parties.
              </p>

              <p>We may share your information in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li><strong>With other users:</strong> Your profile information (name, profile photo) and product listings are visible to other platform users. Your contact information is only shared when you voluntarily share it through messages or listings.</li>
                <li><strong>Service providers:</strong> We may share information with third-party vendors who provide services on our behalf (e.g., hosting, analytics, customer support). These parties are contractually obligated to use your information only as directed.</li>
                <li><strong>Legal compliance:</strong> We may disclose information if required by law, regulation, or legal process, or to protect our rights, safety, and property.</li>
                <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or asset sale, your information may be transferred as part of the business.</li>
              </ul>
            </div>
          </div>

          {/* Section 5: Data Security */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">5. Data Security</h2>
            <div className="dark:text-gray-300/90 space-y-4 leading-relaxed">
              <p>
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>Secure password hashing and authentication</li>
                <li>Encryption of sensitive data in transit (HTTPS)</li>
                <li>Regular security audits and updates</li>
                <li>Access controls limiting data access to authorized personnel</li>
              </ul>
              <p className="text-sm dark:text-gray-400">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </div>
          </div>

          {/* Section 6: Data Retention */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">6. Data Retention</h2>
            <div className="dark:text-gray-300/90 space-y-4 leading-relaxed">
              <p>We retain your personal information for as long as necessary to:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>Provide our services and maintain your account</li>
                <li>Comply with legal obligations (e.g., tax, record-keeping)</li>
                <li>Resolve disputes and enforce our agreements</li>
              </ul>
              <p>
                You may request deletion of your account and associated data at any time. Some information may be retained in backup copies for a limited period or as required by law.
              </p>
            </div>
          </div>

          {/* Section 7: Your Rights */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">7. Your Rights & Choices</h2>
            <div className="dark:text-gray-300/90 space-y-4 leading-relaxed">
              <p>Depending on your location, you may have the following rights regarding your personal data:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Restriction:</strong> Object to or restrict certain processing activities</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please contact us using the information provided in the "Contact Us" section.
              </p>
            </div>
          </div>

          {/* Section 8: Cookies & Tracking */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">8. Cookies & Tracking</h2>
            <div className="dark:text-gray-300/90 space-y-4 leading-relaxed">
              <p>
                We use cookies and similar tracking technologies to enhance your experience, analyze platform usage, and personalize content. You can manage cookie preferences through your browser settings.
              </p>
              <p>Types of cookies we use:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li><strong>Essential cookies:</strong> Required for platform functionality</li>
                <li><strong>Authentication cookies:</strong> Keep you logged in securely</li>
                <li><strong>Analytics cookies:</strong> Help us understand user behavior</li>
                <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </div>
          </div>

          {/* Section 9: Third-Party Services */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">9. Third-Party Services</h2>
            <div className="dark:text-gray-300/90 space-y-4 leading-relaxed">
              <p>
                Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party services you interact with.
              </p>
            </div>
          </div>

          {/* Section 10: Children's Privacy */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">10. Children's Privacy</h2>
            <div className="dark:text-gray-300/90 space-y-4 leading-relaxed">
              <p>
                Campus Marketplace is intended for use by members of the campus community. We do not knowingly collect personal information from individuals under the age of 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </div>
          </div>

          {/* Section 11: Changes to This Policy */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">11. Changes to This Privacy Policy</h2>
            <div className="dark:text-gray-300/90 space-y-4 leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" date. If we make material changes, we will notify you through our platform or by other reasonable means.
              </p>
              <p className="text-sm dark:text-gray-400">
                Your continued use of Campus Marketplace after any changes constitutes your acceptance of the updated Privacy Policy.
              </p>
            </div>
          </div>

          {/* Section 12: Contact Us */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-on-surface">12. Contact Us</h2>
            <div className="dark:text-gray-300/90 space-y-4 leading-relaxed">
              <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                <p className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-cyan-400">email</span>
                  <span>privacy@campusmarketplace.com</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-cyan-400">admin</span>
                  <span>Privacy Office, Campus Marketplace Team</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-20"></div>
      </div>
    </section>
  )
}

export default PrivacyPolicy
