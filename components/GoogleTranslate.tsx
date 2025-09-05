'use client';
import Script from 'next/script';
import { Fragment, useEffect, useRef } from 'react';

export function GoogleTranslate() {
  const translateElementRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Clean up previous instance if it exists
    if (translateElementRef.current) {
      translateElementRef.current.innerHTML = '';
    }

    // Only initialize once
    if (!initialized.current && typeof window !== 'undefined' && window.google?.translate) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,gu,ta,te,kn,mr,bn,pa',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
      initialized.current = true;
    }
  }, []);

  return (
    <Fragment>
      <div 
        id="google_translate_element" 
        ref={translateElementRef}
        className="google-translate-container"
        style={{
          minWidth: '120px',
          maxWidth: '200px',
          height: '40px',
          overflow: 'hidden',
          borderRadius: '4px',
        }}
      >
        {/* Fallback content */}
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
          Loading...
        </div>
      </div>

      <style jsx global>{`
        /* Style the Google Translate dropdown */
        .goog-te-gadget {
          font-family: inherit !important;
          color: inherit !important;
        }
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.375rem !important;
          padding: 0.25rem 0.5rem !important;
          font-size: 0.875rem !important;
          line-height: 1.25rem !important;
          cursor: pointer !important;
          transition: all 0.2s ease-in-out !important;
          height: 40px !important;
          display: flex !important;
          align-items: center !important;
        }
        .goog-te-gadget-simple:hover {
          background-color: hsl(var(--muted)) !important;
        }
        .goog-te-menu-value span {
          color: hsl(var(--foreground)) !important;
          text-decoration: none !important;
        }
        .goog-te-menu-value span:hover {
          text-decoration: none !important;
        }
        .goog-te-menu-value img {
          display: none !important;
        }
        /* Mobile optimizations */
        @media (max-width: 767px) {
          .goog-te-gadget-simple {
            width: 100% !important;
            justify-content: space-between !important;
            padding: 0.5rem !important;
          }
          #google_translate_element {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <Script
        id="google-translate-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              if (document.getElementById('google_translate_element')) {
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
            }
            
            // Re-initialize if the component is re-mounted
            if (window.google && window.google.translate) {
              googleTranslateElementInit();
            }
          `,
        }}
      />

      <Script
        id="google-translate-api"
        strategy="afterInteractive"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      />
    </Fragment>
  );
}