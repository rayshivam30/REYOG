'use client';

import Script from 'next/script';

export function ChatWidget() {
  return (
    <>
      <Script 
        src="//code.tidio.co/xqdpdonnhkjfw0zwz6oj30v2ib9eeqiq.js" 
        strategy="afterInteractive"
        id="tidio-chat"
      />
    </>
  );
}
