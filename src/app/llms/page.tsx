import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Specifications & Prompt Context | TweenLabs",
  description: "A structured, prompt-friendly context specification file outlining the TweenLabs technology stack and GSAP implementation patterns.",
};

export default function LlmPage() {
  const filePath = path.join(process.cwd(), "public", "llms.txt");
  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    content = "# File not found\nCould not load `public/llms.txt`. Ensure it is generated.";
  }

  // Simple custom markdown parser for preview layout
  const parseMarkdown = (md: string) => {
    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Replace Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-[#2a2a2a]">$1</strong>');

    // Replace Inline code blocks
    html = html.replace(/`(.*?)`/g, '<code class="font-mono text-xs bg-zinc-150 border border-zinc-300 rounded px-1 py-0.5 text-wtf-orange font-bold">$1</code>');

    // Replace Headings
    html = html.replace(/^# (.*)$/gm, '<h1 class="text-3xl md:text-4xl font-serif font-black uppercase text-[#2a2a2a] border-b-3 border-[#2a2a2a] pb-4 mb-6 mt-2">$1</h1>');
    html = html.replace(/^## (.*)$/gm, '<h2 class="text-xl md:text-2xl font-serif font-black uppercase text-[#2a2a2a] mt-8 mb-4 border-b-2 border-zinc-200 pb-2">$1</h2>');
    html = html.replace(/^### (.*)$/gm, '<h3 class="text-base md:text-lg font-mono font-bold uppercase text-[#2a2a2a] mt-6 mb-3">$1</h3>');

    // Replace Markdown Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-wtf-orange hover:underline font-bold" target="_blank" rel="noopener noreferrer">$1</a>');

    // Blockquote
    html = html.replace(/^&gt;[ \t]+(.*)$/gm, '<blockquote class="border-l-4 border-wtf-yellow pl-4 italic text-zinc-650 my-4 bg-zinc-50 py-2 pr-2 rounded">$1</blockquote>');

    // Nested bullet points
    html = html.replace(/^  -[ \t]+(.*)$/gm, '<li class="ml-8 list-circle pl-2 text-zinc-700 my-1">$1</li>');

    // Top-level bullet points
    html = html.replace(/^-[ \t]+(.*)$/gm, '<li class="ml-4 list-disc pl-2 text-zinc-700 my-1.5">$1</li>');

    // Paragraph split
    const paragraphs = html.split(/\n\n+/);
    return paragraphs.map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return "";
      // If the block is already formatted as HTML blocks, return directly
      if (trimmed.match(/^<(h1|h2|h3|blockquote|li|ul|ol|pre|div)/)) {
        return trimmed;
      }
      return `<p class="text-sm md:text-base text-zinc-650 leading-relaxed font-medium mb-4">${trimmed.replace(/\n/g, "<br />")}</p>`;
    }).join("\n");
  };

  const htmlContent = parseMarkdown(content);

  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center pt-24 pb-16 selection:bg-wtf-yellow selection:text-black">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      <main className="w-full max-w-4xl px-4 md:px-8 py-8 flex flex-col gap-8 z-10">
        {/* Top controls / badge */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="inline-flex items-center gap-2 bg-wtf-orange border-2 border-[#2a2a2a] px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[2px_2px_0px_#2a2a2a] tilt-right">
            <span>AI Model Prompting Spec</span>
          </div>
          <div className="flex gap-3">
            <a
              href="/llms.txt"
              target="_blank"
              className="brutalist-btn bg-white hover:bg-wtf-orange hover:text-white text-xs font-mono font-bold px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors duration-150 cursor-pointer"
            >
              Raw File ↗
            </a>
            <Link
              href="/"
              className="brutalist-btn bg-wtf-yellow text-[#2a2a2a] text-xs font-mono font-bold px-3 py-1.5 rounded-md uppercase tracking-wider cursor-pointer"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Spec Content Card */}
        <div 
          className="brutalist-card bg-white p-8 md:p-12 shadow-[6px_6px_0px_#2a2a2a] w-full"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </main>
    </div>
  );
}
