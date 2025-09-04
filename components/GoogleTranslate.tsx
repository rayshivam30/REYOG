// File: components/GoogleTranslate.js
'use client';
import Script from 'next/script';
import { Fragment } from 'react';

export function GoogleTranslate() {
  return (
    <Fragment>
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
    </Fragment>
  );
}