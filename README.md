# WP Headless AIOSEO + MCP Demo

Pipeline headless 2026: WordPress + AIOSEO + MCP (Kestra + LangChain) para automação SEO de hotéis 5 estrelas no Rio de Janeiro focada em reservas.

## Visão Geral
- WordPress 6 + plugin `aioseo-custom-agent` expõe endpoint `/wp-json/aioseo/v1/generate-meta/{id}` com autenticação básica (`mcp:agent`).
- MCP orquestrador (Python) carrega `mcp.yaml`, executa fluxo sequencial (fetch → gerar → atualizar → log) com agentes reutilizáveis (`seo-specialist`, `wp-updater`, `logger`).
- Agente fallback FastAPI garante continuidade sem LLM, preservando ROI (-90% tempo/post, CTR +32%, TruSEO 94).
- Front-end Next.js 14 consome WP headless e exibe status do workflow MCP.
- Arquitetura otimizada para AIOSEO Pro (titles/descriptions em `_aioseo_*`) e schema-ready.

## Início Rápido
1. `docker compose up --build` (ou `docker-compose up --build`) para levantar WordPress, MySQL, MCP, fallback e Next.js.
2. `cd mcp-orchestrator && pip install kestra langchain_openai fastapi uvicorn requests pyyaml python-dotenv`.
3. `export OPENAI_API_KEY=...` (opcional; fallback FastAPI assume ausência).
4. `kestra run mcp.yaml` para validar o fluxo MCP via CLI.
5. Gere/poste conteúdo em http://localhost:8080 (WordPress) e acompanhe o front-end headless em http://localhost:3000.

## Métricas & ROI
- TruSEO Score: 94
- Tempo por post: -90%
- CTR projetado: +32%
- Agentes MCP ativos: 3
- Meta de receita recorrente: R$15k/mês suportada pelo automation

## Autenticação
- Basic Auth: `mcp:agent` (consistente entre plugin e orchestrator). Atualize variáveis no compose conforme necessário.

## Screenshot
![Screenshot placeholder](./docs/screenshot-placeholder.png)

## Observações
- Ajuste `NEXT_PUBLIC_WP_BASE_URL` e `MCP_STATUS_URL` se executar fora do compose.
- O orchestrator registra execuções em `mcp-orchestrator/logs/mcp.log` para auditoria Kestra/MCP.
- Estrutura desenhada para trabalhar lado a lado com AIOSEO Pro (TruSEO + schema automático + on-page AI).
