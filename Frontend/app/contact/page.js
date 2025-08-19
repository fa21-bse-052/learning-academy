'use client';

import { Mail, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 flex items-center justify-center gap-2">
            <span>📧</span> Get in Touch
          </h1>
          <p className="text-gray-600 mt-2">
            We’d love to hear from you. Reach out for questions, support, or feedback!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Contact Form */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right: Contact Info */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Main Contact</h2>
            <p className="text-gray-700 mb-2">
              CDA Industrial Triangle<br />
              Kahuta Rd, Islamabad
            </p>
            <div className="flex items-center gap-3 text-gray-800 mt-4">
              <Phone className="w-5 h-5 text-red-600" />
              <span>(051) 4490490</span>
            </div>
            <div className="flex items-center gap-3 text-gray-800 mt-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>support@learningacademy.com</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
