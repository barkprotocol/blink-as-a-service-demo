import React from 'react'
import { Button } from "@/components/ui/button"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                BARK Protocol ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information that you provide directly to us, such as when you create an account, use our services, or communicate with us. This may include:
              </p>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Your name and email address</li>
                <li>Solana wallet addresses</li>
                <li>Transaction data</li>
                <li>Any other information you choose to provide</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Communicate with you about products, services, and events</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-600">
                Email: privacy@barkprotocol.com<br />
                Address: 123 Barkers Street, Solana City, CC 12345
              </p>
            </section>

            <div className="mt-8 text-gray-500 text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Previous Page
          </Button>
        </div>
      </div>
    </div>
  )
}