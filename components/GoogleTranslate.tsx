'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export function GoogleTranslate() {
  useEffect(() => {
    // Add mobile-specific styles
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-gadget {
        font-size: 0 !important;
        line-height: 1 !important;
      }
      .goog-te-gadget-simple {
        background: transparent !important;
        border: 1px solid rgba(0,0,0,0.1) !important;
        border-radius: 4px !important;
        padding: 4px 8px !important;
        height: 32px !important;
        min-width: 40px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
      }
      .goog-te-menu-value {
        display: flex !important;
        align-items: center !important;
      }
      .goog-te-menu-value span {
        color: inherit !important;
        font-size: 14px !important;
        border: none !important;
        display: none !important;
      }
      .goog-te-menu-value img {
        display: none !important;
      }
      .goog-te-gadget .goog-te-menu-value:before {
        content: '🌐';
        font-size: 18px;
      }
      /* Mobile styles */
      @media (max-width: 767px) {
        .goog-te-gadget-simple {
          border: none !important;
          padding: 0 !important;
          min-width: 32px !important;
          width: 32px !important;
          height: 32px !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="relative">
      {/* This is the div where the widget will appear */}
      <div id="google_translate_element"></div>

      {/* This is the inline script that defines the initialization function */}
      <Script
        id="google-translate-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new window.google.translate.TranslateElement(
                {
                  pageLanguage: 'en',
                  includedLanguages: 'en,hi,gu,ta,te,kn,mr,bn,pa',
                  layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false,
                },
                'google_translate_element'
              );
            }
          `,
        }}
      />

      {/* This script loads the main Google Translate API */}
      <Script
        id="google-translate-api"
        strategy="afterInteractive"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      />
    </div>
  );
}