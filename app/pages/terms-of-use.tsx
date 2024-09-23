import React from 'react'
import { Button } from "@/components/ui/button"

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Use</h1>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing or using BARK Protocol or/and Solana Blink's services, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Use of Services</h2>
              <p className="text-gray-600 mb-4">
                You agree to use BARK Protocol's services only for lawful purposes and in accordance with these Terms of Use. You are prohibited from:
              </p>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Using the services in any way that violates any applicable laws or regulations</li>
                <li>Attempting to interfere with or disrupt the integrity or performance of the services</li>
                <li>Attempting to gain unauthorized access to any part of the services or its related systems or networks</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                The content, features, and functionality of BARK Protocol's services are owned by BARK Protocol and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                BARK Protocol and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These Terms of Use shall be governed by and construed in accordance with the laws of the jurisdiction in which BARK Protocol is established, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify or replace these Terms of Use at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Use, please contact us at:
              </p>
              <p className="text-gray-600">
                Email: legal@barkprotocol.com<br />
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