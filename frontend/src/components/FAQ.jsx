import React, { useState } from 'react'

const defaultItems = [
  {
    id: 'what-is-joule',
    q: 'What is JouleAI?',
    a: 'Joule is an AI‑powered ecommerce platform. Describe your idea and we generate a ready‑to‑sell storefront with themes, pages, products, and an editor to customize everything.'
  },
  {
    id: 'is-it-free',
    q: 'Is there a free plan?',
    a: 'Yes. You can start for free to build and preview your store. Paid plans unlock custom domains, higher usage limits, and advanced features like APIs and analytics.'
  },
  {
    id: 'custom-domain',
    q: 'Can I use a custom domain?',
    a: 'Absolutely. Connect any domain you own, or purchase one and point it to your Sellaora storefront with guided DNS steps.'
  },
  {
    id: 'payments',
    q: 'Which payment providers are supported?',
    a: 'Razorpay and Stripe are supported out of the box. More gateways can be added via apps and custom integrations.'
  },
  {
    id: 'migrate',
    q: 'Can I migrate from Shopify or another platform?',
    a: 'Yes. Import products and media via CSV or APIs. Our team and docs guide you through mapping collections, variants, and URLs.'
  },
  {
    id: 'coding',
    q: 'Do I need to know how to code?',
    a: 'No. Most users build with the theme editor and AI. Developers can extend with React components, webhooks, and REST/Graph APIs.'
  },
]

function Item({ id, q, a, isOpen, onToggle }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40">
      <h3>
        <button
          type="button"
          aria-controls={`faq-panel-${id}`}
          aria-expanded={isOpen}
          onClick={onToggle}
          className="group w-full px-5 py-4 text-left flex items-center justify-between gap-4"
        >
          <span className="text-base sm:text-lg font-medium text-white/90 group-hover:text-white">
            {q}
          </span>
          <svg
            className={`h-5 w-5 flex-shrink-0 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </h3>
      <div
        id={`faq-panel-${id}`}
        role="region"
        className={`px-5 pb-4 text-sm text-neutral-300 transition-[max-height,opacity] duration-300 ease-out ${isOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}
      >
        {a}
      </div>
    </div>
  )
}

export default function FAQ({ items = defaultItems }) {
  const [open, setOpen] = useState(() => new Set())
  const toggle = (id) => {
    setOpen(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section id="faq" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Frequently asked questions</h2>
        <p className="mt-3 text-neutral-300">Everything you need to know to get started with Sellaora.</p>
      </div>

      <div className="space-y-3">
        {items.map((it) => (
          <Item
            key={it.id}
            id={it.id}
            q={it.q}
            a={it.a}
            isOpen={open.has(it.id)}
            onToggle={() => toggle(it.id)}
          />
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-neutral-400">
        Still have questions? <a href="/contact" className="text-emerald-400 hover:text-emerald-300">Contact us</a>
      </div>
    </section>
  )
}
