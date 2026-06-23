"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import InfoCard from "@/components/InfoCard";
import { useSession } from "@/provider/SessionProvider";

// ── Time ago helper ─────────────────────────────────────────────
function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── Main Dashboard (single file — everything lives here) ────────
export default function AdminDashboard() {
  const { session } = useSession();
  const stats = useQuery(api.analytics.getViewStats);
  const popularComponents = useQuery(api.analytics.getPopularComponents, {
    limit: 10,
  });
  const topPages = useQuery(api.analytics.getTopPages, { limit: 15 });
  const recentViews = useQuery(api.analytics.getRecentViews, { limit: 30 });
  const viewsByDay = useQuery(api.analytics.getViewsByDay);

  const isLoading = !stats || !popularComponents || !topPages || !recentViews;

  // ── Bar chart max ─────────────────────────────────────────────
  const chartMax = Math.max(...(viewsByDay ?? []).map((d) => d.viewCount), 1);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 md:px-8 lg:px-12 xl:px-16">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif font-black text-3xl md:text-4xl text-[#2a2a2a] tracking-tight">
            Admin Dashboard
          </h1>
          <p className="font-mono text-xs text-zinc-400 mt-1 uppercase tracking-wider">
            Analytics & Site Management
          </p>
        </div>
        <div className="flex items-center gap-3">
          {session && (
            <div className="brutalist-card px-3 py-2 bg-white flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-wtf-green border border-[#2a2a2a] flex items-center justify-center text-white text-[10px] font-bold">
                {session.user.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <span className="font-mono text-[10px] text-zinc-500 uppercase">
                {session.user.email}
              </span>
            </div>
          )}
          <Link
            href="/components"
            className="brutalist-btn bg-white hover:bg-wtf-orange hover:text-white text-[#2a2a2a] font-mono font-bold text-xs py-2 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150"
          >
            ← Back
          </Link>
        </div>
      </div>

      {isLoading ? (
        /* ── Loading state ──────────────────────────────────────── */
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#2a2a2a] border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
              Loading analytics...
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <InfoCard label="Total Page Views" value={stats.totalViews} icon="📊" color="bg-wtf-blue" />
            <InfoCard label="Unique Visitors" value={stats.uniqueVisitors} icon="👥" color="bg-wtf-green" />
            <InfoCard label="Signed-in Users" value={stats.authenticatedUsers} icon="🔐" color="bg-wtf-purple" />
            <InfoCard label="Components Tracked" value={popularComponents.length} icon="🧩" color="bg-wtf-orange" />
          </div>

          {/* ── Charts Row ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {/* Views by Day chart */}
            <div className="brutalist-card p-5 bg-white">
              <h2 className="font-sans font-black text-sm uppercase tracking-tight text-[#2a2a2a] mb-4">
                📈 Views — Last 30 Days
              </h2>
              {!viewsByDay || viewsByDay.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-zinc-400 font-mono text-xs">
                  No data yet
                </div>
              ) : (
                <>
                  <div className="flex items-end gap-[3px] h-32 px-1">
                    {viewsByDay.map((d) => (
                      <div
                        key={d.date}
                        className="flex-1 min-w-[4px] group relative"
                        title={`${d.date}: ${d.viewCount} views`}
                      >
                        <div
                          className="w-full bg-wtf-blue border border-[#2a2a2a]/20 rounded-t-sm transition-all duration-200 group-hover:bg-wtf-orange"
                          style={{ height: `${Math.max((d.viewCount / chartMax) * 100, 4)}%` }}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                          <div className="bg-[#2a2a2a] text-white text-[9px] font-mono px-2 py-1 rounded whitespace-nowrap shadow-lg">
                            {d.date.slice(5)}: {d.viewCount}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 font-mono text-[9px] text-zinc-400">
                    <span>{viewsByDay[0]?.date.slice(5)}</span>
                    <span>{viewsByDay[viewsByDay.length - 1]?.date.slice(5)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Popular Components */}
            <div className="brutalist-card p-5 bg-white">
              <h2 className="font-sans font-black text-sm uppercase tracking-tight text-[#2a2a2a] mb-4">
                🔥 Popular Components
              </h2>
              {popularComponents.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-zinc-400 font-mono text-xs">
                  No component views yet
                </div>
              ) : (
                <div className="space-y-2 max-h-[240px] overflow-y-auto">
                  {popularComponents.map((comp, i) => {
                    const maxViews = popularComponents[0]?.viewCount || 1;
                    const pct = (comp.viewCount / maxViews) * 100;
                    return (
                      <div key={comp.componentName}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-zinc-400 w-4">
                              {i + 1}.
                            </span>
                            <Link
                              href={`/components/${comp.componentName}`}
                              className="font-mono text-xs font-bold text-[#2a2a2a] hover:text-wtf-orange transition-colors"
                            >
                              {comp.componentName}
                            </Link>
                          </div>
                          <span className="font-mono text-[10px] text-zinc-500">
                            {comp.viewCount} views
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#f0eadf] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-wtf-orange rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Tables Row ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Pages */}
            <div className="brutalist-card p-5 bg-white">
              <h2 className="font-sans font-black text-sm uppercase tracking-tight text-[#2a2a2a] mb-4">
                📄 Top Pages
              </h2>
              {topPages.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-zinc-400 font-mono text-xs">
                  No page views yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-[#2a2a2a]/10">
                        <th className="text-left font-mono text-[9px] uppercase tracking-widest text-zinc-400 pb-2 pr-4">
                          Page
                        </th>
                        <th className="text-right font-mono text-[9px] uppercase tracking-widest text-zinc-400 pb-2">
                          Views
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPages.map((page) => (
                        <tr
                          key={page.path}
                          className="border-b border-[#2a2a2a]/5 hover:bg-[#f0eadf]/50 transition-colors"
                        >
                          <td className="py-2 pr-4 font-mono text-xs text-[#2a2a2a] truncate max-w-[250px]">
                            {page.path}
                          </td>
                          <td className="py-2 text-right font-mono text-xs font-bold text-zinc-500">
                            {page.viewCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="brutalist-card p-5 bg-white">
              <h2 className="font-sans font-black text-sm uppercase tracking-tight text-[#2a2a2a] mb-4">
                ⚡ Recent Activity
              </h2>
              {recentViews.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-zinc-400 font-mono text-xs">
                  No activity yet
                </div>
              ) : (
                <div className="space-y-1 max-h-[320px] overflow-y-auto">
                  {recentViews.map((view, i) => (
                    <div
                      key={`${view.timestamp}-${i}`}
                      className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#f0eadf]/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px]">
                          {view.userId ? "🔐" : "👤"}
                        </span>
                        <span className="font-mono text-[11px] text-[#2a2a2a] truncate max-w-[200px]">
                          {view.path}
                        </span>
                        {view.componentName && (
                          <span className="shrink-0 inline-flex items-center bg-wtf-yellow/30 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase">
                            {view.componentName}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[9px] text-zinc-400 shrink-0 ml-2">
                        {timeAgo(view.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
