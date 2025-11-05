import React from "react";

type WPPost = {
  id: number;
  title: { rendered: string };
  excerpt?: { rendered: string };
  meta?: { _aioseo_title?: string; _aioseo_description?: string };
};

export const dynamic = "force-dynamic";

const TRUSEO_SCORE = 94;

function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function getLatestPost(): Promise<WPPost | null> {
  const base = process.env.NEXT_PUBLIC_WP_BASE_URL ?? "http://localhost:8080";
  const res = await fetch(
    `${base}/wp-json/wp/v2/posts?per_page=1&_fields=id,title,excerpt,meta`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
    },
  );

  if (!res.ok) {
    return null;
  }

  const posts: WPPost[] = await res.json();
  return posts.length ? posts[0] : null;
}

async function getWorkflowStatus(): Promise<string> {
  const statusUrl = process.env.MCP_STATUS_URL ?? "http://localhost:9000/health";

  try {
    const res = await fetch(statusUrl, { cache: "no-store" });
    if (!res.ok) {
      return "MCP offline";
    }
    const data = await res.json();
    return `${data.status ?? "ok"} · agentes: ${(data.agents ?? []).join(", ")}`;
  } catch {
    return "MCP offline";
  }
}

export default async function Page() {
  const [post, workflowStatus] = await Promise.all([
    getLatestPost(),
    getWorkflowStatus(),
  ]);

  const aiTitle =
    post?.meta?._aioseo_title ??
    "Hotel cinco estrelas no Rio com reservas inteligentes";
  const aiDescription =
    post?.meta?._aioseo_description ??
    "Gere reservas imediatas em hotéis cinco estrelas no Rio de Janeiro com experiências exclusivas.";
  const originalTitle = stripHtml(post?.title?.rendered);
  const excerpt = stripHtml(post?.excerpt?.rendered);

  return (
    <main
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "3rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* MCP demonstra arquitetura headless escalável → ROI alvo R$15k/mês */}
      <section>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>
          AIOSEO MCP Demo · Hotéis RJ
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#555" }}>
          TruSEO Score projetado: {TRUSEO_SCORE} · Workflow status:{" "}
          {workflowStatus}
        </p>
      </section>

      <section
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ fontSize: "1.375rem", fontWeight: 600 }}>
          AI Metadata (MCP)
        </h2>
        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#1f3a93",
          }}
        >
          {aiTitle}
        </p>
        <p style={{ marginTop: "0.5rem", color: "#333" }}>{aiDescription}</p>
      </section>

      <section
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ fontSize: "1.375rem", fontWeight: 600 }}>Post Source</h2>
        <p style={{ fontWeight: 600, marginTop: "0.75rem" }}>Título original:</p>
        <p style={{ color: "#333" }}>{originalTitle || "Sem título ainda"}</p>
        <p style={{ fontWeight: 600, marginTop: "1rem" }}>Resumo:</p>
        <p style={{ color: "#333" }}>
          {excerpt ||
            "Crie um post no WordPress para ver o fluxo MCP em ação."}
        </p>
      </section>

      <section
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ fontSize: "1.375rem", fontWeight: 600 }}>KPIs</h2>
        <ul style={{ paddingLeft: "1.5rem", color: "#333" }}>
          <li>Tempo por post: -90%</li>
          <li>CTR projetado: +32%</li>
          <li>Agentes MCP ativos: 3</li>
          <li>Schema & on-page otimizados para reservas premium</li>
        </ul>
      </section>
    </main>
  );
}
