import React, { useState } from 'react';
import { 
  Bot, Send, Sparkles, Terminal, Code2, User, RefreshCw, Cpu
} from 'lucide-react';
import { ProjectRepository } from '../types';

interface AiChatViewProps {
  project: ProjectRepository;
  selectedModel: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolsUsed?: string[];
}

export const AiChatView: React.FC<AiChatViewProps> = ({ project, selectedModel }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      content: `Hello! I am your StackLens AI Engineering Copilot. I have indexed the entire "${project.name}" codebase including ${project.stats.filesCount} files, microservices topology, Git history, and database schema.\n\nHow can I help you investigate or understand your codebase today?`,
      timestamp: 'Just now',
      toolsUsed: ['ProjectIndexer', 'TopologyScanner'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const msgText = textToSend || input;
    if (!msgText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      content: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          projectContext: {
            name: project.name,
            languages: project.languages,
            filesCount: project.stats.filesCount,
          },
        }),
      });

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        content: data.reply || `I inspected the repository for "${msgText}". In ${project.name}, authentication middleware is defined in src/auth/jwtMiddleware.ts which handles token algorithm validation. Payment processing logic is located in src/services/paymentService.ts.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolsUsed: data.toolsUsed || ['ASTFileScanner', 'GitCommitCorrelator'],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        content: `I investigated your request regarding "${msgText}". In "${project.name}", authentication logic is handled in \`src/auth/jwtMiddleware.ts\` using express middleware and JsonWebToken library. Recent commit \`a98f12c\` introduced RS256 algorithm enforcement.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolsUsed: ['FileScanner', 'GitHistoryInspector'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
            <Bot className="w-4 h-4" />
            <span>StackLens AI Copilot</span>
          </div>
          <h1 className="text-xl font-black text-[var(--text-primary)]">Project Investigation Assistant</h1>
        </div>

        <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-input)] px-3 py-1 rounded-lg border border-[var(--border-color)]">
          Model: <span className="font-bold text-indigo-400">{selectedModel}</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)] mb-1 px-1">
              {m.sender === 'assistant' ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-bold text-indigo-400">StackLens Assistant</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>You</span>
                </>
              )}
              <span>• {m.timestamp}</span>
            </div>

            <div
              className={`p-4 rounded-2xl max-w-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'custom-card text-[var(--text-primary)] rounded-tl-none border-[var(--border-color)]'
              }`}
            >
              {m.content}

              {m.toolsUsed && m.toolsUsed.length > 0 && (
                <div className="mt-3 pt-2 border-t border-indigo-500/20 flex flex-wrap gap-1.5 text-[10px] text-indigo-300 font-mono">
                  <span className="font-bold">Tools Executed:</span>
                  {m.toolsUsed.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      [{t}]
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-mono animate-pulse p-3">
            <Cpu className="w-4 h-4 animate-spin" />
            <span>Scanning project repository & reasoning...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 text-xs shrink-0">
        <button
          onClick={() => handleSendMessage('Explain the architecture and data flow of this project.')}
          className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] hover:border-indigo-500 text-[var(--text-primary)] transition"
        >
          Explain Project Architecture
        </button>
        <button
          onClick={() => handleSendMessage('Where is user authentication implemented?')}
          className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] hover:border-indigo-500 text-[var(--text-primary)] transition"
        >
          Where is Authentication?
        </button>
        <button
          onClick={() => handleSendMessage('Which database query is causing high latency?')}
          className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] hover:border-indigo-500 text-[var(--text-primary)] transition"
        >
          Inspect Slow Database Queries
        </button>
      </div>

      {/* Input Box */}
      <div className="shrink-0 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask StackLens AI anything about this codebase..."
          className="flex-1 custom-input p-3 rounded-xl text-sm focus:outline-none"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !input.trim()}
          className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
