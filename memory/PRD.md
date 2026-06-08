# StockAuto — PRD

## Problema
Marketplace de veículos B2C com foco em Campo Grande/MS. Compradores chegam por SEO local e contatam revendedores direto via WhatsApp. Revendedores pagam plano (Avulso/Loja) para anunciar.

## Stack
- Backend: FastAPI + MongoDB (motor) + JWT (cookies httpOnly) + Emergent Object Storage
- Frontend: React 19 + CRACO + Tailwind + Radix UI + Lucide
- Repositório: https://github.com/e4000548-ux/Autorepasse.git

## Personas
- **Visitante** — busca veículo, encontra anúncios via SEO local, fala no WhatsApp
- **Revendedor** — cadastra loja, paga via PIX, gerencia anúncios em /painel
- **Admin** — modera anúncios/lojistas, configura PIX/planos, gerencia banners

## Setup do Ambiente (08/Jan/2026)
- Repo clonado em /app (preservando .git e .emergent)
- `.env` recriados (placeholders dev):
  - backend/.env → MONGO_URL local, JWT_SECRET dev, EMERGENT_LLM_KEY universal, ADMIN_EMAIL/ADMIN_PASSWORD padrão
  - frontend/.env → REACT_APP_BACKEND_URL apontando para preview Kubernetes
- Dependências instaladas: `pip install -r requirements.txt` + `yarn install`
- Supervisor: backend + frontend + mongodb RUNNING
- Seed automático no startup criou:
  - 1 admin (admin@stockauto.com / Admin@123)
  - 3 revendedores seed nacional + 2 de Campo Grande/MS (Dealer@123)
  - 18 anúncios ativos (12 nacional + 6 Campo Grande)
- Validação curl OK: login admin, /auth/me, listagem GET /api/vehicles (18 ativos), register + login dealer novo

## Funcionalidades já presentes no repo
- Auth JWT (register/login/logout/me) com cookies httpOnly
- CRUD veículos (dealer) com aprovação manual do admin (`status=pending` → `active`)
- Painel ADM: usuários, veículos, notificações, settings (PIX/planos), banners (CRUD + reorder + upload duplo desktop/mobile)
- Banner carousel na home (autoplay 5s)
- SEO básico: sitemap.xml e robots.txt em /api/sitemap.xml e /api/robots.txt
- Object storage (Emergent) para upload de logos/capas/fotos/banners
- Seed de Campo Grande/MS com revendedores e anúncios locais

## Backlog priorizado (próximas etapas solicitadas pelo usuário)
- **P0** — Ajustes de SEO Local para Campo Grande - MS (aguardando instruções)
- **P0** — Finalização do Painel ADM (aguardando escopo do usuário)
- **P1** — Open Graph + JSON-LD (Vehicle/AutoDealer) nas páginas de detalhe
- **P1** — Expor sitemap.xml em /sitemap.xml (sem prefixo /api)
- **P2** — Multi-cidade/UF para expansão futura
- **P2** — Stats dinâmicos na home (substituir hardcoded)

## Credenciais
Ver `/app/memory/test_credentials.md`
