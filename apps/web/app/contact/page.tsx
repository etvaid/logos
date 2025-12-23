'use client'

import React from 'react';

const ContactPage = () => {
  return (
    <div className="bg-[#0D0D0F] text-[#F5F4F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Contact Us</h1>

        <div className="mb-8">
          <p className="mb-4">
            We'd love to hear from you! Please use the form below to get in touch.
          </p>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="shadow-sm bg-[#1E1E24] border border-[#1E1E24] text-[#F5F4F2] text-sm rounded-lg focus:ring-[#C9A227] focus:border-[#C9A227] block w-full p-2.5"
                placeholder="Your Name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="shadow-sm bg-[#1E1E24] border border-[#1E1E24] text-[#F5F4F2] text-sm rounded-lg focus:ring-[#C9A227] focus:border-[#C9A227] block w-full p-2.5"
                placeholder="Your Email"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="shadow-sm bg-[#1E1E24] border border-[#1E1E24] text-[#F5F4F2] text-sm rounded-lg focus:ring-[#C9A227] focus:border-[#C9A227] block w-full p-2.5"
                placeholder="Your Message"
                required
              />
            </div>

            <button
              type="submit"
              className="py-3 px-5 text-sm font-medium text-[#0D0D0F] bg-[#C9A227] rounded-lg hover:bg-[#b39122] focus:ring-4 focus:outline-none focus:ring-[#1E1E24]"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="border-t border-[#1E1E24] pt-6">
          <h2 className="text-lg font-semibold mb-4">Other Ways to Connect</h2>
          <ul className="space-y-2">
            <li>
              <strong>Email:</strong> hello@logosclassics.com
            </li>
            <li>
              <strong>Twitter:</strong> @LogosClassics
            </li>
            <li>
              <strong>For institutions:</strong> Sales inquiry
            </li>
            <li>
              <strong>For academics:</strong> Collaboration
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;