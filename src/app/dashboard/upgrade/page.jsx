"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

import Link from "next/link";
import { useRouter } from "next/navigation";

const PricingCard = ({ title, price, description, features, recommended, ctaText, ctaLink, onSelect }) => (
  <div
    className={clsx(
      "relative flex flex-col rounded-2xl p-6 sm:p-8 transition-all duration-300 w-full min-h-[500px]",
      recommended
        ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20 scale-100 xl:scale-105 z-10 ring-4 ring-blue-600/20 xl:ring-0"
        : "bg-white text-gray-900 border border-gray-100 hover:shadow-lg hover:border-blue-100"
    )}
  >
    {recommended && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm whitespace-nowrap">
        Most Popular
      </div>
    )}
    
    <div className="mb-6">
      <h3 className={clsx("text-lg font-bold", recommended ? "text-white" : "text-gray-900")}>
        {title}
      </h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-4xl font-extrabold tracking-tight">{price}</span>
        <span className={clsx("ml-1 text-sm font-medium", recommended ? "text-blue-100" : "text-gray-500")}>
          /month
        </span>
      </div>
      <p className={clsx("mt-4 text-sm", recommended ? "text-blue-100" : "text-gray-500")}>
        {description}
      </p>
    </div>

    <ul className="mb-8 flex-1 space-y-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <Icon
            icon="mingcute:check-circle-fill"
            className={clsx(
              "mr-3 h-5 w-5 shrink-0",
              recommended ? "text-blue-200" : "text-blue-600"
            )}
          />
          <span className={clsx("text-sm", recommended ? "text-blue-50" : "text-gray-600")}>
            {feature}
          </span>
        </li>
      ))}
    </ul>

    {ctaLink ? (
      <Link
        href={ctaLink}
        className={clsx(
          "block w-full rounded-xl py-3 text-center text-sm font-bold transition-all",
          recommended
            ? "bg-white text-blue-600 hover:bg-blue-50"
            : "bg-gray-900 text-white hover:bg-gray-800"
        )}
      >
        {ctaText}
      </Link>
    ) : (
      <button
        onClick={onSelect}
        className={clsx(
          "w-full rounded-xl py-3 text-sm font-bold transition-all",
          recommended
            ? "bg-white text-blue-600 hover:bg-blue-50"
            : "bg-gray-900 text-white hover:bg-gray-800"
        )}
      >
        {ctaText}
      </button>
    )}
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 py-4 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left text-sm font-medium text-gray-900 hover:text-blue-600"
      >
        {question}
        <Icon
          icon="mingcute:down-line"
          className={clsx("transition-transform duration-300", isOpen && "rotate-180")}
        />
      </button>
      <div
        className={clsx(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
        )}
      >
        <p className="text-sm text-gray-500">{answer}</p>
      </div>
    </div>
  );
};

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <div className="mx-auto max-w-6xl space-y-12 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-500">
          Choose the plan that's right for your business. No hidden fees, cancel anytime.
        </p>
        
        {/* Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="relative flex rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={clsx(
                "relative z-10 rounded-full px-6 py-2 text-sm font-medium transition-colors",
                billingCycle === "monthly" ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={clsx(
                "relative z-10 rounded-full px-6 py-2 text-sm font-medium transition-colors",
                billingCycle === "yearly" ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
              )}
            >
              Yearly <span className="ml-1 text-xs font-bold text-green-600">-20%</span>
            </button>
            <div
              className={clsx(
                "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-sm transition-transform duration-300",
                billingCycle === "yearly" ? "translate-x-full" : "translate-x-0"
              )}
            />
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 gap-8 md:gap-6 xl:gap-8 md:grid-cols-2 xl:grid-cols-3 xl:items-center items-start">
        <PricingCard
          title="Starter"
          price={billingCycle === "monthly" ? "$0" : "$0"}
          description="Perfect for side projects and small stores just getting started."
          features={[
            "Up to 50 products",
            "Basic analytics",
            "Standard support",
            "2 team members",
            "1GB storage",
          ]}
          ctaText="Current Plan"
          recommended={false}
          onSelect={() => {}}
        />
        <div className="order-first md:order-none w-full">
            <PricingCard
            title="Pro"
            price={billingCycle === "monthly" ? "$29" : "$24"}
            description="Everything you need to grow your business and increase sales."
            features={[
                "Unlimited products",
                "Advanced analytics",
                "Priority support",
                "5 team members",
                "10GB storage",
                "Custom domain",
                "Abandoned cart recovery",
            ]}
            ctaText="Upgrade to Pro"
            ctaLink="/dashboard/upgrade/payment"
            recommended={true}
            />
        </div>
        <PricingCard
          title="Enterprise"
          price={billingCycle === "monthly" ? "$99" : "$79"}
          description="Advanced features and dedicated support for large businesses."
          features={[
            "Unlimited everything",
            "Custom reporting",
            "24/7 Dedicated support",
            "Unlimited team members",
            "100GB storage",
            "API access",
            "SLA guarantee",
          ]}
          ctaText="Contact Sales"
          ctaLink="/dashboard/upgrade/contact"
          recommended={false}
        />
      </div>

      {/* FAQ Section */}
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 text-center">Frequently Asked Questions</h2>
        <div className="space-y-2">
          <FAQItem
            question="Can I change plans later?"
            answer="Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
          />
          <FAQItem
            question="Is there a free trial?"
            answer="We offer a 14-day free trial for our Pro and Enterprise plans. No credit card required to start."
          />
          <FAQItem
            question="What payment methods do you accept?"
            answer="We accept all major credit cards (Visa, Mastercard, Amex) and PayPal."
          />
          <FAQItem
            question="Do you offer refunds?"
            answer="If you're not satisfied with our service, please contact our support team within 30 days for a full refund."
          />
        </div>
      </div>
      
      {/* Footer CTA */}
      <div className="text-center py-8">
        <p className="text-gray-500">
            Still have questions? <a href="#" className="text-blue-600 font-medium hover:underline">Contact our support team</a>
        </p>
      </div>
    </div>
  );
}
