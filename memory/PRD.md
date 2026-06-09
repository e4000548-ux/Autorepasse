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

## Implementado (até 09/Jan/2026)
- **[09/Jan] Marca d'água automática em fotos de veículos**:
  - Logo enviada pelo cliente (PNG transparente) em `/app/backend/assets/watermark.png`
  - Função `apply_watermark()` em `server.py` usando Pillow: redimensiona para 15% da largura, opacidade 60%, canto inferior direito, margem 2.5%
  - Output sempre em JPEG progressivo, quality 88 (otimiza tamanho)
  - Suporta orientação EXIF (rotaciona automaticamente fotos de celular)
  - Aplicada apenas em `POST /api/dealer/uploads` (fotos de anúncios). Logos/capas dos revendedores e banners do admin **não recebem** marca (institucional)
  - Cache em memória do PNG da logo (carregado 1x no primeiro upload)
  - Fallback gracioso: se a marca falhar, foto original é salva sem quebrar o fluxo
- Setup do ambiente em 08/Jan: repo clonado, .env recriados, deps instaladas, supervisor RUNNING

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
