"use client";

import { useState, useEffect } from "react";
import { COUNTRIES } from "@/lib/countries";
import type { PPPDatum } from "@/lib/types";

interface FAQItem {
  question: string;
  answer: (countryName: string, multiplier: number) => string;
}

const faqs: FAQItem[] = [
  {
    question: "What does PPP actually measure?",
    answer: (countryName, multiplier) => 
      `Purchasing Power Parity (PPP) measures how much your money can actually buy in different countries. ${countryName}'s PPP multiplier of ${multiplier.toFixed(2)} means $1 USD buys what $${multiplier.toFixed(2)} would buy in the US market - essentially, your money goes ${multiplier > 1 ? `${((multiplier - 1) * 100).toFixed(0)}% further` : `${((1 - multiplier) * 100).toFixed(0)}% less far`}.`,
  },
  {
    question: "Why is PPP different from exchange rates?",
    answer: () => 
      "Exchange rates only tell you how to convert currency, not what you can buy with it. PPP accounts for the actual cost of goods and services. Currency exchange tells you the conversion rate, but PPP tells you real purchasing power.",
  },
  {
    question: "Should I relocate based on PPP alone?",
    answer: () => 
      "No, PPP is just one factor. Consider quality of life, healthcare access, safety, job opportunities, language barriers, visa requirements, and personal preferences. PPP shows economic buying power, not overall life satisfaction.",
  },
  {
    question: "Why does this country have this PPP value?",
    answer: (countryName, multiplier) => {
      if (multiplier > 1.5) {
        return `${countryName} has high purchasing power due to lower labor costs, real estate prices, and service costs. Daily expenses like food, housing, and transportation are significantly cheaper than in the US, making your dollars stretch further.`;
      } else if (multiplier > 1.0) {
        return `${countryName} offers moderate purchasing power advantages. While not as dramatic as some countries, living costs are still lower than the US, particularly for local goods and services.`;
      } else if (multiplier < 1.0) {
        return `${countryName} is more expensive than the US. High wages, strong currency, and elevated living standards drive up prices for goods and services, meaning your dollars buy less here.`;
      } else {
        return `${countryName} has purchasing power similar to the US, with comparable costs for goods and services.`;
      }
    },
  },
  {
    question: "Why are some countries below 1.0?",
    answer: () => 
      "A PPP multiplier below 1.0 means things cost more than in the US. This happens in expensive countries like Switzerland or Norway where high wages, strong currencies, and elevated living standards drive up prices for goods and services.",
  },
  {
    question: "Which country offers the best value for money?",
    answer: () => 
      "Among the countries in this tool, those with multipliers above 1.5 offer the strongest purchasing power. However, consider factors like healthcare quality, safety, infrastructure, and whether you can legally work there before deciding.",
  },
  {
    question: "How accurate is this for day-to-day expenses?",
    answer: (countryName) => 
      `PPP is based on broad baskets of goods and services. Your actual experience in ${countryName} varies by lifestyle - imported goods cost more everywhere, while local produce and services reflect PPP closely. Urban vs. rural areas also differ significantly.`,
  },
  {
    question: "Does this account for taxes and healthcare?",
    answer: () => 
      "Not directly. PPP measures pre-tax purchasing power. Some countries have higher income taxes but provide free healthcare and education, while others have low taxes but expensive private services. Factor these into your calculations separately.",
  },
  {
    question: "What about quality of life factors?",
    answer: () => 
      "PPP only measures economic buying power. It doesn't account for pollution, crime rates, political stability, climate, cultural fit, or social services. Research these separately - a high PPP doesn't guarantee happiness or safety.",
  },
  {
    question: "Where does this data come from?",
    answer: () => 
      "PPP data comes from the World Bank and OECD, based on extensive price surveys across countries. Additional metrics like GDP, population, and unemployment come from the World Bank's official databases, updated annually.",
  },
];

interface FAQProps {
  selectedCountry: string;
  markets: PPPDatum[];
}

export function FAQ({ selectedCountry, markets }: FAQProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);

  const market = markets.find((m) => m.countryCode === selectedCountry);
  const country = COUNTRIES.find((c) => c.code === selectedCountry);
  const multiplier = market?.multiplier || 1;
  const countryName = country?.name || "this country";

  useEffect(() => {
    if (openIndex === null) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    const answer = faqs[openIndex].answer(countryName, multiplier);
    setDisplayedText("");
    setIsTyping(true);

    let currentIndex = 0;
    const typingSpeed = 20; // milliseconds per character

    const interval = setInterval(() => {
      if (currentIndex < answer.length) {
        setDisplayedText(answer.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [openIndex, countryName, multiplier]);

  const handleQuestionClick = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <section className="glass-panel space-y-4 p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between group"
      >
        <div>
          <h3 className="text-lg font-semibold text-white text-left group-hover:text-brand-gold transition-colors">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-500 mt-1 text-left">
            {isExpanded ? "Click to collapse" : "Click to expand and learn more"}
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="space-y-3 mt-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-white/5 rounded-lg overflow-hidden">
              <button
                onClick={() => handleQuestionClick(index)}
                className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center justify-between group"
              >
                <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                  {faq.question}
                </span>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-4 pb-4 pt-2">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {displayedText}
                    {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-brand-gold animate-pulse" />}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
