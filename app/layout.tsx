import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nuratix - Advanced AI Models & Multi-Agent Systems",
  description: "Nuratix is the parent company of NoxyAI, an advanced multi-agent AI platform combining chat, image generation, voice AI, real-time web search, coding, and an OpenAI-compatible API. Our mission is to build and scale advanced proprietary AI models.",
  keywords: [
    "Nuratix", "NoxyAI", "AI platform", "multi-agent system", "AI chat", "AI voice chat", "AI image generation", 
    "real-time web search", "AI coding assistant", "document generation", "custom AI avatars", "OpenAI compatible API", 
    "proprietary AI models", "advanced reasoning models", "artificial intelligence parent company", "NoxyAI developer API", 
    "affordable AI API", "serverless AI hosting", "large language models", "image generator", "voice synthesis", 
    "text to speech AI", "real-time reasoning synthesis", "search agent", "reasoning verification agent", 
    "AI model routing", "Anthropic API alternative", "Claude alternative", "ChatGPT alternative", "custom AI assistants", 
    "AI software engineering", "automated code generator", "AI document editor", "voice-activated AI", "autonomous AI agents", 
    "AI model training", "deep learning algorithms", "machine learning platform", "GPU accelerated AI", "enterprise AI solutions", 
    "B2B AI API", "neural network synthesis", "cognitive agent architecture", "conversational intelligence", "natural language processing", 
    "generative adversarial networks", "stable diffusion API", "flux image generation", "dall-e alternative", "midjourney alternative", 
    "real-time data synthesis", "AI web search engine", "verifiable AI answers", "factual AI verification", "hallucination free AI", 
    "high speed AI inference", "secure AI endpoints", "HIPAA compliant AI", "GDPR compliant AI", "Nuratix parent organization", 
    "next-gen AI systems", "developer portal", "NoxyAI SDK", "Python AI library", "JavaScript AI client", "semantic search API", 
    "vector database integration", "Retrieval Augmented Generation", "RAG multi-agent", "agentic workflows", "AI orchestration", 
    "LLM routing layer", "cost effective LLM", "smart AI routing", "AI model comparison", "voice cloning API", "multilingual voice AI", 
    "avatar customization", "AI agent templates", "zero-setup AI API", "custom system prompts", "function calling AI", 
    "structured outputs API", "JSON mode AI", "vision language models", "multimodal AI platform", "image to text API", 
    "OCR AI synthesis", "speech recognition engine", "real-time translation", "context window expansion", "long context LLM", 
    "low latency inference", "scalable AI infrastructure", "AI startup solutions", "intelligent automation", "cognitive computing", 
    "decision making AI", "automated reasoning", "expert systems", "Nuratix AI research", "futuristic AI technology"
  ],
  classification: "Artificial Intelligence, Tech Organization, Software API Provider",
  category: "technology",
  applicationName: "Nuratix Platform",
  authors: [{ name: "Nuratix Core Engineering" }],
  creator: "Nuratix Core Engineering",
  publisher: "Nuratix",
  openGraph: {
    title: "Nuratix - Engineering the Future of AI",
    description: "Discover Nuratix, the parent company of NoxyAI. Experience a multi-agent system offering search, reasoning, and synthesis with access to world-class AI models.",
    url: "https://nuratix.com",
    siteName: "Nuratix",
    images: [
      {
        url: "https://nuratix.com/logo.png",
        width: 1200,
        height: 630,
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuratix - Advanced AI Models & Multi-Agent Systems",
    description: "Nuratix is the parent company of NoxyAI, an advanced multi-agent AI platform combining chat, image generation, voice AI, real-time web search, coding, and an OpenAI-compatible API.",
    images: ["https://nuratix.com/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://nuratix.com/#organization",
      "name": "Nuratix",
      "url": "https://nuratix.com",
      "logo": "https://nuratix.com/logo.png",
      "description": "Nuratix is a leading artificial intelligence research and development company, specializing in custom AI models and parent company of NoxyAI.",
      "founder": {
        "@type": "Person",
        "name": "Nuratix Team"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://nuratix.com/#website",
      "url": "https://nuratix.com",
      "name": "Nuratix",
      "publisher": {
        "@id": "https://nuratix.com/#organization"
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://noxyai.com/#software",
      "name": "NoxyAI",
      "url": "https://noxyai.com",
      "applicationCategory": "BusinessApplication, DeveloperApplication",
      "operatingSystem": "All",
      "description": "An advanced multi-agent AI platform combining chat, voice, image generation, search, and coding services into a single API and chat app.",
      "author": {
        "@id": "https://nuratix.com/#organization"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://nuratix.com/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Nuratix Home",
          "item": "https://nuratix.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "About Us",
          "item": "https://aboutus.nuratix.com"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Blog",
          "item": "https://blog.noxyai.com"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://nuratix.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I cancel my subscription?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Go to /subscription and click Cancel. Cancellations are allowed during the first 3 days of each billing cycle."
          }
        },
        {
          "@type": "Question",
          "name": "What payment methods do you accept?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We accept payments via stripe, supporting credit cards, debit cards and net banking."
          }
        },
        {
          "@type": "Question",
          "name": "What happens if I exceed my token limit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "NoxyAI does not use token-based limits. Free plan gives access to basic models with unlimited usage. Pro plan offers unlimited access to all models."
          }
        },
        {
          "@type": "Question",
          "name": "How do I request a refund?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Email support@noxyai.com within 7 days of purchase. Refunds are issued only for verified technical issues."
          }
        },
        {
          "@type": "Question",
          "name": "How many AI models can Pro users access?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pro users have access to all available models and can switch between them at any time."
          }
        },
        {
          "@type": "Question",
          "name": "Can I switch models during a conversation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Pro users can switch models at any time. The new model will not retain context from earlier messages."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
