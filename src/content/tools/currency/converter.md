---
id: currency/converter
name: Live Currency Converter
namespace: currency
status: published
renderer: currency/converter
pattern: converter

summary: Convert USD, EUR, GBP, INR, CAD, AUD, JPY with live forex exchange rates and local caching.

aliases:
  - forex converter
  - exchange rates
  - usd to inr

seo:
  title: Live Currency Converter – Free Exchange Rates
  description: Convert foreign currencies instantly with live exchange rates and offline fallback support.
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

examples:
  - title: Convert 100 USD to EUR
    input: "100 USD"
    output: "92.00 EUR"

faq:
  - question: Are foreign exchange rates live?
    answer: Rates are fetched from public exchange rate providers and cached locally for performance.

relatedTools:
  - percentage/calculator
  - units/length

featured: true
updatedAt: 2026-08-07
---

## Foreign Exchange Rate Conversion

The Currency Converter calculates values using real-time open market exchange rates with automatic offline fallback.
