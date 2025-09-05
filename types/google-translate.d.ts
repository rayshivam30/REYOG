// Type definitions for Google Translate API
declare namespace google.translate {
  class TranslateElement {
    constructor(options: TranslateElementOptions, elementId: string);
    static InlineLayout: {
      SIMPLE: number;
      HORIZONTAL: number;
      DROPDOWN: number;
    };
  }

  interface TranslateElementOptions {
    pageLanguage: string;
    includedLanguages: string;
    layout: number;
    autoDisplay: boolean;
  }
}

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: typeof google.translate.TranslateElement;
      };
    };
  }
}
