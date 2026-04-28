"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Shield,
  Brain,
  Server,
  Github,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Hexagon,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const codeExamples = {
  curl: `curl -X POST https://api.orca-gateway.io/v1/proxy \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_ORCA_API_KEY" \\
  -d '{
    "target": "https://your-backend.com/api/users",
    "method": "POST",
    "body": {
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }'`,
  nodejs: `import { OrcaClient } from '@orca-gateway/sdk';

const orca = new OrcaClient({
  apiKey: process.env.ORCA_API_KEY
});

const response = await orca.proxy({
  target: 'https://your-backend.com/api/users',
  method: 'POST',
  body: {
    name: 'Jane Doe',
    email: 'jane@example.com'
  }
});

console.log(response.data);`,
  python: `from orca_gateway import OrcaClient

client = OrcaClient(api_key="YOUR_ORCA_API_KEY")

response = client.proxy(
    target="https://your-backend.com/api/users",
    method="POST",
    body={
        "name": "Jane Doe",
        "email": "jane@example.com"
    }
)

print(response.data)`,
}

function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hexagon className="w-8 h-8 text-zinc-900" strokeWidth={1.5} />
          <span className="text-xl font-semibold tracking-tight text-zinc-900">O.R.C.A.</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            Docs
          </a>
          <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            Pricing
          </a>
          <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            GitHub
          </a>
          <Link href="/login">
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-6">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}


function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-zinc-600 text-sm mb-8">
          <span>Now processing 10M+ requests daily with 99.99% Uptime</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 text-balance">
          Resilient APIs.
          <br />
          Autonomous Healing.
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          The Java-powered AI Gateway that detects JSON schema drift and patches payloads in
          real-time. Never drop a client request again.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login">
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-8 py-6 text-base">
              Start Building for Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/docs">
            <Button
              variant="outline"
              className="rounded-full px-8 py-6 text-base border-zinc-300 text-zinc-900 hover:bg-zinc-50"
            >
              Read the Docs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}


function StatsBanner() {
  const stats = [
    { value: "99.99%", label: "Guaranteed Uptime SLA" },
    { value: "<15ms", label: "AI Cache Hit Latency" },
    { value: "100%", label: "Draft 2020-12 Schema Compliance" },
  ]

  return (
    <section className="py-16 border-y border-zinc-100 bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-zinc-200">
          {stats.map((stat, index) => (
            <div key={index} className="text-center px-8">
              <div className="text-4xl md:text-5xl font-bold text-zinc-900 mb-2">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CodeEditorSection() {
  const [activeTab, setActiveTab] = useState<"curl" | "nodejs" | "python">("curl")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Integrates in seconds. Works with any language.
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Drop in our SDK or use our REST API directly. Get started with a single API call.
          </p>
        </div>

        {/* Code Editor Window */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-2xl">
            {/* Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-800 border-b border-zinc-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-1 bg-zinc-700 rounded-lg p-1">
                {(["curl", "nodejs", "python"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      activeTab === tab
                        ? "bg-zinc-600 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {tab === "nodejs" ? "Node.js" : tab === "curl" ? "cURL" : "Python"}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm text-zinc-300 font-mono leading-relaxed">
                <code>{codeExamples[activeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ArchitectureGrid() {
  const features = [
    {
      icon: Shield,
      title: "Real-Time Validation",
      description: "Intercepts bad payloads before they crash your frontend.",
    },
    {
      icon: Brain,
      title: "AI Surgeon",
      description: "Gemini 2.5 instantly maps and heals broken JSON schemas.",
    },
    {
      icon: Server,
      title: "Fault Tolerant",
      description: "Built on Spring Cloud Gateway with Resilience4j circuit breakers.",
    },
  ]

  return (
    <section className="py-24 bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Core Architecture</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Enterprise-grade infrastructure built for reliability at any scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">{feature.title}</h3>
              <p className="text-zinc-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const footerLinks = {
    Product: ["Features", "Integrations", "Pricing", "Changelog", "Roadmap"],
    Resources: ["Documentation", "API Reference", "Guides", "Blog", "Community"],
    Company: ["About", "Careers", "Press", "Contact", "Partners"],
    Legal: ["Privacy", "Terms", "Security", "Cookies", "Compliance"],
  }

  return (
    <footer className="bg-zinc-900 text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Hexagon className="w-8 h-8 text-white" strokeWidth={1.5} />
              <span className="text-xl font-semibold tracking-tight">O.R.C.A.</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Self-healing API infrastructure for the modern enterprise.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-400">© 2026 O.R.C.A. Gateway. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function OrcaLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <StatsBanner />
      <CodeEditorSection />
      <ArchitectureGrid />
      <Footer />
    </div>
  )
}
