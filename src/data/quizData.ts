export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LessonQuiz {
  lessonSlug: string;
  questions: Question[];
}

export const quizzesData: Record<string, Question[]> = {
  "01-introduction": [
    {
      id: "q1_1",
      text: "What fundamental problem does the Model Context Protocol (MCP) solve?",
      options: [
        "It speeds up LLM token generation rates.",
        "It standardizes integration, preventing developers from rebuilding custom tool connectors for every framework.",
        "It compiles Python code into faster machine execution instructions.",
        "It provides a vector database for storage."
      ],
      correctAnswer: 1,
      explanation: "Before MCP, developers had to write custom tool wrappers for every client framework (LangChain, LlamaIndex, Claude Desktop). MCP standardizes this connection: build once, connect everywhere."
    },
    {
      id: "q1_2",
      text: "Which protocol standard powers the communication exchange in MCP?",
      options: [
        "GraphQL",
        "SOAP XML",
        "JSON-RPC 2.0",
        "Protobuf gRPC"
      ],
      correctAnswer: 2,
      explanation: "MCP utilizes JSON-RPC 2.0 specs over standard stdio pipes or HTTP server-sent events (SSE) for easy, language-agnostic messages."
    }
  ],
  "02-architecture-overview": [
    {
      id: "q2_1",
      text: "Which component in the MCP triad is responsible for deciding *when* to execute a tool?",
      options: [
        "The Host (e.g. Claude Desktop, VS Code)",
        "The MCP Client",
        "The MCP Server",
        "The External API"
      ],
      correctAnswer: 0,
      explanation: "The Host (the user-facing application coordinating the LLM session) decides when to prompt the model and when it is safe to invoke a server tool."
    },
    {
      id: "q2_2",
      text: "What are the three primary capabilities (primitives) that an MCP Server can expose?",
      options: [
        "Auth, Sessions, and Sockets",
        "Tools, Resources, and Prompts",
        "HTTP, Stdio, and WebSockets",
        "Pip, UV, and NPM packages"
      ],
      correctAnswer: 1,
      explanation: "The three core protocol primitives of an MCP Server are Tools (executable code), Resources (read-only files/data), and Prompts (structured prompt templates)."
    }
  ],
  "03-creating-connecting-mcp-server": [
    {
      id: "q3_1",
      text: "Which package manager tool is recommended in this course for building Python MCP Servers?",
      options: [
        "Poetry",
        "Pipenv",
        "Conda",
        "UV"
      ],
      correctAnswer: 3,
      explanation: "UV is a fast, modern Python package manager used throughout the course to initialize and run isolated dependencies without global bloat."
    }
  ]
};
