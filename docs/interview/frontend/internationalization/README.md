# Internationalization (i18n) Interview Preparation

## Core Concepts

### Internationalization Fundamentals

- **i18n (Internationalization)**: Making applications ready for multiple languages
- **l10n (Localization)**: Adapting content for specific regions/cultures
- **RTL (Right-to-Left)**: Support for languages like Arabic, Hebrew, Persian
- **Cultural Adaptation**: Date formats, number formats, currency, units
- **Text Direction**: Handling bidirectional text and mixed content

### Key Components

- **Translation Management**: Text extraction, translation, and management
- **Formatting**: Dates, numbers, currency, pluralization
- **Layout Adaptation**: RTL layouts, text overflow, font handling
- **Cultural Considerations**: Colors, symbols, imagery, taboos
- **Performance**: Lazy loading of translations, bundle optimization

## Advanced Topics

### Modern i18n Features

- **ICU MessageFormat**: Advanced pluralization and gender rules
- **Dynamic Locale Switching**: Runtime language changes
- **Fallback Chains**: Graceful degradation for missing translations
- **Context-Aware Translations**: Gender, number, and context-specific text
- **Translation Memory**: Reuse and consistency across projects

### Technical Implementation

- **Bundle Splitting**: Code splitting by locale
- **Server-Side Rendering**: SEO-friendly internationalized content
- **API Localization**: Backend support for multiple languages
- **Database Localization**: Storing and retrieving localized content
- **Caching Strategies**: Locale-specific caching

## Common Interview Questions & Answers

### i18n Questions

**Q: What's the difference between i18n and l10n?**
A:

- **i18n (Internationalization)**: Making software ready for multiple languages/regions
- **l10n (Localization)**: Adapting content for specific locales

**i18n Example:**

```javascript
// Making code locale-aware
const dateFormatter = new Intl.DateTimeFormat(locale, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const numberFormatter = new Intl.NumberFormat(locale, {
  style: "currency",
  currency: currencyCode,
});
```

**l10n Example:**

```javascript
// Adapting content for specific locale
const translations = {
  "en-US": {
    greeting: "Hello",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
  },
  "ar-SA": {
    greeting: "مرحبا",
    dateFormat: "DD/MM/YYYY",
    currency: "SAR",
  },
};
```

**Q: How do you implement RTL support in a React application?**
A: Comprehensive RTL implementation:

{% raw %}
```javascript
// RTL support utilities
class RTLSupport {
  constructor() {
    this.rtlLanguages = ["ar", "he", "fa", "ur", "ps", "sd"];
  }

  isRTL(locale) {
    return this.rtlLanguages.includes(locale.split("-")[0]);
  }

  setDocumentDirection(locale) {
    const direction = this.isRTL(locale) ? "rtl" : "ltr";
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }

  getTextAlign(locale) {
    return this.isRTL(locale) ? "right" : "left";
  }

  getFlexDirection(locale) {
    return this.isRTL(locale) ? "row-reverse" : "row";
  }

  getMargin(locale, side) {
    if (this.isRTL(locale)) {
      return side === "left" ? "marginRight" : "marginLeft";
    }
    return side === "left" ? "marginLeft" : "marginRight";
  }
}

// React component with RTL support
function InternationalizedComponent({ locale, children }) {
  const rtlSupport = new RTLSupport();
  const isRTL = rtlSupport.isRTL(locale);

  useEffect(() => {
    rtlSupport.setDocumentDirection(locale);
  }, [locale]);

  return (
    <div
      className={`app ${isRTL ? "rtl" : "ltr"}`}
      style={{
        direction: isRTL ? "rtl" : "ltr",
        textAlign: rtlSupport.getTextAlign(locale),
      }}
    >
      {children}
    </div>
  );
}

// CSS for RTL support
const rtlStyles = `
  .rtl {
    direction: rtl;
    text-align: right;
  }

  .rtl .flex-row {
    flex-direction: row-reverse;
  }

  .rtl .margin-left {
    margin-right: 0;
    margin-left: auto;
  }

  .rtl .padding-left {
    padding-right: 0;
    padding-left: auto;
  }

  .rtl .border-left {
    border-right: none;
    border-left: 1px solid;
  }

  .rtl .float-left {
    float: right;
  }

  .rtl .text-left {
    text-align: right;
  }
`;
```
{% endraw %}

**Q: How do you handle pluralization in different languages?**
A: Advanced pluralization with ICU MessageFormat:

```javascript
class PluralizationManager {
  constructor() {
    this.pluralRules = {
      en: (n) => (n === 1 ? "one" : "other"),
      ar: (n) => {
        if (n === 0) return "zero";
        if (n === 1) return "one";
        if (n === 2) return "two";
        if (n % 100 >= 3 && n % 100 <= 10) return "few";
        if (n % 100 >= 11) return "many";
        return "other";
      },
      ru: (n) => {
        const mod10 = n % 10;
        const mod100 = n % 100;

        if (mod10 === 1 && mod100 !== 11) return "one";
        if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100))
          return "few";
        if (
          mod10 === 0 ||
          [5, 6, 7, 8, 9].includes(mod10) ||
          [11, 12, 13, 14].includes(mod100)
        )
          return "many";
        return "other";
      },
    };
  }

  getPluralForm(locale, count) {
    const language = locale.split("-")[0];
    const rule = this.pluralRules[language] || this.pluralRules.en;
    return rule(count);
  }

  formatMessage(template, values, locale) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      if (key === "count") {
        const count = values[key];
        const pluralForm = this.getPluralForm(locale, count);
        return this.getPluralizedText(values[`${key}_${pluralForm}`], count);
      }
      return values[key] || match;
    });
  }

  getPluralizedText(text, count) {
    return text.replace("{count}", count);
  }
}

// Usage examples
const pluralManager = new PluralizationManager();

const messages = {
  en: {
    items: {
      one: "{count} item",
      other: "{count} items",
    },
    people: {
      one: "{count} person",
      other: "{count} people",
    },
  },
  ar: {
    items: {
      zero: "لا توجد عناصر",
      one: "عنصر واحد",
      two: "عنصران",
      few: "{count} عناصر",
      many: "{count} عنصراً",
      other: "{count} عنصر",
    },
  },
  ru: {
    items: {
      one: "{count} элемент",
      few: "{count} элемента",
      many: "{count} элементов",
      other: "{count} элементов",
    },
  },
};

// Format messages
function formatPluralMessage(key, count, locale) {
  const template = messages[locale][key];
  const values = { count };

  // Add plural forms to values
  Object.keys(template).forEach((form) => {
    values[`count_${form}`] = template[form];
  });

  return pluralManager.formatMessage(
    `{count_${pluralManager.getPluralForm(locale, count)}}`,
    values,
    locale
  );
}

// Examples
console.log(formatPluralMessage("items", 1, "en")); // "1 item"
console.log(formatPluralMessage("items", 5, "en")); // "5 items"
console.log(formatPluralMessage("items", 0, "ar")); // "لا توجد عناصر"
console.log(formatPluralMessage("items", 1, "ar")); // "عنصر واحد"
console.log(formatPluralMessage("items", 2, "ar")); // "عنصران"
```

## Advanced Interview Questions

**Q: How would you implement a complete i18n system for a React application?**
A: Comprehensive i18n system implementation:

{% raw %}
```javascript
// i18n configuration and utilities
class I18nManager {
  constructor(config = {}) {
    this.defaultLocale = config.defaultLocale || "en";
    this.supportedLocales = config.supportedLocales || ["en", "es", "fr", "ar"];
    this.currentLocale = this.defaultLocale;
    this.translations = new Map();
    this.formatters = new Map();
    this.listeners = new Set();

    this.initializeFormatters();
  }

  initializeFormatters() {
    this.supportedLocales.forEach((locale) => {
      this.formatters.set(locale, {
        date: new Intl.DateTimeFormat(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        number: new Intl.NumberFormat(locale),
        currency: new Intl.NumberFormat(locale, {
          style: "currency",
          currency: this.getCurrencyForLocale(locale),
        }),
        relativeTime: new Intl.RelativeTimeFormat(locale, {
          numeric: "auto",
        }),
      });
    });
  }

  getCurrencyForLocale(locale) {
    const currencyMap = {
      en: "USD",
      es: "EUR",
      fr: "EUR",
      ar: "SAR",
      ja: "JPY",
      zh: "CNY",
    };
    return currencyMap[locale] || "USD";
  }

  async loadTranslations(locale) {
    if (this.translations.has(locale)) {
      return this.translations.get(locale);
    }

    try {
      // Dynamic import for code splitting
      const translations = await import(`./locales/${locale}.js`);
      this.translations.set(locale, translations.default);
      return translations.default;
    } catch (error) {
      console.warn(`Failed to load translations for ${locale}:`, error);
      return this.translations.get(this.defaultLocale) || {};
    }
  }

  setLocale(locale) {
    if (!this.supportedLocales.includes(locale)) {
      console.warn(`Locale ${locale} is not supported`);
      return;
    }

    this.currentLocale = locale;
    this.setDocumentAttributes(locale);
    this.notifyListeners();
  }

  setDocumentAttributes(locale) {
    document.documentElement.lang = locale;
    document.documentElement.dir = this.isRTL(locale) ? "rtl" : "ltr";
  }

  isRTL(locale) {
    return ["ar", "he", "fa", "ur"].includes(locale);
  }

  t(key, params = {}) {
    const translations = this.translations.get(this.currentLocale) || {};
    let text = this.getNestedValue(translations, key) || key;

    // Replace parameters
    Object.keys(params).forEach((param) => {
      text = text.replace(new RegExp(`{${param}}`, "g"), params[param]);
    });

    return text;
  }

  getNestedValue(obj, path) {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  formatDate(date, options = {}) {
    const formatter = this.formatters.get(this.currentLocale).date;
    return formatter.format(date);
  }

  formatNumber(number, options = {}) {
    const formatter = this.formatters.get(this.currentLocale).number;
    return formatter.format(number);
  }

  formatCurrency(amount, currency = null) {
    const formatter = this.formatters.get(this.currentLocale).currency;
    if (currency) {
      return new Intl.NumberFormat(this.currentLocale, {
        style: "currency",
        currency,
      }).format(amount);
    }
    return formatter.format(amount);
  }

  formatRelativeTime(value, unit) {
    const formatter = this.formatters.get(this.currentLocale).relativeTime;
    return formatter.format(value, unit);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentLocale));
  }
}

// React hooks for i18n
function useI18n() {
  const [locale, setLocale] = useState(i18n.currentLocale);
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const unsubscribe = i18n.subscribe(async (newLocale) => {
      setLocale(newLocale);
      const newTranslations = await i18n.loadTranslations(newLocale);
      setTranslations(newTranslations);
    });

    // Load initial translations
    i18n.loadTranslations(locale).then(setTranslations);

    return unsubscribe;
  }, []);

  const t = useCallback((key, params) => i18n.t(key, params), [locale]);
  const formatDate = useCallback(
    (date, options) => i18n.formatDate(date, options),
    [locale]
  );
  const formatNumber = useCallback(
    (number, options) => i18n.formatNumber(number, options),
    [locale]
  );
  const formatCurrency = useCallback(
    (amount, currency) => i18n.formatCurrency(amount, currency),
    [locale]
  );

  return {
    locale,
    setLocale: i18n.setLocale.bind(i18n),
    t,
    formatDate,
    formatNumber,
    formatCurrency,
    isRTL: i18n.isRTL(locale),
  };
}

// Translation component
function Trans({ i18nKey, params, children }) {
  const { t } = useI18n();

  if (children) {
    return <span dangerouslySetInnerHTML={{ __html: t(i18nKey, params) }} />;
  }

  return t(i18nKey, params);
}

// Usage in components
function ProductCard({ product }) {
  const { t, formatCurrency, formatDate, isRTL } = useI18n();

  return (
    <div className={`product-card ${isRTL ? "rtl" : "ltr"}`}>
      <h3>{product.name}</h3>
      <p className="price">{formatCurrency(product.price)}</p>
      <p className="date">
        <Trans
          i18nKey="product.addedOn"
          params={{ date: formatDate(product.addedDate) }}
        />
      </p>
      <button>
        <Trans i18nKey="product.addToCart" />
      </button>
    </div>
  );
}
```
{% endraw %}

**Q: How do you handle dynamic content and user-generated text in multiple languages?**
A: Advanced dynamic content handling:

```javascript
class DynamicContentManager {
  constructor() {
    this.contentCache = new Map();
    this.translationMemory = new Map();
    this.userContent = new Map();
  }

  // Handle user-generated content with language detection
  async processUserContent(content, userId) {
    const detectedLanguage = await this.detectLanguage(content);
    const processedContent = await this.processContent(
      content,
      detectedLanguage
    );

    this.userContent.set(userId, {
      content: processedContent,
      language: detectedLanguage,
      timestamp: Date.now(),
    });

    return processedContent;
  }

  async detectLanguage(text) {
    // Use a language detection library or API
    const response = await fetch("/api/detect-language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const { language, confidence } = await response.json();
    return confidence > 0.8 ? language : "en";
  }

  async processContent(content, sourceLanguage) {
    // Handle mixed language content
    const segments = this.segmentContent(content);
    const processedSegments = [];

    for (const segment of segments) {
      const segmentLanguage = await this.detectLanguage(segment.text);

      if (segmentLanguage !== sourceLanguage) {
        // Translate segment to source language
        const translated = await this.translateText(
          segment.text,
          segmentLanguage,
          sourceLanguage
        );
        processedSegments.push({
          ...segment,
          text: translated,
          originalText: segment.text,
          originalLanguage: segmentLanguage,
        });
      } else {
        processedSegments.push(segment);
      }
    }

    return this.reconstructContent(processedSegments);
  }

  segmentContent(content) {
    // Split content into segments (sentences, paragraphs, etc.)
    const segments = [];
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim());

    sentences.forEach((sentence, index) => {
      segments.push({
        id: index,
        text: sentence.trim(),
        type: "sentence",
      });
    });

    return segments;
  }

  async translateText(text, fromLanguage, toLanguage) {
    const cacheKey = `${text}_${fromLanguage}_${toLanguage}`;

    if (this.translationMemory.has(cacheKey)) {
      return this.translationMemory.get(cacheKey);
    }

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from: fromLanguage, to: toLanguage }),
      });

      const { translation } = await response.json();
      this.translationMemory.set(cacheKey, translation);

      return translation;
    } catch (error) {
      console.error("Translation failed:", error);
      return text; // Return original text if translation fails
    }
  }

  reconstructContent(segments) {
    return segments.map((segment) => segment.text).join(". ") + ".";
  }

  // Handle bidirectional text
  processBidirectionalText(text, baseDirection = "ltr") {
    const segments = this.splitBidirectionalText(text);
    const processedSegments = [];

    segments.forEach((segment) => {
      const direction = this.getTextDirection(segment);

      if (direction !== baseDirection) {
        processedSegments.push({
          text: segment,
          direction,
          needsEmbedding: true,
        });
      } else {
        processedSegments.push({
          text: segment,
          direction,
          needsEmbedding: false,
        });
      }
    });

    return this.renderBidirectionalText(processedSegments, baseDirection);
  }

  splitBidirectionalText(text) {
    // Split text into segments based on language/script
    const rtlRegex =
      /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    const segments = [];
    let currentSegment = "";
    let currentDirection = "ltr";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const isRTL = rtlRegex.test(char);
      const charDirection = isRTL ? "rtl" : "ltr";

      if (charDirection !== currentDirection && currentSegment) {
        segments.push(currentSegment);
        currentSegment = "";
        currentDirection = charDirection;
      }

      currentSegment += char;
    }

    if (currentSegment) {
      segments.push(currentSegment);
    }

    return segments;
  }

  getTextDirection(text) {
    const rtlRegex =
      /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return rtlRegex.test(text) ? "rtl" : "ltr";
  }

  renderBidirectionalText(segments, baseDirection) {
    return segments
      .map((segment) => {
        if (segment.needsEmbedding) {
          return `<span dir="${segment.direction}">${segment.text}</span>`;
        }
        return segment.text;
      })
      .join("");
  }

  // Cache management
  clearCache() {
    this.contentCache.clear();
    this.translationMemory.clear();
  }

  getCacheStats() {
    return {
      contentCacheSize: this.contentCache.size,
      translationMemorySize: this.translationMemory.size,
      userContentSize: this.userContent.size,
    };
  }
}
```

## Practical Problems & Solutions

### Problem 1: Implement Locale-Specific Number and Date Formatting

**Challenge**: Create a comprehensive formatting system for different locales.

```javascript
class LocaleFormatter {
  constructor() {
    this.formatters = new Map();
    this.initializeFormatters();
  }

  initializeFormatters() {
    const locales = [
      "en-US",
      "en-GB",
      "es-ES",
      "fr-FR",
      "de-DE",
      "ja-JP",
      "zh-CN",
      "ar-SA",
    ];

    locales.forEach((locale) => {
      this.formatters.set(locale, {
        number: new Intl.NumberFormat(locale),
        currency: new Intl.NumberFormat(locale, { style: "currency" }),
        date: new Intl.DateTimeFormat(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: new Intl.DateTimeFormat(locale, {
          hour: "2-digit",
          minute: "2-digit",
        }),
        relative: new Intl.RelativeTimeFormat(locale, { numeric: "auto" }),
      });
    });
  }

  formatNumber(number, locale, options = {}) {
    const formatter = this.formatters.get(locale)?.number;
    if (!formatter) return number.toString();

    if (
      options.minimumFractionDigits !== undefined ||
      options.maximumFractionDigits !== undefined
    ) {
      return new Intl.NumberFormat(locale, options).format(number);
    }

    return formatter.format(number);
  }

  formatCurrency(amount, locale, currency = null) {
    if (currency) {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).format(amount);
    }

    const formatter = this.formatters.get(locale)?.currency;
    return formatter ? formatter.format(amount) : amount.toString();
  }

  formatDate(date, locale, options = {}) {
    const formatter = this.formatters.get(locale)?.date;
    if (!formatter) return date.toLocaleDateString();

    if (options.format) {
      return new Intl.DateTimeFormat(locale, options).format(date);
    }

    return formatter.format(date);
  }

  formatRelativeTime(value, unit, locale) {
    const formatter = this.formatters.get(locale)?.relative;
    return formatter ? formatter.format(value, unit) : `${value} ${unit}`;
  }

  getLocaleInfo(locale) {
    const formatter = this.formatters.get(locale);
    if (!formatter) return null;

    // Test formatting to determine locale characteristics
    const testNumber = 1234.56;
    const testDate = new Date();

    return {
      locale,
      numberFormat: formatter.number.format(testNumber),
      dateFormat: formatter.date.format(testDate),
      currencyFormat: formatter.currency.format(testNumber),
      isRTL: this.isRTL(locale),
    };
  }

  isRTL(locale) {
    return ["ar", "he", "fa", "ur"].includes(locale.split("-")[0]);
  }

  // Custom formatting for specific use cases
  formatPhoneNumber(phone, locale) {
    const phoneFormats = {
      "en-US": (phone) => {
        const cleaned = phone.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
      },
      "en-GB": (phone) => {
        const cleaned = phone.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{5})(\d{6})$/);
        return match ? `${match[1]} ${match[2]}` : phone;
      },
      "es-ES": (phone) => {
        const cleaned = phone.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
        return match ? `${match[1]} ${match[2]} ${match[3]}` : phone;
      },
    };

    const formatter = phoneFormats[locale] || phoneFormats["en-US"];
    return formatter(phone);
  }

  formatAddress(address, locale) {
    const addressFormats = {
      "en-US": (addr) =>
        `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`,
      "en-GB": (addr) => `${addr.street}, ${addr.city}, ${addr.postcode}`,
      "ja-JP": (addr) =>
        `〒${addr.postcode} ${addr.prefecture}${addr.city}${addr.street}`,
      "ar-SA": (addr) => `${addr.street}، ${addr.city}، ${addr.postcode}`,
    };

    const formatter = addressFormats[locale] || addressFormats["en-US"];
    return formatter(address);
  }
}

// Usage
const formatter = new LocaleFormatter();

// Number formatting
console.log(formatter.formatNumber(1234.56, "en-US")); // "1,234.56"
console.log(formatter.formatNumber(1234.56, "de-DE")); // "1.234,56"
console.log(formatter.formatNumber(1234.56, "ja-JP")); // "1,234.56"

// Currency formatting
console.log(formatter.formatCurrency(1234.56, "en-US")); // "$1,234.56"
console.log(formatter.formatCurrency(1234.56, "de-DE")); // "1.234,56 €"
console.log(formatter.formatCurrency(1234.56, "ja-JP")); // "¥1,235"

// Date formatting
const date = new Date("2023-12-25");
console.log(formatter.formatDate(date, "en-US")); // "December 25, 2023"
console.log(formatter.formatDate(date, "es-ES")); // "25 de diciembre de 2023"
console.log(formatter.formatDate(date, "ja-JP")); // "2023年12月25日"
```

### Problem 2: Create a Dynamic Language Switcher

**Challenge**: Build a language switcher that handles locale changes and maintains user preferences.

```javascript
class LanguageSwitcher {
  constructor() {
    this.currentLocale = this.getStoredLocale() || "en";
    this.supportedLocales = [
      { code: "en", name: "English", flag: "🇺🇸" },
      { code: "es", name: "Español", flag: "🇪🇸" },
      { code: "fr", name: "Français", flag: "🇫🇷" },
      { code: "de", name: "Deutsch", flag: "🇩🇪" },
      { code: "ja", name: "日本語", flag: "🇯🇵" },
      { code: "zh", name: "中文", flag: "🇨🇳" },
      { code: "ar", name: "العربية", flag: "🇸🇦" },
    ];

    this.listeners = new Set();
    this.initializeSwitcher();
  }

  getStoredLocale() {
    return (
      localStorage.getItem("preferred-locale") ||
      navigator.language.split("-")[0] ||
      "en"
    );
  }

  setLocale(locale) {
    if (!this.supportedLocales.find((l) => l.code === locale)) {
      console.warn(`Locale ${locale} is not supported`);
      return;
    }

    this.currentLocale = locale;
    localStorage.setItem("preferred-locale", locale);

    // Update document attributes
    document.documentElement.lang = locale;
    document.documentElement.dir = this.isRTL(locale) ? "rtl" : "ltr";

    // Notify listeners
    this.notifyListeners();

    // Reload translations
    this.loadTranslations(locale);
  }

  isRTL(locale) {
    return ["ar", "he", "fa", "ur"].includes(locale);
  }

  async loadTranslations(locale) {
    try {
      // Dynamic import for code splitting
      const translations = await import(`./locales/${locale}.js`);

      // Update i18n instance
      if (window.i18n) {
        window.i18n.setLocale(locale);
        window.i18n.translations.set(locale, translations.default);
      }

      // Trigger re-render
      this.notifyListeners();
    } catch (error) {
      console.error(`Failed to load translations for ${locale}:`, error);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentLocale));
  }

  initializeSwitcher() {
    this.setLocale(this.currentLocale);
  }

  getCurrentLocale() {
    return this.currentLocale;
  }

  getSupportedLocales() {
    return this.supportedLocales;
  }

  // React component for language switcher
  renderSwitcher() {
    return `
      <div class="language-switcher">
        <button class="current-locale" aria-haspopup="true" aria-expanded="false">
          ${
            this.supportedLocales.find((l) => l.code === this.currentLocale)
              ?.flag
          }
          ${
            this.supportedLocales.find((l) => l.code === this.currentLocale)
              ?.name
          }
        </button>
        <ul class="locale-dropdown" role="menu">
          ${this.supportedLocales
            .map(
              (locale) => `
            <li role="none">
              <button 
                role="menuitem" 
                class="locale-option ${
                  locale.code === this.currentLocale ? "active" : ""
                }"
                data-locale="${locale.code}"
              >
                ${locale.flag} ${locale.name}
              </button>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
  }
}

// React component
function LanguageSwitcherComponent() {
  const [currentLocale, setCurrentLocale] = useState(
    switcher.getCurrentLocale()
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = switcher.subscribe(setCurrentLocale);
    return unsubscribe;
  }, []);

  const handleLocaleChange = (locale) => {
    switcher.setLocale(locale);
    setIsOpen(false);
  };

  const currentLocaleInfo = switcher.supportedLocales.find(
    (l) => l.code === currentLocale
  );

  return (
    <div className="language-switcher">
      <button
        className="current-locale"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {currentLocaleInfo?.flag} {currentLocaleInfo?.name}
      </button>

      {isOpen && (
        <ul className="locale-dropdown" role="menu">
          {switcher.supportedLocales.map((locale) => (
            <li key={locale.code} role="none">
              <button
                role="menuitem"
                className={`locale-option ${
                  locale.code === currentLocale ? "active" : ""
                }`}
                onClick={() => handleLocaleChange(locale.code)}
              >
                {locale.flag} {locale.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## i18n Best Practices

### Translation Management

```javascript
// Translation structure
const translations = {
  en: {
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
    },
    errors: {
      required: "This field is required",
      invalid: "Invalid value",
      network: "Network error occurred",
    },
    messages: {
      saved: "Changes saved successfully",
      deleted: "Item deleted successfully",
    },
  },
  es: {
    common: {
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
    },
    errors: {
      required: "Este campo es obligatorio",
      invalid: "Valor inválido",
      network: "Error de red",
    },
    messages: {
      saved: "Cambios guardados exitosamente",
      deleted: "Elemento eliminado exitosamente",
    },
  },
};

// Translation key management
const TranslationKeys = {
  COMMON: {
    SAVE: "common.save",
    CANCEL: "common.cancel",
    DELETE: "common.delete",
    EDIT: "common.edit",
  },
  ERRORS: {
    REQUIRED: "errors.required",
    INVALID: "errors.invalid",
    NETWORK: "errors.network",
  },
  MESSAGES: {
    SAVED: "messages.saved",
    DELETED: "messages.deleted",
  },
};
```

### Performance Optimization

```javascript
// Lazy loading translations
class TranslationLoader {
  constructor() {
    this.loadedLocales = new Set();
    this.loadingPromises = new Map();
  }

  async loadLocale(locale) {
    if (this.loadedLocales.has(locale)) {
      return;
    }

    if (this.loadingPromises.has(locale)) {
      return this.loadingPromises.get(locale);
    }

    const loadPromise = this.loadLocaleFile(locale);
    this.loadingPromises.set(locale, loadPromise);

    try {
      await loadPromise;
      this.loadedLocales.add(locale);
    } finally {
      this.loadingPromises.delete(locale);
    }
  }

  async loadLocaleFile(locale) {
    const response = await fetch(`/locales/${locale}.json`);
    const translations = await response.json();

    // Store translations
    window.i18n.translations.set(locale, translations);
  }

  preloadLocales(locales) {
    return Promise.all(locales.map((locale) => this.loadLocale(locale)));
  }
}
```

## Resources

### Documentation

- [MDN Internationalization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [ICU MessageFormat](https://formatjs.io/docs/intl-messageformat/)
- [React Intl](https://formatjs.io/docs/react-intl/)
- [i18next](https://www.i18next.com/)

### Tools

- [FormatJS](https://formatjs.io/) - Internationalization library
- [i18next](https://www.i18next.com/) - Internationalization framework
- [Lingui](https://lingui.js.org/) - Internationalization library
- [React Intl](https://formatjs.io/docs/react-intl/) - React internationalization

### Practice Platforms

- [i18n Testing](https://github.com/i18next/i18next-http-backend) - Backend for i18next
- [ICU MessageFormat Examples](https://formatjs.io/docs/intl-messageformat/)
- [RTL Testing](https://rtlcss.com/) - RTL CSS testing

---

_This guide covers essential internationalization concepts for frontend interviews, including practical problems and advanced techniques commonly asked at Big Tech companies._
