'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export function GoogleTranslate() {
  const handleClick = () => {
    const mainButton = document.querySelector('.goog-te-gadget-simple');
    if (mainButton) {
      mainButton.click();
    } else {
      console.error('Google Translate button not found.');
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* === BUTTON STYLES === */
      .custom-translate-button {
        /* Layout & Sizing */
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;

        /* Appearance */
        background-color: #ffffff;
        color: #333333;
        border: 1px solid #dddddd;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        
        /* Font */
        font-size: 14px;
        font-weight: 500;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

        /* Interaction */
        cursor: pointer;
        transition: all 0.2s ease-in-out;
      }

      /* Hover effect for the button */
      .custom-translate-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-color: #cccccc;
      }

      /* Click effect for the button */
      .custom-translate-button:active {
        transform: translateY(0);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }

      /* === STYLES FOR HIDING THE WIDGET === */
      .google-translate-wrapper {
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
        height: 0 !important;
        overflow: hidden !important;
      }
      .goog-te-banner-frame.skiptranslate { display: none !important; }
      body { top: 0px !important; }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div>
      {/* The text inside this button has been changed */}
      <button className="custom-translate-button" onClick={handleClick}>
        <span>A/अ language</span>
      </button>

      {/* The hidden wrapper for the real widget */}
      <div className="google-translate-wrapper">
        <div id="google_translate_element"></div>
      </div>

      {/* The Google scripts */}
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
      <Script
        id="google-translate-api"
        strategy="afterInteractive"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      />
    </div>
  );
}