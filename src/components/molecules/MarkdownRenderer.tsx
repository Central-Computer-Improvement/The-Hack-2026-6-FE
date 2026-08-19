import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  /** Apply light text styles for dark bubble backgrounds (AI messages) */
  inverted?: boolean;
}

/**
 * DeepTutor-standard LaTeX & Markdown Preprocessor
 * Converts \(...\) and \[...\] to $...$ and $$...$$,
 * normalizes headers, and promotes matrix blocks to display math.
 */
function normalizeEditorMdHeadings(content: string): string {
  return content.replace(/^(#{1,6})([^#\s])/gm, "$1 $2");
}

const LIKELY_LATEX_BLOCK_RE = /\\[A-Za-z]+|\\\\|[_^&]/;

function looksLikeLatexBlock(lines: string[]): boolean {
  const block = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
  return block.length > 0 && LIKELY_LATEX_BLOCK_RE.test(block);
}

function normalizeEditorMdInlineMath(content: string): string {
  const lines = content.split("\n");
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "$" && i + 1 < lines.length) {
      let endIdx = -1;
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === "$") {
          endIdx = j;
          break;
        }
      }

      if (endIdx > i + 1 && looksLikeLatexBlock(lines.slice(i + 1, endIdx))) {
        result.push("$$");
        for (let j = i + 1; j < endIdx; j++) {
          result.push(lines[j]);
        }
        result.push("$$");
        i = endIdx;
        continue;
      }
    }

    if (
      /^\$\$[\s\S]+\$\$$/.test(trimmed) &&
      (trimmed.match(/\$\$/g)?.length ?? 0) === 2
    ) {
      const inner = trimmed.slice(2, -2).trim();
      result.push(`$$\n${inner}\n$$`);
      continue;
    }

    result.push(line);
  }

  return result.join("\n");
}

function convertLatexDelimiters(content: string): string {
  if (!content) return content;
  let result = content;

  // 1. Nested $$ \(...\) $$
  result = result.replace(
    /\$\$\s*\\\(([\s\S]*?)\\\)\s*\$\$/g,
    (_match, expr) => `\n$$\n${expr}\n$$\n`
  );

  // 2. Convert \[...\] to $$...$$ (block math)
  result = result.replace(/\\\[([\s\S]*?)\\\]/g, (_match, expr) => {
    return `\n$$\n${expr.trim()}\n$$\n`;
  });

  // 3. Convert \(...\) to $...$ (inline math)
  result = result.replace(/\\\(([\s\S]*?)\\\)/g, (_match, expr) => {
    return ` $${expr.trim()}$ `;
  });

  // 4. Promote single-dollar matrix environments ($ \begin{pmatrix} ... \end{pmatrix} $) to $$ ... $$
  result = result.replace(
    /(?<!\$)\$(?!\$)([^\$\n]*?\\begin\{(?:pmatrix|bmatrix|vmatrix|matrix|cases|aligned|align\*?)\}[\s\S]*?\\end\{(?:pmatrix|bmatrix|vmatrix|matrix|cases|aligned|align\*?)\}[^\$\n]*?)(?<!\$)\$(?!\$)/g,
    (_, math) => `\n$$\n${math.trim()}\n$$\n`
  );

  // Clean up multiple consecutive newlines
  result = result.replace(/\n{3,}/g, "\n\n");

  return result;
}

export function processMarkdownContent(content: string): string {
  if (!content) return "";
  let result = String(content);
  result = normalizeEditorMdHeadings(result);
  result = normalizeEditorMdInlineMath(result);
  result = convertLatexDelimiters(result);
  result = result.replace(/\n{3,}/g, "\n\n");
  return result;
}

export function MarkdownRenderer({
  content,
  className = "",
  inverted = false,
}: MarkdownRendererProps) {
  const processedContent = useMemo(() => processMarkdownContent(content), [content]);

  // DeepTutor styled ReactMarkdown component overrides for consistent typography
  const components = useMemo(() => {
    return {
      h1: ({ children, ...props }: any) => (
        <h1
          className={cn(
            "font-sans text-xl font-bold tracking-tight mt-6 mb-3 first:mt-0",
            inverted ? "text-white" : "text-slate-900"
          )}
          {...props}
        >
          {children}
        </h1>
      ),
      h2: ({ children, ...props }: any) => (
        <h2
          className={cn(
            "font-sans text-lg font-bold tracking-tight mt-5 mb-2.5 first:mt-0",
            inverted ? "text-white" : "text-slate-900"
          )}
          {...props}
        >
          {children}
        </h2>
      ),
      h3: ({ children, ...props }: any) => (
        <h3
          className={cn(
            "font-sans text-base font-semibold tracking-tight mt-4.5 mb-2 first:mt-0",
            inverted ? "text-white" : "text-slate-800"
          )}
          {...props}
        >
          {children}
        </h3>
      ),
      h4: ({ children, ...props }: any) => (
        <h4
          className={cn(
            "font-sans text-sm font-semibold mt-3.5 mb-1.5 first:mt-0",
            inverted ? "text-white" : "text-slate-800"
          )}
          {...props}
        >
          {children}
        </h4>
      ),
      p: ({ children, ...props }: any) => (
        <p
          className={cn(
            "mb-3.5 last:mb-0 leading-[1.75] text-[15px] sm:text-[15.5px]",
            inverted ? "text-white/95" : "text-slate-700"
          )}
          {...props}
        >
          {children}
        </p>
      ),
      ul: ({ children, ...props }: any) => (
        <ul
          className={cn(
            "my-3 ml-5 list-disc space-y-2 text-[15px] sm:text-[15.5px] leading-[1.7]",
            inverted ? "text-white/95" : "text-slate-700"
          )}
          {...props}
        >
          {children}
        </ul>
      ),
      ol: ({ children, ...props }: any) => (
        <ol
          className={cn(
            "my-3.5 ml-5 list-decimal space-y-2.5 text-[15px] sm:text-[15.5px] leading-[1.7]",
            inverted ? "text-white/95" : "text-slate-700"
          )}
          {...props}
        >
          {children}
        </ol>
      ),
      li: ({ children, ...props }: any) => (
        <li className="pl-1 leading-[1.7]" {...props}>
          {children}
        </li>
      ),
      strong: ({ children, ...props }: any) => (
        <strong
          className={cn("font-bold", inverted ? "text-white" : "text-slate-900")}
          {...props}
        >
          {children}
        </strong>
      ),
      em: ({ children, ...props }: any) => (
        <em className="italic" {...props}>
          {children}
        </em>
      ),
      hr: () => (
        <div
          className={cn(
            "my-5 h-px border-none",
            inverted ? "bg-white/20" : "bg-slate-200"
          )}
        />
      ),
      blockquote: ({ children, ...props }: any) => (
        <blockquote
          className={cn(
            "my-3.5 border-l-3 pl-4 italic text-sm",
            inverted
              ? "border-white/40 text-white/85"
              : "border-indigo-400 text-slate-600 bg-indigo-50/50 py-1 rounded-r-lg"
          )}
          {...props}
        >
          {children}
        </blockquote>
      ),
      pre: ({ children, ...props }: any) => (
        <div
          className={cn(
            "my-4 overflow-hidden rounded-2xl border shadow-sm",
            inverted
              ? "border-white/20 bg-slate-950/85 text-slate-100"
              : "border-slate-800 bg-slate-950 text-slate-100"
          )}
        >
          <pre
            className="overflow-x-auto p-4 text-xs sm:text-sm font-mono leading-relaxed text-slate-100"
            {...props}
          >
            {children}
          </pre>
        </div>
      ),
      code: ({ inline, className: codeClassName, children, ...props }: any) => {
        const isBlock =
          !inline &&
          (codeClassName?.includes("language-") ||
            codeClassName?.includes("hljs") ||
            (typeof children === "string" && children.includes("\n")));

        if (isBlock) {
          return (
            <code className={cn("font-mono block", codeClassName)} {...props}>
              {children}
            </code>
          );
        }

        return (
          <code
            className={cn(
              "rounded px-1.5 py-0.5 font-mono text-[0.875em]",
              inverted
                ? "bg-white/15 text-indigo-200"
                : "bg-indigo-50 text-indigo-700 font-semibold"
            )}
            {...props}
          >
            {children}
          </code>
        );
      },
      table: ({ children, ...props }: any) => (
        <div
          className={cn(
            "my-4 overflow-x-auto rounded-xl border shadow-xs",
            inverted ? "border-white/20 bg-white/5" : "border-slate-200 bg-white"
          )}
        >
          <table className="min-w-full text-sm divide-y divide-inherit" {...props}>
            {children}
          </table>
        </div>
      ),
      th: ({ children, ...props }: any) => (
        <th
          className={cn(
            "px-3 py-2 text-left font-bold text-xs uppercase tracking-wider",
            inverted ? "bg-white/10 text-white" : "bg-slate-50 text-slate-700"
          )}
          {...props}
        >
          {children}
        </th>
      ),
      td: ({ children, ...props }: any) => (
        <td
          className={cn(
            "px-3 py-2 text-sm border-t border-inherit",
            inverted ? "text-white/90" : "text-slate-700"
          )}
          {...props}
        >
          {children}
        </td>
      ),
    };
  }, [inverted]);

  return (
    <div
      className={cn(
        "font-sans leading-relaxed select-text",
        // KaTeX Math Display overrides for clean centering and margin
        "[&_.katex-display]:my-5 [&_.katex-display]:py-1.5 [&_.katex-display]:text-center [&_.katex-display]:overflow-x-auto",
        "[&_.katex]:align-middle [&_.katex]:px-0.5",
        // Inverted styles for math & KaTeX errors
        inverted
          ? [
              "[&_.katex]:text-white",
              "[&_.katex-display]:text-white",
              "[&_.katex_.base]:text-white",
              "[&_.katex-html]:text-white",
              "[&_.katex-error]:text-white/80 [&_.katex-error]:bg-white/10 [&_.katex-error]:px-1.5 [&_.katex-error]:py-0.5 [&_.katex-error]:rounded",
            ].join(" ")
          : [
              "[&_.katex]:text-slate-900",
              "[&_.katex-error]:text-rose-600 [&_.katex-error]:bg-rose-50 [&_.katex-error]:px-1.5 [&_.katex-error]:py-0.5 [&_.katex-error]:rounded",
            ].join(" "),
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }], rehypeHighlight]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
