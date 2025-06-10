 src/utils/motivation.js
 const quotes = [
  "ابدأ ولو بخطوة بسيطة، فالبداية نصف الطريق.",
  "اليوم فرصتك تصنع فرقًا بسيطًا يصنع فرقًا كبيرًا لاحقًا.",
  "لا تترك الخوف يحرمك من فرصة الإنجاز."
];

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}


---
