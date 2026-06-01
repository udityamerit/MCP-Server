export interface Lesson {
  id: string;
  slug: string;
  title: string;
  duration: string;
  module: string;
  description: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export const courseInfo = {
  title: "Complete Guide to MCP in Python",
  subtitle: "The Ultimate Beginner-to-Advanced Guide for Building MCP Servers & Clients",
  description: "Learn the complete architecture, protocol, deployment, and real-world implementation of MCP (Model Context Protocol) using the Python SDK.",
  difficulty: "Beginner to Advanced",
  totalLessons: 11,
  totalDuration: "6.5 hours",
};

export const modulesData: Module[] = [
  {
    id: "module-1",
    title: "Module 1: Protocol Foundations",
    description: "Understand the core concept, history, and architectural triad of Model Context Protocol.",
    lessons: [
      {
        id: "01",
        slug: "01-introduction",
        title: "Introduction to MCP",
        duration: "30 mins",
        module: "module-1",
        description: "Understand the fundamental problems that MCP solves for agentic AI applications and its history."
      },
      {
        id: "02",
        slug: "02-architecture-overview",
        title: "MCP Architecture Overview",
        duration: "45 mins",
        module: "module-1",
        description: "Explore the Client-Host-Server triad, JSON-RPC 2.0 specs, multiplexing, and basic primitives."
      }
    ]
  },
  {
    id: "module-2",
    title: "Module 2: Server Development",
    description: "Learn the fundamentals of creating local MCP Servers to expose tools, resources, and prompts.",
    lessons: [
      {
        id: "03",
        slug: "03-creating-connecting-mcp-server",
        title: "Creating and Connecting an MCP Server",
        duration: "40 mins",
        module: "module-2",
        description: "Set up the UV environment and build a weather MCP server connected to Claude Desktop."
      },
      {
        id: "05",
        slug: "05-mcp-server-deep-dive-tools",
        title: "MCP Server Deep Dive - Tools",
        duration: "60 mins",
        module: "module-2",
        description: "Build advanced cryptocurrency trackers, operating system screen capturers, and Perplexity AI search tools."
      },
      {
        id: "06",
        slug: "06-mcp-server-resources-prompts",
        title: "MCP Server Resources & Prompts",
        duration: "45 mins",
        module: "module-2",
        description: "Work with read-only database connections via custom URIs and build reusable structured prompt templates."
      }
    ]
  },
  {
    id: "module-3",
    title: "Module 3: Client Development & Orchestration",
    description: "Develop custom clients, integrate with LLM APIs, and manage multi-server setups.",
    lessons: [
      {
        id: "04",
        slug: "04-connect-mcp-client",
        title: "Connecting MCP Clients to Servers",
        duration: "45 mins",
        module: "module-3",
        description: "Write asynchronous Python clients using stdio pipes to query weather and airbnb server tools."
      },
      {
        id: "09",
        slug: "09-mcp-client-deep-dive",
        title: "MCP Client Deep Dive (OpenAI Integration)",
        duration: "60 mins",
        module: "module-3",
        description: "Auto-discover tools, convert their schemas to OpenAI format, and orchestrate the model's execution loop."
      },
      {
        id: "11",
        slug: "11-build-mcp-client-multi-server",
        title: "Multi-Server MCP Orchestration",
        duration: "50 mins",
        module: "module-3",
        description: "Connect to Airbnb and Memory Tracker servers dynamically, routing calls automatically via Streamlit."
      }
    ]
  },
  {
    id: "module-4",
    title: "Module 4: Advanced Systems & Production",
    description: "Package, deploy, and scale MCP servers for public access and real-world projects.",
    lessons: [
      {
        id: "07",
        slug: "07-mcp-server-deployment-publishing",
        title: "Server Deployment & Pyproject Packaging",
        duration: "35 mins",
        module: "module-4",
        description: "Learn pyproject.toml configuration, console entrypoints, and publishing to GitHub for global uvx access."
      },
      {
        id: "08",
        slug: "08-mcp-server-stdio-streamable-http",
        title: "Stdio vs Streamable HTTP (SSE)",
        duration: "50 mins",
        module: "module-4",
        description: "Implement SSE transport using FastMCP HTTP server, inspect it with MCP Inspector, and host on AWS EC2."
      },
      {
        id: "10",
        slug: "10-end-to-end-projects",
        title: "End-to-End Projects (Chess & Memory)",
        duration: "60 mins",
        module: "module-4",
        description: "Build a Chess.com public stats engine and a semantic long-term memory server using vector stores."
      }
    ]
  }
];
