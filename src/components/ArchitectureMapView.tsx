import React, { useState } from 'react';
import { 
  GitFork, Server, Database, Shield, Zap, Layers, RefreshCw, 
  Activity, AlertTriangle, CheckCircle2, ArrowRight, FileText, Lock
} from 'lucide-react';
import { ProjectRepository, DependencyNode, DependencyEdge } from '../types';

interface ArchitectureMapViewProps {
  project: ProjectRepository;
}

export const ArchitectureMapView: React.FC<ArchitectureMapViewProps> = ({ project }) => {
  const [selectedNode, setSelectedNode] = useState<DependencyNode | null>(project.nodes[0] || null);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNodes = project.nodes.filter(
    (node) => filterType === 'all' || node.type === filterType
  );

  const getNodeIcon = (type: DependencyNode['type']) => {
    switch (type) {
      case 'database':
        return <Database className="w-5 h-5 text-purple-400" />;
      case 'auth':
        return <Lock className="w-5 h-5 text-emerald-400" />;
      case 'cache':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'queue':
        return <Layers className="w-5 h-5 text-cyan-400" />;
      default:
        return <Server className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
            <GitFork className="w-4 h-4" />
            <span>Architecture & Data Flow Graph</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Service Dependencies & System Topology
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Real-time interactive dependency graph mapping data flow, REST endpoints, and database connections.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center space-x-2">
          {['all', 'service', 'database', 'auth', 'cache'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                filterType === type
                  ? 'bg-indigo-600 text-white'
                  : 'border border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Canvas Representation */}
        <div className="custom-card p-6 lg:col-span-2 min-h-[440px] flex flex-col justify-between relative bg-gradient-to-b from-slate-900/80 to-slate-950 border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span className="font-mono uppercase font-bold text-indigo-400">Interactive Node Map</span>
            <span>Click any node to inspect health & code links</span>
          </div>

          {/* Render Visual Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const connectedEdges = project.edges.filter(
                (e) => e.source === node.id || e.target === node.id
              );

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border cursor-pointer transition transform hover:scale-[1.02] ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/15 shadow-lg shadow-indigo-500/20'
                      : node.health === 'critical'
                      ? 'border-rose-500/50 bg-rose-500/10'
                      : node.health === 'warning'
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                        {getNodeIcon(node.type)}
                      </div>
                      <span className="font-bold text-sm text-white">{node.label}</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        node.health === 'healthy'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : node.health === 'warning'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {node.health}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{node.details || 'Active microservice node'}</p>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{connectedEdges.length} connections</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Healthy</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Degraded</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span>Failing</span>
              </span>
            </div>
            <span>Topology v2.4</span>
          </div>
        </div>

        {/* Selected Node Details Panel */}
        <div className="custom-card p-6 space-y-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center space-x-2">
                  {getNodeIcon(selectedNode.type)}
                  <h3 className="font-bold text-base text-[var(--text-primary)]">{selectedNode.label}</h3>
                </div>
                <span className="text-xs uppercase font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10">
                  {selectedNode.type}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Health Status</span>
                <p className="text-xs text-[var(--text-primary)] mt-1 font-medium">{selectedNode.details}</p>
              </div>

              {/* Connected Edges List */}
              <div>
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Connected Services</span>
                <div className="space-y-2 mt-2">
                  {project.edges
                    .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((edge) => (
                      <div key={edge.id} className="p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] text-xs flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[var(--text-primary)]">{edge.label || 'Data Link'}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">
                            {edge.source === selectedNode.id ? `Sends to ${edge.target}` : `Receives from ${edge.source}`}
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          edge.status === 'normal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {edge.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Related Code Files */}
              <div>
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Related Code Files</span>
                <div className="space-y-1.5 mt-2">
                  {project.files.map((f, i) => (
                    <div key={i} className="text-xs font-mono p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between">
                      <span className="truncate">{f.path}</span>
                      <span className="text-[10px] text-indigo-400 uppercase">{f.importance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--text-muted)] text-sm">
              Click a node in the graph to view architecture details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
