# StockAuto — PRD

## Problema
Marketplace de veículos B2C em Campo Grande/MS. Compradores chegam por SEO local e contatam revendedores direto via WhatsApp. Revendedores pagam plano (Avulso/Loja) para anunciar.

## Stack
- Backend: FastAPI + MongoDB (motor) + JWT (cookies httpOnly) + Emergent Object Storage
- Frontend: React 19 + CRACO + Tailwind + Radix UI + Lucide
- Branch base: `conflict_050626_0158` (versão avançada do repo)

## Personas
- **Visitante** — busca veículo, encontra anúncios via SEO local, fala no WhatsApp
- **Revendedor** — cadastra loja, paga via PIX, gerencia anúncios em /painel
- **Admin** — modera anúncios/lojistas, configura PIX/planos, gerencia banners

## Implementado (até 07/Jun/2026)
- Setup completo do branch `conflict_050626_0158` em /app (07/Jun)
- Storage Emergent inicializado (EMERGENT_LLM_KEY configurada)
- Badge "Made with Emergent" oculta (CSS white-label em index.css)
- **[NOVO] Banner rotativo na home com painel admin (07/Jun)**:
  - Backend: collection `banners`, GET /api/banners (público), CRUD /api/admin/banners (POST/PUT/DELETE), PUT /api/admin/banners/reorder
  - Frontend: `components/BannerCarousel.jsx` (autoplay 5s, dots, arrows, pause on hover, picture/srcSet para desktop/mobile)
  - AdminPanel: nova aba "Banners" com listagem, upload duplo (desktop + mobile opcional), link externo, alt text, toggle ativo, reorder (↑/↓), editar e excluir
  - SEO preservado: H1 SR-only com texto local ("Campo Grande, MS") sempre presente acima do banner
  - Fallback hero quando não há banners cadastrados
  - Tamanhos: Desktop 1920×500 · Mobile 1080×1080

## Backlog priorizado
- **P0** — Testar com banners reais do cliente (UX/UI checagem após upload)
- **P1** — SEO completo: Open Graph + JSON-LD Vehicle/AutoDealer nas páginas de detalhe, sitemap.xml exposto em /sitemap.xml (sem prefixo /api)
- **P1** — Melhorias UX do AdminPanel (filtros, paginação na listagem de lojistas/anúncios)
- **P2** — Drag-and-drop nativo para reorder de banners (hoje é via setas ↑↓)
- **P2** — Stats reais nos cards do hero (substituir "+1.500" hardcoded por contagem dinâmica)
- **P2** — Multi-cidade / multi-estado para SEO em outras capitais

## Credenciais
Ver `/app/memory/test_credentials.md`
