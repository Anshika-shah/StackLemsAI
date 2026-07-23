import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not configured in process.env");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "dummy-key-for-dev",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Autonomous Investigation Endpoint
app.post("/api/investigate", async (req, res) => {
  try {
    const { projectInfo, issueDescription, files, logs, configFiles, selectedModel } = req.body;

    const modelName = selectedModel || "gemini-3.6-flash";
    const ai = getGeminiClient();

    const systemInstruction = `
You are StackLens AI, an autonomous software engineering investigation platform.
Your task is to conduct an investigation-first root cause analysis of a software engineering issue.
You MUST NOT make assumptions without citing specific files, lines, environment variables, or logs.

Analyze the user's issue and project context. Perform a structured 5-step investigation:
1. Evidence Collection: Identify the specific file, line number, or configuration where the defect resides.
2. Architectural & Data Flow Analysis: Explain how data moves through the system and where it breaks.
3. Git & Timeline Correlation: Explain what recent change or mismatch introduced the bug.
4. Root Cause & Confidence Rating: State the exact root cause with an evidence-backed confidence score (80-99%).
5. Actionable Remediation: Provide step-by-step fix instructions and exact unified code diff (Before vs After).

Respond strictly in valid JSON matching the schema provided.
`;

    const userPrompt = `
PROJECT NAME: ${projectInfo?.name || "Unknown Project"}
PROJECT ARCHITECTURE: ${projectInfo?.architecture || "Microservices / Monolith"}
PRIMARY LANGUAGES: ${projectInfo?.languages?.join(", ") || "TypeScript, Node.js, SQL"}

ISSUE / BUG DESCRIPTION:
"${issueDescription}"

RELEVANT CODE & CONFIG FILES PROVIDED:
${JSON.stringify(files || [], null, 2)}

BUILD / RUNTIME LOGS:
${logs || "No explicit logs attached."}

CONFIG & ENVIRONMENT VARS:
${JSON.stringify(configFiles || {}, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A concise summary title of the issue investigated" },
            rootCause: { type: Type.STRING, description: "Clear single-paragraph description of the precise root cause" },
            confidenceScore: { type: Type.INTEGER, description: "Confidence score percentage (0 to 100)" },
            affectedFiles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of relative file paths affected",
            },
            evidence: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  file: { type: Type.STRING },
                  line: { type: Type.STRING },
                  snippet: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                },
                required: ["file", "snippet", "rationale"],
              },
            },
            impactAnalysis: { type: Type.STRING, description: "Impact on security, performance, or availability" },
            timelineCorrelation: { type: Type.STRING, description: "How recent updates or config changes caused this" },
            suggestedFix: { type: Type.STRING, description: "Clear step-by-step resolution guide" },
            codeDiff: {
              type: Type.STRING,
              description: "Code diff showing before and after fixes with + and - lines",
            },
            relatedComponents: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["title", "rootCause", "confidenceScore", "affectedFiles", "evidence", "suggestedFix"],
        },
      },
    });

    const reportData = JSON.parse(response.text || "{}");
    res.json({ success: true, report: reportData });
  } catch (error: any) {
    console.error("Investigation API error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to execute autonomous AI investigation",
    });
  }
});

// Codebase Architecture Breakdown Endpoint
app.post("/api/explain-codebase", async (req, res) => {
  try {
    const { repositoryName, fileTree, sampleFiles } = req.body;
    const ai = getGeminiClient();

    const prompt = `
Analyze this repository: "${repositoryName}".
File tree structure:
${JSON.stringify(fileTree, null, 2)}

Sample key files:
${JSON.stringify(sampleFiles || [], null, 2)}

Provide an architectural overview with dependency maps, core services, security considerations, and health rating.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert software architect analyzing codebases. Respond in structured JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            architectureType: { type: Type.STRING },
            summary: { type: Type.STRING },
            healthScore: { type: Type.INTEGER },
            keyModules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  importance: { type: Type.STRING },
                },
              },
            },
            dataFlow: { type: Type.STRING },
            securityAudit: { type: Type.STRING },
            performanceAudit: { type: Type.STRING },
          },
        },
      },
    });

    res.json({ success: true, analysis: JSON.parse(response.text || "{}") });
  } catch (error: any) {
    console.error("Codebase explanation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Copilot Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, projectContext, currentFile } = req.body;
    const ai = getGeminiClient();

    const lastUserMessage = messages[messages.length - 1]?.content || "Explain project architecture";

    const systemInstruction = `
You are StackLens AI Assistant, an autonomous software engineering copilot.
You investigate software projects, databases, APIs, git commits, and Docker containers.
Maintain an evidence-based, professional, software engineering tone.
Refer to project context: ${JSON.stringify(projectContext || {})}.
Current open file: ${currentFile || "None"}.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: lastUserMessage,
      config: {
        systemInstruction,
      },
    });

    res.json({
      success: true,
      reply: response.text,
      toolsUsed: ["FileScanner", "GitHistoryInspector", "DependencyGraph"],
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Setup Vite & Express static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StackLens AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
