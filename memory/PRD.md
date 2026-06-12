# StockAuto — PRD

## Problema
Marketplace de veículos B2C com foco em Campo Grande/MS. Compradores chegam por SEO local e contatam revendedores direto via WhatsApp. Revendedores pagam plano (Avulso/Loja) para anunciar.

## Stack
- Backend: FastAPI + MongoDB (motor) + JWT (cookies httpOnly) + Emergent Object Storage + Pillow
- Frontend: React 19 + CRACO + Tailwind + Radix UI + Lucide + react-helmet-async
- Repositório: https://github.com/e4000548-ux/Autorepasse.git
- Produção: https://stockauto.com.br

## Personas
- **Visitante** — busca veículo, encontra anúncios via SEO local, fala no WhatsApp
- **Revendedor** — cadastra loja, paga via PIX, gerencia anúncios em /painel
- **Admin** — modera anúncios/lojistas, configura PIX/planos, gerencia banners

## Implementado

### 12/Jan/2026 — Hub de Repasse B2B (Exclusivo Lojistas)
- **Novo modelo de dados** em `vehicles`:
  - `ad_type`: `"public"` (default) | `"repasse"` — separa anúncios públicos dos B2B
  - `fipe_price`: opcional, valor FIPE de referência (obrigatório quando ad_type=repasse)
  - `price` é reutilizado como valor de oferta/repasse quando ad_type=repasse
- **Endpoints novos**:
  - `GET /api/repasse/vehicles` — listagem com auth obrigatória (dealer/admin)
  - `GET /api/repasse/vehicles/{slug}` — detalhe com auth obrigatória
  - `GET /api/admin/vehicles?ad_type=repasse` — admin filtra por tipo
  - Stats `admin/stats` agora expõe `repasse_active` e `repasse_pending`
- **Isolamento público**:
  - `GET /api/vehicles` (lista pública) **exclui** ad_type=repasse
  - `GET /api/vehicles/{slug}` retorna 404 se repasse
  - Sitemap.xml também exclui repasse (não indexa)
- **Validações backend**: ad_type=repasse exige `fipe_price > 0` e `price > 0` (HTTP 400 se faltar)
- **Frontend**:
  - Nova rota `/repasse` (lista) + `/repasse/:slug` (detalhe), ambas com `ProtectedRoute roles=["dealer","admin"]`
  - `ProtectedRoute` agora aceita `roles` (array) além do `role` legado
  - Novo componente `RepasseCard.jsx`: borda dourada (#F5A623), selo "REPASSE B2B", FIPE riscado vs Oferta destacada, margem calculada (R$ + %)
  - Página `Repasse.jsx`: hero preto+dourado com tag "ÁREA RESTRITA", filtros, listagem
  - Página `RepasseDetail.jsx`: galeria, box dourado FIPE/Oferta/Margem, **botão WhatsApp** com mensagem exata "Olá, vi seu veículo no Repasse do StockAuto e tenho interesse na parceria."
  - `VehicleForm.jsx`: toggle visual no topo "Classificado Público" vs "Repasse B2B"; quando Repasse, mostra campo "Valor Tabela FIPE" obrigatório
  - `DealerPanel.jsx`: badge "Repasse B2B" nas linhas + atalho "Ver Hub de Repasse" no header
  - `AdminPanel.jsx`: novo filtro `ad_type`, borda dourada nas linhas repasse, badge "Repasse B2B", botão **Excluir definitivo** disponível para todos os anúncios (admin)
  - `Layout.jsx`: link "REPASSE" em dourado no nav, visível apenas para dealer/admin (desktop + mobile)
  - SEO: páginas repasse com `noindex` (não vão pra Google)

### 11/Jan/2026 — Desligamento do seed automático
- `SEED_DEMO_DATA` env var (default `false`) controla criação de dados fictícios no startup
- Em produção, restart não recria dealers/veículos fictícios — apenas admin é garantido

### 10/Jan/2026 — SEO Local Campo Grande/MS completo
- **robots.txt** estático em `/robots.txt` + dinâmico em `/api/robots.txt`. Disallow para `/painel`, `/admin`, `/api/dealer/`, `/api/admin/`
- **sitemap.xml** em `/sitemap.xml` (índice) → aponta para `/api/sitemap.xml` (dinâmico, 32+ URLs)
  - Inclui home, listagens, categorias, todos os veículos ativos, todos os revendedores ativos
  - Com `lastmod`, `changefreq`, `priority` adequados
- **Open Graph + Twitter Cards** padrão em `index.html` + dinâmicos por página via `react-helmet-async`
- **JSON-LD Schema.org**:
  - `AutoDealer` + `WebSite` com `SearchAction` (caixa de busca no Google)
  - `LocalBusiness` com geo Campo Grande (-20.4697, -54.6201)
  - `Vehicle` + `Offer` (preço, disponibilidade, condição) em cada página de detalhe de anúncio
  - `AutoDealer` em cada página de revendedor (com address, telephone, areaServed)
  - `BreadcrumbList` em páginas de detalhe
- **Meta tags geo** (`geo.region=BR-MS`, `geo.placename=Campo Grande`, `geo.position`, `ICBM`)
- **Canonical URLs** dinâmicas por página (helmet gerencia)
- **Page titles** otimizados:
  - Home: "StockAuto — Comprar carros, motos e camionetes em Campo Grande, MS"
  - Listing: "{Categoria} à venda em Campo Grande - MS"
  - Vehicle: "{Marca} {Modelo} {Ano} em {Cidade} - {UF} | StockAuto"
  - Dealer: "{Loja} — Revendedor em {Cidade}/{UF} | StockAuto"
- **Keywords locais** em meta keywords (carros usados Campo Grande, etc.)
- **OG image padrão** (1200×630) gerada em `/og-default.jpg` com a logo + texto "Campo Grande, MS"
- **Componente `<SEO />`** reutilizável em `/app/frontend/src/components/SEO.jsx`
- **Verification placeholder** para Google Search Console (comentado, basta descomentar e preencher código)
- **SITE_URL** env var em `backend/.env` (https://stockauto.com.br)

### 09/Jan/2026 — Marca d'água em fotos de veículos
- Logo PNG transparente em `/app/backend/assets/watermark.png`
- Função `apply_watermark()` em Pillow: 15% largura, opacidade 60%, canto inferior direito, JPEG q88
- Aplicada apenas em `POST /api/dealer/uploads`. Logo/capa/banner não recebem marca
- Suporte a orientação EXIF (auto-rotate de fotos de celular)
- Fallback gracioso se algo falhar

### 08/Jan/2026 — Setup do ambiente
- Repo clonado, .env recriados, deps instaladas, supervisor RUNNING
- Seed: 1 admin, 5 revendedores (3 nacionais + 2 Campo Grande), 18+ veículos ativos

## Backlog priorizado

### O usuário precisa fazer manualmente (fora do código)
- **P0** — Cadastrar no [Google Search Console](https://search.google.com/search-console), verificar domínio e submeter sitemap (`https://stockauto.com.br/api/sitemap.xml`)
- **P0** — Cadastrar no [Google Meu Negócio](https://business.google.com) com endereço, telefone, fotos (essencial para SEO local Campo Grande)
- **P1** — Cadastrar no Bing Webmaster Tools
- **P1** — Forçar indexação inicial via "Inspeção de URL" no Search Console para home + 5-10 anúncios top
- **P2** — Após criar conta no Search Console, descomentar `<meta name="google-site-verification">` no `index.html` e preencher o código

### Próximas tarefas de código
- **P0** — Finalização do Painel ADM (aguardando escopo do usuário)
- **P1** — Backlinks: configurar Sociais (Instagram, Facebook) e adicionar à propriedade JSON-LD `sameAs`
- **P1** — OG image dinâmica por veículo (pegar foto principal do anúncio em vez da default)
- **P2** — Drag-and-drop nativo para reorder de banners
- **P2** — Stats reais nos cards do hero
- **P2** — Pre-rendering (Puppeteer/Prerender.io) para crawlers sem JS (Facebook, WhatsApp)

## Credenciais
Ver `/app/memory/test_credentials.md`
