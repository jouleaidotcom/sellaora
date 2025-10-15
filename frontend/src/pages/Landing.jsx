import { Link } from 'react-router-dom'
import JoinCommunity from '../components/JoinCommunity'
import FAQ from '../components/FAQ'
import { useEffect, useState } from 'react'
import InviteGate from '../components/InviteGate'
import Modal from '../components/Modal'

export default function Landing() {
  const [verified, setVerified] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)

  useEffect(() => {
    try {
      setVerified(sessionStorage.getItem('inviteVerified') === 'true')
    } catch {}
  }, [])

  useEffect(() => {
    if (verified) return
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('invite')) setShowInviteModal(true)
    } catch {}
  }, [verified])

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="font-semibold tracking-tight">JouleAI</span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
              <a href="/about" className="hover:text-white">About</a>
              <a href="/docs" className="hover:text-white">Docs</a>
              <a href="/contact" className="hover:text-white">Contact</a>
              <a href="https://github.com/jouleaidotcom/sellaora" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
            </nav>
            <div className="flex items-center gap-3">
              {verified ? (
                <>
                  <a href="/login" className="hidden sm:inline-block text-sm text-neutral-300 hover:text-white">Sign in</a>
                  <a href="/signup" className="inline-flex items-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400 transition">Get Started</a>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-3 py-1 text-xs text-neutral-300 border border-neutral-800">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Invite only
                  </span>
                  <button onClick={() => setShowInviteModal(true)} className="text-sm text-neutral-300 hover:text-white underline underline-offset-4">
                    Enter code
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(16,185,129,0.25),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
              Launch your online store in seconds.
            </h1>
            <p className="mt-5 text-lg leading-7 text-neutral-300">
              AI-powered Shopify alternative for entrepreneurs.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              {verified ? (
                <a href="/signup" className="inline-flex items-center rounded-md bg-white px-6 py-3 text-neutral-900 font-medium hover:bg-neutral-200 transition">
                  Get Started
                </a>
              ) : (
                <>
                  <button onClick={() => setShowInviteModal(true)} className="inline-flex items-center rounded-md bg-white px-6 py-3 text-neutral-900 font-medium hover:bg-neutral-200 transition">
                    Enter invite code
                  </button>
                </>
              )}
              <a href="#features" className="text-sm text-neutral-300 hover:text-white">Learn more</a>
            </div>
          </div>
        </div>
      </section>

      <Modal open={showInviteModal && !verified} onClose={() => setShowInviteModal(false)} title="Invite required">
        <InviteGate
          onVerified={() => { setVerified(true); setShowInviteModal(false) }}
        />
      </Modal>

      {/* Trusted by */}
      <section aria-label="logos" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-center text-xs sm:text-sm text-neutral-400">Trusted by fast-growing brands worldwide</p>
        <div className="trust-marquee mt-6 opacity-80">
          <div className="trust-marquee-track">
            {(() => {
              const logos = ['Stitch & Soul','Zyps Fashion','Wood','Brand','Brand','Brand','Brand','Brand'];
              const doubled = [...logos, ...logos];
              return doubled.map((name, idx) => (
                <div key={`${name}-${idx}`} className="flex items-center gap-2 text-neutral-300">
                  <span className="inline-block h-4 w-4 rounded bg-neutral-700" />
                  <span className="text-sm tracking-wider uppercase">{name}</span>
                </div>
              ))
            })()}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Everything you need</h2>
          <p className="mt-3 text-neutral-300">Build, customize, and launch—no code required.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* AI Store Builder */}
          <FeatureCard
            title="AI Store Builder"
            description="Describe your idea and get a ready-to-sell storefront with products, pages, and copy."
            icon={
              <svg className="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v18M21 12H3" strokeLinecap="round"/>
              </svg>
            }
          />
          {/* Drag & Drop Editor */}
          <FeatureCard
            title="Drag & Drop Editor"
            description="Customize sections, rearrange blocks, and edit content visually."
            icon={
              <svg className="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            }
          />
          {/* Payments */}
          <FeatureCard
            title="Payments"
            description="Accept Razorpay or Stripe out of the box. Secure and fast checkout."
            icon={
              <svg className="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 7h20v10H2z"/>
                <path d="M2 10h20"/>
              </svg>
            }
          />
          {/* Analytics */}
          <FeatureCard
            title="Analytics Dashboard"
            description="Track sales, traffic, and conversions with clean, real‑time insights."
            icon={
              <svg className="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18"/>
                <path d="M7 15l4-4 3 3 5-6"/>
              </svg>
            }
          />
        </div>
      </section>

      {/* Sell everywhere mockup section */}
      <section className="bg-gradient-to-b from-neutral-950 to-[#0b0e0d]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Sell here, there, and everywhere</h2>
            <p className="mt-3 max-w-2xl text-neutral-300">Design fast with AI, choose a stylish theme, or build a completely custom storefront with full control.</p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-[radial-gradient(60%_120%_at_50%_0%,rgba(16,185,129,0.15),transparent_60%)] p-4 sm:p-6">
            <div className="relative overflow-hidden rounded-xl bg-neutral-900">
              {/* large media placeholder */}
              <div className="aspect-[16/9] w-full bg-neutral-800" />
              {/* floating panel to mimic editor sidebar */}
              <div className="absolute left-4 top-4 rounded-full bg-neutral-100/90 px-3 py-1 text-xs font-medium text-neutral-900">Draft</div>
              <div className="absolute -left-2 bottom-6 hidden md:block w-64 rounded-xl border border-neutral-700 bg-neutral-900/90 p-4 shadow-xl">
                <div className="text-sm font-medium">Home page</div>
                <div className="mt-3 space-y-2 text-xs text-neutral-300">
                  <div className="rounded border border-neutral-700 p-2">Header</div>
                  <div className="rounded border border-neutral-700 p-2">Add section</div>
                  <div className="rounded border border-neutral-700 p-2">Template</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find your customers split panel */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Find your forever customers</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left marketing/email card */}
          <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
            <div className="aspect-[4/3] rounded-xl bg-neutral-800" />
            <div className="absolute right-6 bottom-6 w-60 rounded-lg border border-neutral-700 bg-neutral-900/95 p-4 shadow-xl">
              <div className="text-xs text-neutral-400">Sales attributed to marketing</div>
              <div className="mt-1 text-2xl font-semibold">₹ 1,05,729</div>
              <div className="mt-2 h-8 w-full rounded bg-neutral-800" />
            </div>
          </div>
          {/* Right wholesale/product card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
            <div className="aspect-[4/3] rounded-xl bg-neutral-800" />
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-neutral-300">
              <div className="rounded border border-neutral-700 p-2">Variant</div>
              <div className="rounded border border-neutral-700 p-2">Quantity</div>
              <div className="rounded border border-neutral-700 p-2">Price</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button className="rounded-md bg-neutral-800 px-3 py-2 text-sm">Add to cart</button>
              <div className="text-sm text-neutral-400">Product subtotal</div>
            </div>
          </div>
        </div>
      </section>

      {/* Developers section */}
      <section id="developers" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b1220] to-neutral-950" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">By developers, for developers</h2>
          <p className="mt-3 max-w-2xl text-neutral-300">APIs, primitives, and tools to build apps, themes, and custom storefronts.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="/docs" className="inline-flex items-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400">Create custom storefronts</a>
            <a href="https://github.com/jouleaidotcom/sellaora" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-900">View on GitHub</a>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CodeWindow title="bash — 100x30">
{`# Create a new Joule storefront\n$ npx create-joule-app my-store\n$ cd my-store && npm run dev`}
            </CodeWindow>
            <CodeWindow title="admin-api.ts">
{`import { jouleai } from '@joule/sdk'\nconst api = new joule({ token: process.env.API_TOKEN })\nconst product = await api.products.create({ title: 'Knit Sweater', price: 1499 })`}
            </CodeWindow>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">How it works</h2>
          <p className="mt-3 text-neutral-300">From idea to live store in minutes.</p>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StepCard step="1" title="Prompt" desc="Tell the AI what you want to sell." />
          <StepCard step="2" title="Theme Preview" desc="Pick a generated theme you love." />
          <StepCard step="3" title="Editor" desc="Tweak content with drag & drop blocks." />
          <StepCard step="4" title="Launch Store" desc="Connect a domain and start selling." />
        </ol>
      </section>

      {/* Community Section */}
      <JoinCommunity />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <footer className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-sm text-neutral-400">© {new Date().getFullYear()} Joule</div>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-300">
              <a href="/about" className="hover:text-white">About</a>
              <a href="https://github.com/jouleaidotcom/sellaora" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
              <a href="/docs" className="hover:text-white">Docs</a>
              <a href="/contact" className="hover:text-white">Contact</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800">
        {icon}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-neutral-300">{description}</p>
    </div>
  )
}

function StepCard({ step, title, desc }) {
  return (
    <li className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-black text-sm font-semibold">{step}</span>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-neutral-300">{desc}</p>
    </li>
  )
}

function CodeWindow({ title, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="truncate">{title}</span>
        <span />
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),rgba(255,255,255,0))] p-4 text-xs leading-relaxed text-neutral-300 font-mono">
        {children}
      </pre>
    </div>
  )
}
