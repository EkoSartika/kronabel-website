"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="mt-10 space-y-3">
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-all shadow-sm"
        >
          <button
            type="button"
            onClick={() => toggleFaq(idx)}
            className="flex w-full items-center justify-between px-5 py-4 text-left font-bold text-forest-950 hover:bg-ivory-50"
          >
            <span className="text-sm sm:text-base">{faq.q}</span>
            <ChevronDown
              className={`h-5 w-5 text-gold-600 transition-transform duration-200 ${
                openFaq === idx ? "rotate-180 transform" : ""
              }`}
            />
          </button>
          {openFaq === idx && (
            <div className="border-t border-slate-100 bg-ivory-muted/40 px-5 py-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

