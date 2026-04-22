# FourSight — Meme Coin Intelligence Platform

> **FourSight eliminates blind aping by giving every BNB Chain trader instant AI-powered intelligence on any meme coin — before they invest.**

🌐 **Live Demo:** [foursight-six.vercel.app](https://foursight-six.vercel.app)
📹 **Demo Video:** [YouTube](https://youtube.com) <!-- replace with your actual link -->
🏆 **Built for:** [four.meme AI Sprint Hackathon](https://dorahacks.io/hackathon/fourmemeaisprint/detail) on DoraHacks

---

## The Problem

Meme coins on BNB Chain launch every hour. Most are rugs, honeypots, or dead within days — but distinguishing signal from noise requires:

- Reading smart contract code for honeypot traps
- Checking liquidity lock status manually
- Researching holder concentration and whale wallets
- Evaluating narrative strength and community momentum

This takes hours. Traders have minutes — or seconds.

**FourSight solves this.**

---

## What It Does

Paste any BNB Chain token contract address or wallet address. In under 5 seconds, FourSight delivers:

### 🔍 Token Audit Mode
A full audit report for any meme token, including:

| Score | What it measures |
|-------|----------------|
| **Safety Score** | Honeypot detection, sell tax, LP lock, owner renouncement |
| **Narrative Score** | How original, viral, and memorable is the meme concept? (AI) |
| **Degen Potential** | Would a crypto degen ape into this? (AI) |
| **Holder Score** | Distribution health, whale concentration, holder count |
| **Overall Score** | Weighted composite — 0 to 100 |

Every token receives a badge: `ALPHA DETECTED` / `BULLISH DEGEN` / `MODERATE RISK` / `HIGH RISK` / `LIKELY RUG`

A **shareable Score Card PNG** can be downloaded and posted to X/Twitter to drive community voting.

### 👝 Portfolio Scan Mode
Paste any wallet address to batch-audit every meme token that wallet holds:

- Portfolio health score (0–100)
- Visual risk distribution bar (safe / moderate / high risk)
- Individual mini-cards per token with sub-scores and AI verdict
- Riskiest holding flagged with a direct link to its full audit
- Filter by risk level · Sort by score or name

---

## How It Works

```
User pastes address
        ↓
Auto-detect: Token Contract OR Wallet Address
        ↓
┌─────────────────────────────────────┐
│  TOKEN MODE                         │
│  • GoPlus Security — contract audit │
│  • BscScan — holder & supply data   │
│  • AI scoring — narrative + degen   │
│  • Score calculation + badge        │
└─────────────────────────────────────┘
        OR
┌─────────────────────────────────────┐
│  WALLET / PORTFOLIO MODE            │
│  • Moralis — fetch all held tokens  │
│  • Full audit pipeline per token    │
│  • Portfolio score + risk grid      │
└─────────────────────────────────────┘
        ↓
Results rendered in < 5 seconds
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router), TypeScript |
| Hosting | Vercel (serverless) |
| Security Data | [GoPlus Security API](https://gopluslabs.io) |
| Chain Data | [BscScan API](https://bscscan.com) |
| Wallet Data | [Moralis Web3 API](https://moralis.io) |
| AI (Primary) | Claude Haiku 4.5 via [Anthropic API](https://anthropic.com) |
| AI (Bounty) | GPT-4o-mini via [DGrid AI Gateway](https://dgrid.io) |
| Styling | Vanilla CSS — dark mode, glassmorphism, micro-animations |

---

## DGrid Integration

FourSight integrates **DGrid's AI Gateway** as part of the four.meme AI Sprint bounty requirement. DGrid's OpenAI-compatible endpoint (`/chat/completions`) is used to call GPT-4o-mini for narrative and degen scoring, with Anthropic Claude Haiku as the fallback provider. The LLM pipeline is cost-optimised: outputs are capped at 150 tokens per call, and wallet scans are limited to 10 LLM calls maximum.

---

## Running Locally

```bash
git clone https://github.com/NueloSE/foursight.git
cd foursight
npm install
```

Create a `.env.local` file (see `.env.example` for all keys):

```env
BSCSCAN_API_KEY=your_bscscan_key
MORALIS_API_KEY=your_moralis_key
DGRID_API_KEY=your_dgrid_key
DGRID_BASE_URL=https://api.dgrid.ai/v1
ANTHROPIC_API_KEY=your_anthropic_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
app/
  page.tsx           — Homepage & search bar
  results/page.tsx   — Audit results & portfolio view
  api/analyze/       — Core analysis API route
  layout.tsx         — Metadata, favicon, fonts

components/
  AuditReport.tsx    — Full token audit UI
  PortfolioView.tsx  — Wallet portfolio grid
  ShareCard.tsx      — Downloadable score card PNG
  SearchBar.tsx      — Token / Portfolio mode toggle
  ScoreBar.tsx       — Animated score bars
  BadgeChip.tsx      — Risk badge component

lib/
  goplus.ts          — GoPlus Security integration
  bscscan.ts         — BscScan + Moralis integration
  llm.ts             — DGrid + Anthropic AI scoring
  scoring.ts         — Score calculation logic

types/
  index.ts           — Shared TypeScript interfaces
```

---

## Judging Criteria Alignment

| Criterion | Implementation |
|-----------|---------------|
| **AI Integration** | DGrid (GPT-4o-mini) + Anthropic (Claude Haiku) dual-provider pipeline with structured JSON output |
| **BNB Chain / four.meme relevance** | Built exclusively for BSC meme tokens; integrates GoPlus (BSC-native security oracle) |
| **Code Quality** | TypeScript strict mode, zero ESLint errors, full production build verified |
| **Demo Stability** | 8–15s fetch timeouts on all external APIs, structured fallbacks at every failure point, zero unhandled promise rejections |
| **UX / Design** | Dark crypto-native UI, animated score bars, shareable PNG card, mobile-responsive |

---

## License

MIT
