# StackLens AI 🔍⚡
> **Autonomous AI-Powered Codebase Investigator & System Topology Profiler**

![StackLens AI Banner](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini_API-3.6_Flash-8e44ad.svg?style=flat-square&logo=google)](https://ai.google.dev/)
[![Build Status](https://img.shields.io/badge/Build-Passing-emerald.svg?style=flat-square)](#)

---

## 🌟 Overview

**StackLens AI** is an enterprise-grade autonomous engineering copilot and root-cause investigator. It indexes entire distributed codebases—including AST code structure, REST API endpoints, database schemas, Docker container layers, CI/CD pipelines, and Git commit histories—to pinpoint breaking changes, latency bottlenecks, and security vulnerabilities with **evidence-backed reports**.

Designed with a high-density developer dark mode theme, StackLens AI bridges the gap between high-level architectural overview and deep, line-by-line code diagnostics.

---

## 🛠️ Key Capabilities & Modules

### 1. 🤖 Autonomous 5-Step AI Investigation Studio
- **Phase 1:** AST & File Tree Indexing
- **Phase 2:** Log & Error Call Stack Trace Parsing
- **Phase 3:** Git Commit History & Diff Correlation
- **Phase 4:** Docker & Environment Configuration Scan
- **Phase 5:** Root-Cause Synthesis & Patch Diff Generation

### 2. 🕸️ Interactive Service Topology & Data Flow Graph
- Visual microservices map displaying node health (`healthy`, `warning`, `critical`).
- Real-time data link status between frontend services, API gateways, microservices, caches (Redis), queues, and databases (PostgreSQL/MongoDB).

### 3. 🌿 Git Intelligence & Breaking Changes Detector
- Timeline correlation matching bug occurrences directly to author commits and pull requests.
- Automatic detection of algorithm mismatches (e.g., RS256 vs. HS256 JWT signature errors).

### 4. 🐳 Docker & CI/CD Pipeline Investigator
- Dockerfile multi-stage layer scanning to optimize image sizes and resolve missing library dependencies.
- GitHub Actions build step debugging with integrated log output.

### 5. ⚡ API & Database Performance Profiler
- REST API endpoint response latency tracking, calls/min throughput, and error rate tracking.
- Database index audit identifying missing B-Tree indexes on high-cardinality tables causing full sequential scans.

### 6. 🛡️ Code Quality & Security Auditor
- Static analysis detecting dead code, circular dependencies, and hardcoded security parameters.

---

## 🖼️ Visual Highlights & Screenshots

| Module | Preview | Description |
| :--- | :--- | :--- |
| **High Density Dashboard** | ![Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80) | Active case tracker, system latency telemetry, and project health index. |
| **Topology Graph** | ![Architecture Map](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80) | Interactive dependency tree tracking service mesh data links. |
| **Investigation Reports** | ![Investigation Reports](https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80) | Evidence-backed root cause reports with Markdown export capabilities. |

---

## 🏗️ System Architecture & Data Flow

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          StackLens AI Workspace                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐            ┌──────────────┐            ┌──────────────┐
│  React 19    │            │ Express.js   │            │ Google GenAI │
│  Frontend    │ ──(REST)──►│ Backend      │ ──(SDK)───►│ Gemini 3.6   │
│  High Density│            │ Server       │            │ Engine       │
└──────────────┘            └──────────────┘            └──────────────┘
       │                            │
       ▼                            ▼
┌──────────────┐            ┌──────────────┐
│ LocalState   │            │ Workspace    │
│ Storage      │            │ File Scanner │
└──────────────┘            └──────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/stacklens/stacklens-ai.git
cd stacklens-ai
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# Google Gemini API Key (Server-side secret)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port
PORT=3000
NODE_ENV=development
```

### 3. Launch Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `tsx server.ts` | Starts the Express + Vite server with live reload. |
| `npm run build` | `vite build && esbuild ...` | Bundles client & server for production execution. |
| `npm run start` | `node dist/server.cjs` | Runs the compiled CommonJS server in production mode. |
| `npm run lint` | `tsc --noEmit` | Runs TypeScript type checking and syntax validation. |

---

## 🎨 Theme & Workspace Personalization

StackLens AI supports custom visual modes tailored for modern developer environments:
- **Dark Slate** (High Density Default)
- **AMOLED Black** (True zero-contrast black mode)
- **High Contrast Mode**
- **Light Theme**
- **Custom Accent Colors:** Indigo, Emerald, Amber, Rose, Violet, Cyan

---

## 🔒 Role-Based Access Control (RBAC)

StackLens AI includes built-in role settings:
- 👑 **Admin**: Full integration, database, and repository connection rights.
- 🧑‍💻 **Team Lead**: Investigation approval, report publishing, and sharing rights.
- 🛠️ **Developer**: Codebase scanning, AI chat, and diagnostic access.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by the <b>StackLens Engineering Team</b> powered by <b>Google Gemini AI</b>
</p>
