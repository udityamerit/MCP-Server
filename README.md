# Model Context Protocol in Python — Complete Guide

**Live Deployment**: [udityamerit.github.io/MCP-Server](https://udityamerit.github.io/MCP-Server)

An extensive, production-grade interactive guide to Anthropic's **Model Context Protocol (MCP)** in Python. This web guide explores MCP primitives, transport layers, JSON-RPC, Nginx configurations, and vector memory orchestration with rich aesthetics, interactive diagrams, and live simulation systems.

Developed and written by **Uditya Narayan Tiwari** ([LinkedIn Profile](https://in.linkedin.com/in/uditya-narayan-tiwari-562332289)).

---

## 🌐 Live Guide Structure

The codebase is split into two primary pages representing a comprehensive learning system:

### 1. Main Guide & Code Blueprints
A complete interactive documentation portal detailing:
*   **The Problem MCP Solves**: Resolving integration bloat (LangChain, LlamaIndex, CrewAI, AutoGen fragmentation) and addressing the context transfer bottleneck.
*   **Chronological Journey**: The history of MCP from its origins at Anthropic to public launch, modular extension updates, and the enterprise scale milestone.
*   **Interactive Simulation Tabs**: Live client-server request/response flows simulating:
    *   *Local STDIO Subprocesses* (standard input/output pipes)
    *   *Remote SSE Servers* (Server-Sent Events + HTTP POST)
    *   *Federated Multi-Server Routing Mesh*
*   **Three Core Primitives**: Deep dives into the core components with tabs showcasing theoretical structure and Python code snippets:
    *   **Tools**: Executable functions that allow LLMs to take actions.
    *   **Resources**: Read-only data sources mapped to custom URIs.
    *   **Prompts**: Standardized templates for pre-structured user interactions.
*   **Production-Grade Implementations**:
    *   *Chess.com Stats Server*: Built using `FastMCP` in Python.
    *   *Semantic Memory Tracker*: Low-level MCP server implementation using `mcp.server.lowlevel.Notification` and custom context lifecycles.
*   **Architectural Patterns & Code Gaps**: Critical tips on security boundaries, rate limiting, connection caching, and memory safety.
*   **Enterprise Roadmap (2026+)**: Stateless core transports, asynchronous task loops, MCP App UI views, cryptographic identities, and decentralized registries.

### 2. System Design Architectures 
A dedicated portal visualizing the system engineering details of MCP deployment pipelines through interactive dashboards, SVG simulations, and detailed step-by-step design cards for:
1.  **MCP Core Architecture Flow**: The foundational interaction loop.
2.  **Advanced Zero-Trust Security**: Securing transport streams and execution sandboxes.
3.  **Client-Server Communication Flow**: Detailed JSON-RPC 2.0 message envelope patterns.
4.  **Local STDIO Subprocess**: Local command lines, stdin/stdout redirection, and parent process handlers.
5.  **Streamable HTTP / SSE**: Asynchronous connections, server-sent events, and POST transport setups.
6.  **Federated Multi-Server Routing Mesh**: Hub-and-spoke vs. service mesh proxy routing models.
7.  **Production Deployment Pipeline**: GitHub Actions, Dockerized containers, Nginx reverse proxy configurations, and TLS enforcement.

---

## 🛠️ Technology Stack & Aesthetics

The site is built with modern, ultra-premium aesthetics:
*   **Tailwind CSS**: Custom color systems (vibrant slates, emeralds, indigos, gold highlights, and glassmorphic panels).
*   **Typography**: Clean sans-serif pairings using the *Outfit* and *Inter* Google Fonts.
*   **Visual Enhancements**: Multi-color text gradients, subtle glow rings, glowing button outlines, and micro-interactions.
*   **Mermaid.js**: Dynamic flowcharts mapping out system design pipelines.
*   **Custom Particle Simulator**: Pure-JavaScript canvas and SVG particle animators tracking data stream activity on-demand.
*   **Responsiveness**: Hand-crafted CSS grids, collapsible TOC menus, and mobile-friendly sideways scrollable SVG diagrams.

---

## 🚀 Getting Started & Local Development

Since this project consists of purely static frontend HTML documents, you can run the site locally using any standard HTTP server.

### Option 1: Python HTTP Server (Recommended)
If you have Python installed, run this command in your project root folder:
```bash
python -m http.server 8000
```
Then open your browser and navigate to:
```text
http://localhost:8000
```

### Option 2: Live Server (VS Code Extension)
Right-click on `index.html` and choose **Open with Live Server**.

---

## 📦 Deployment Configuration

This repository includes a continuous deployment workflow in `.github/workflows/deploy.yml`. When you commit changes to the `main` branch, it automatically builds and hosts the static content on GitHub Pages.

### Setup Instructions for Custom Hosting:
1.  Initialize git and push to your GitHub repository:
    ```bash
    git init
    git add .
    git commit -m "Configure guide contents and styling"
    git branch -M main
    git remote add origin https://github.com/udityamerit/MCP-Server.git
    git push -u origin main
    ```
2.  In your GitHub Repository **Settings**:
    *   Navigate to **Pages** (under Code and automation).
    *   Under **Build and deployment** > **Source**, switch from "Deploy from a branch" to **GitHub Actions**.
3.  The workflow will now build and update the site automatically on every push!

