from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="SEO MCP Fallback",
    version="2026.1",
    description="Fallback determinístico mantém ROI quando LLM não está disponível.",
)


class GeneratePayload(BaseModel):
    title: str
    focus: str | None = None


@app.post("/generate")
async def generate(payload: GeneratePayload) -> dict:
    base_title = payload.title.strip() or "Hotel 5 estrelas em Copacabana"
    focus = (payload.focus or "Reservas exclusivas no Rio de Janeiro").strip()

    short_title = f"{base_title[:40]} | Reservas RJ"
    seo_title = short_title[:58].rstrip()

    description = (
        f"{base_title} garante estadia cinco estrelas no Rio de Janeiro. "
        "Reserve agora e acesse benefícios VIP com confirmação imediata."
    )
    seo_description = description[:155].rstrip()

    return {
        "title": seo_title,
        "description": seo_description,
        "focus": focus,
        "mcp_comment": "Fallback mantém fluxo contínuo → MCP evita perda de 32% CTR projetada.",
    }
