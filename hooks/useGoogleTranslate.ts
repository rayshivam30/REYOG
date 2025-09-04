import { useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export function useGoogleTranslate() {
  // The useEffect now runs every time the component mounts.
  useEffect(() => {
    const renderGoogleTranslate = () => {
      // Check if the Google Translate API is available on the window object.
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,gu,ta,te,kn,mr,bn,pa',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element' // The ID of our placeholder div
        );
      }
    };

    // This is the callback function that the Google script will call when it's ready.
    window.googleTranslateElementInit = renderGoogleTranslate;

    // Check if the script already exists on the page to avoid adding it multiple times.
    const existingScript = document.querySelector(
      'script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
    );

    if (existingScript) {
      // If the script is already there, it means the `google` object should be available.
      // We can directly try to render the widget.
      renderGoogleTranslate();
    } else {
      // If the script is not there, create it and add it to the page.
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    // A cleanup function to remove the callback from the window object when the component unmounts.
    return () => {
      window.googleTranslateElementInit = undefined;
    };
  }); // The empty array [] is removed so this effect re-runs on each mount.
}