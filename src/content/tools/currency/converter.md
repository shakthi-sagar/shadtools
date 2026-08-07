---
id: currency/converter
name: Currency Converter
namespace: currency
status: published
renderer: currency/converter
pattern: converter

summary: Convert global currencies including USD, EUR, GBP, INR, CAD, AUD, JPY, CNY, and BRL with updated exchange rates.

aliases:
  - forex converter
  - exchange rates
  - usd to inr
  - eur to usd
  - money converter

seo:
  title: Currency Converter – Live Global Exchange Rates
  description: Convert foreign currencies instantly with updated exchange rates, instant calculation, and local rate caching.
  primaryKeyword: currency converter
  keywords:
    - exchange rates
    - usd to inr
    - eur to usd
  noindex: false

privacy:
  processing: remote-data
  message: Exchange rates are fetched from public APIs; your input values remain strictly local in your browser.

config:
  defaultFromCurrency: USD
  defaultToCurrency: EUR

features:
  - convert
  - live-rates
  - swap
  - copy

faq:
  - question: "How frequently are foreign exchange rates updated?"
    answer: "Rates are fetched from public exchange rate data providers and cached locally in browser storage for optimal speed and reliability."
  - question: "Are my currency calculations or financial inputs tracked?"
    answer: "Never. Public exchange rate tables are fetched anonymously; your input amounts and conversion queries stay 100% private in your browser."
  - question: "Which global currencies are supported?"
    answer: "Supported major currencies include US Dollar (USD), Euro (EUR), British Pound (GBP), Indian Rupee (INR), Canadian Dollar (CAD), Australian Dollar (AUD), Japanese Yen (JPY), Chinese Yuan (CNY), and Brazilian Real (BRL)."
  - question: "Does this converter work offline?"
    answer: "Yes. If your device goes offline, ShadTools automatically uses previously cached exchange rates to perform accurate conversions."

relatedTools:
  - percentage/calculator
  - units/length
  - base64/encode

featured: true
updatedAt: 2026-08-07
---

## Foreign exchange rate conversion

Currency conversion converts financial values between international currencies based on current foreign exchange (forex) spot rates.

### Understanding exchange rates
- **Base Currency**: The currency you are converting from (e.g., 100 USD).
- **Target Currency**: The currency you are receiving (e.g., EUR).
- **Spot Rate**: The mid-market rate calculated between buying and selling rates on global currency exchanges.
