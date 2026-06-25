/**
 * Custom MDX component overrides.
 * These give every MDX element a polished dark-themed appearance
 * consistent with the Cynaptics site aesthetic.
 *
 * Pass this map as the `components` prop to <MDXRemote />.
 */

import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  // ── Headings ─────────────────────────────────────────────────────────────
  h1: ({ children, ...props }) => (
    <h1
      {...props}
      className="mt-10 mb-4 text-3xl md:text-4xl font-extrabold leading-tight"
      style={{
        background: "linear-gradient(135deg, #fff 40%, #06b6d4 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </h1>
  ),

  h2: ({ children, ...props }) => (
    <h2
      {...props}
      className="mt-10 mb-3 text-2xl md:text-3xl font-bold text-white border-b border-zinc-800 pb-2"
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...props }) => (
    <h3 {...props} className="mt-8 mb-2 text-xl font-semibold text-zinc-100">
      {children}
    </h3>
  ),

  h4: ({ children, ...props }) => (
    <h4 {...props} className="mt-6 mb-1 text-lg font-semibold text-zinc-200">
      {children}
    </h4>
  ),

  // ── Body text ─────────────────────────────────────────────────────────────
  p: ({ children, ...props }) => (
    <p {...props} className="my-4 text-zinc-300 leading-[1.85] text-base">
      {children}
    </p>
  ),

  // ── Links ─────────────────────────────────────────────────────────────────
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        {...props}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 transition-colors"
      >
        {children}
      </a>
    );
  },

  // ── Inline code ───────────────────────────────────────────────────────────
  code: ({ children, ...props }) => (
    <code
      {...props}
      className="font-mono text-sm text-cyan-300 bg-zinc-800/70 border border-zinc-700/50 rounded px-1.5 py-0.5"
    >
      {children}
    </code>
  ),

  // ── Code blocks ───────────────────────────────────────────────────────────
  pre: ({ children, ...props }) => (
    <pre
      {...props}
      className="my-6 overflow-x-auto rounded-xl border border-zinc-700/60 bg-zinc-900 p-5 text-sm leading-relaxed text-zinc-200"
      style={{ fontFamily: "'Roboto Mono', 'Fira Code', monospace" }}
    >
      {children}
    </pre>
  ),

  // ── Blockquote ────────────────────────────────────────────────────────────
  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      className="my-6 border-l-4 border-cyan-500/60 pl-5 pr-3 py-1 rounded-r-lg bg-cyan-950/20 italic text-zinc-400"
    >
      {children}
    </blockquote>
  ),

  // ── Lists ─────────────────────────────────────────────────────────────────
  ul: ({ children, ...props }) => (
    <ul {...props} className="my-4 space-y-2 pl-5 list-none text-zinc-300">
      {children}
    </ul>
  ),

  ol: ({ children, ...props }) => (
    <ol {...props} className="my-4 space-y-2 pl-5 list-decimal text-zinc-300">
      {children}
    </ol>
  ),

  li: ({ children, ...props }) => (
    <li {...props} className="relative pl-1 leading-relaxed">
      <span className="absolute -left-4 text-cyan-500 select-none">›</span>
      {children}
    </li>
  ),

  // ── Images ────────────────────────────────────────────────────────────────
  img: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      {...props}
      className="my-6 w-full rounded-xl border border-zinc-800 shadow-lg"
    />
  ),

  // ── Horizontal rule ───────────────────────────────────────────────────────
  hr: (props) => (
    <hr
      {...props}
      className="my-10 border-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"
    />
  ),

  // ── Table ─────────────────────────────────────────────────────────────────
  table: ({ children, ...props }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-zinc-800">
      <table {...props} className="w-full text-sm text-left text-zinc-300">
        {children}
      </table>
    </div>
  ),

  thead: ({ children, ...props }) => (
    <thead {...props} className="bg-zinc-900 text-zinc-400 uppercase text-xs tracking-wider">
      {children}
    </thead>
  ),

  th: ({ children, ...props }) => (
    <th {...props} className="px-4 py-3 font-semibold">
      {children}
    </th>
  ),

  td: ({ children, ...props }) => (
    <td {...props} className="px-4 py-3 border-t border-zinc-800">
      {children}
    </td>
  ),

  // ── Strong / Em ───────────────────────────────────────────────────────────
  strong: ({ children, ...props }) => (
    <strong {...props} className="font-semibold text-white">
      {children}
    </strong>
  ),

  em: ({ children, ...props }) => (
    <em {...props} className="italic text-zinc-300">
      {children}
    </em>
  ),
};
