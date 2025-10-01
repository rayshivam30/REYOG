'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Globe } from 'lucide-react';

export function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClick = () => {
    const mainButton = document.querySelector<HTMLElement>('.goog-te-gadget-simple');
    if (mainButton) {
      mainButton.click();
    } else {
      console.error('Google Translate button not found.');
    }
    setIsOpen(!isOpen);
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
        padding: 8px 12px;

        /* Appearance */
        background-color: var(--background);
        color: var(--foreground);
        border: 1px solid var(--border);
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        
        /* Font */
        font-size: 14px;
        font-weight: 500;
        font-family: var(--font-sans);

        /* Interaction */
        cursor: pointer;
        transition: all 0.2s ease-in-out;
      }

      /* Hover effect for the button */
      .custom-translate-button:hover {
        background-color: var(--accent);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
      
      /* === ACCESSIBILITY === */
      .custom-translate-button:focus {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
      }
      
      /* === DARK MODE SUPPORT === */
      @media (prefers-color-scheme: dark) {
        .custom-translate-button {
          background-color: var(--background);
          color: var(--foreground);
          border-color: var(--border);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="relative">
      <button 
        className="custom-translate-button" 
        onClick={handleClick}
        aria-label="Translate page"
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4" />
        <span>Translate</span>
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
        id="google-translate-script"
        strategy="afterInteractive"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      />
    </div>
  );
}