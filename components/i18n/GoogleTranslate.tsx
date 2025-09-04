'use client';

import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

export function GoogleTranslate() {
  // This hook will handle loading the Google Translate script
  useGoogleTranslate();

  return (
    // This div is the placeholder where the Google Translate widget will be rendered.
    // Your global.css file will handle all the styling.
    <div id="google_translate_element"></div>
  );
}