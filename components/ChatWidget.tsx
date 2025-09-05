'use client';

import Script from 'next/script';

export function ChatWidget() {
  return (
    <>
      <style jsx global>{`
        /* Adjust Tidio chat widget position */
        #tidio-chat-iframe {
          bottom: 80px !important;
          right: 20px !important;
        }
        
        @media (min-width: 768px) {
          #tidio-chat-iframe {
            bottom: 20px !important;
          }
        }
      `}</style>
      <Script 
        src="//code.tidio.co/xqdpdonnhkjfw0zwz6oj30v2ib9eeqiq.js" 
        strategy="afterInteractive"
        id="tidio-chat"
      />
    </>
  );
}
