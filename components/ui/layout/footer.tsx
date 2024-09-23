"use client";

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faDiscord, faGithub, faMedium, faTelegram } from '@fortawesome/free-brands-svg-icons';

const socialLinks = [
  { href: "https://twitter.com/bark_protocol", icon: faTwitter, label: "Twitter" },
  { href: "https://t.me/barkprotocol", icon: faTelegram, label: "Telegram" },
  { href: "https://discord.com/", icon: faDiscord, label: "Discord" },
  { href: "https://medium.com/@barkprotocol", icon: faMedium, label: "Medium" },
  { href: "https://github.com/barkprotocol/blink-as-a-service", icon: faGithub, label: "GitHub" },
];

const footerLinks = [
  { href: "/pages/privacy-policy", label: "Privacy Policy" },
  { href: "/pages/terms-of-use", label: "Terms of Use" },
];

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h2>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
          {socialLinks.map(({ href, icon, label }) => (
            <a 
              key={label}
              href={href} 
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200" 
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={icon} className="h-5 w-5" />
            </a>
          ))}
        </div>
        <div className="mt-4 flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4">
          {footerLinks.map(({ href, label }) => (
            <Link 
              key={label}
              href={href} 
              className="text-sm text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
