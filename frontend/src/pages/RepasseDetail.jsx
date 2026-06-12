/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { fileUrl } from "@/lib/api";
import { brl, km, waLink, digits, txLabel, fuelLabel } from "@/lib/format";
import SEO from "@/components/SEO";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import {
  MapPin,
  ArrowLeft,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Palette,
  ChevronLeft,
  ChevronRight,
  Lock,
  TrendingUp,
  Tag,
} from "lucide-react";

const REPASSE_WA_MESSAGE =
  "Olá, vi seu veículo no Repasse do StockAuto e tenho interesse na parceria.";

export default function RepasseDetail() {
  const { slug } = useParams();
  const [v, setV] = useState(null);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setV(null);
    setError(null);
    api
      .get(`/repasse/vehicles/${slug}`)
      .then((r) => setV(r.data))
      .catch((e) => setError(e?.response?.data?.detail || "Oferta de repasse não encontrada."));
  }, [slug]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="text-2xl font-black tracking-tight" style={{ fontFamily: "Cabinet Grotesk" }}>
          {error}
        </div>
        <Link to="/repasse" className="mt-6 inline-block border-b-2 border-black font-bold text-sm uppercase">
          ← Voltar ao Hub de Repasse
        </Link>
      </div>
    );
  }

  if (!v) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-10 w-1/2 bg-zinc-100" />
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="aspect-[4/3] bg-zinc-100" />
          <div className="space-y-3">
            <div className="h-6 w-3/4 bg-zinc-100" />
            <div className="h-6 w-1/2 bg-zinc-100" />
            <div className="h-24 bg-zinc-100" />
          </div>
        </div>
      </div>
    );
  }

  const photos = (v.photos && v.photos.length ? v.photos : v.main_photo ? [v.main_photo] : []).filter(Boolean);
  const photo = photos[active];
  const dealer = v.dealer || {};
  const title = `${v.brand} ${v.model}${v.version ? " " + v.version : ""}`;
  const fipe = Number(v.fipe_price) || 0;
  const offer = Number(v.price) || 0;
  const hasMargin = fipe > 0 && offer > 0 && fipe > offer;
  const marginValue = hasMargin ? fipe - offer : 0;
  const marginPct = hasMargin ? ((fipe - offer) / fipe) * 100 : 0;

  return (
    <div data-testid="repasse-detail-page" className="pb-24">
      <SEO
        title={`Repasse: ${title} ${v.year_model} — StockAuto B2B`}
        description={`Repasse B2B - ${title} ${v.year_made}/${v.year_model}, ${km(v.km)} em ${v.city}/${v.uf}. Oferta ${brl(offer)} vs FIPE ${brl(fipe)}.`}
        canonical={`/repasse/${v.slug || v.id}`}
        noindex
      />

      {/* Breadcrumb */}
      <div className="bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-zinc-500 flex items-center gap-2">
          <Link to="/repasse" className="hover:text-black font-bold uppercase tracking-tight inline-flex items-center gap-1">
            <ArrowLeft size={12} /> Hub de Repasse
          </Link>
          <span>/</span>
          <span className="text-black font-bold uppercase truncate">{title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-5 gap-10">
        {/* GALLERY */}
        <div className="lg:col-span-3">
          <div className="aspect-[4/3] bg-zinc-100 overflow-hidden relative">
            {photo ? (
              <img src={fileUrl(photo)} alt={`${title} ${v.year_model}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-zinc-400">Sem foto</div>
            )}
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-[#F5A623] text-black text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1.5">
              <Tag size={12} /> Repasse B2B
            </div>
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setActive((i) => (i - 1 + photos.length) % photos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white grid place-items-center"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setActive((i) => (i + 1) % photos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white grid place-items-center"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          {photos.length > 1 && (
            <div className="mt-3 grid grid-cols-6 gap-2">
              {photos.map((p, i) => (
                <button
                  key={p + i}
                  onClick={() => setActive(i)}
                  className={`aspect-square overflow-hidden ${i === active ? "ring-2 ring-[#F5A623]" : "opacity-70 hover:opacity-100"}`}
                >
                  <img src={fileUrl(p)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {v.description && (
            <div className="mt-10">
              <div className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500">Descrição</div>
              <p className="mt-3 text-zinc-700 leading-relaxed whitespace-pre-wrap">{v.description}</p>
            </div>
          )}
        </div>

        {/* CONTACT + PRICES */}
        <div className="lg:col-span-2">
          <div className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500">{v.category}</div>
          <h1
            className="mt-2 text-3xl sm:text-4xl font-black tracking-tighter leading-none"
            style={{ fontFamily: "Cabinet Grotesk, Inter, sans-serif" }}
          >
            {title}
          </h1>
          <div className="mt-2 text-zinc-600 text-sm flex items-center gap-3">
            <span>{v.year_made}/{v.year_model}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {v.city}/{v.uf}</span>
          </div>

          {/* Price block */}
          <div className="mt-6 border-2 border-[#F5A623] bg-[#FFF8EC] p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">FIPE de referência</div>
                <div className="mt-1 text-lg font-bold text-zinc-700 line-through decoration-1">
                  {fipe ? brl(fipe) : "—"}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest font-black text-[#8A5F0D]">Valor de Oferta</div>
                <div
                  className="mt-1 text-3xl font-black tracking-tight text-black"
                  style={{ fontFamily: "Cabinet Grotesk, Inter, sans-serif" }}
                >
                  {offer ? brl(offer) : "—"}
                </div>
              </div>
            </div>
            {hasMargin && (
              <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 text-sm font-bold px-3 py-2">
                <TrendingUp size={16} />
                Margem estimada: {brl(marginValue)} ({marginPct.toFixed(1)}%)
              </div>
            )}
          </div>

          {/* WhatsApp */}
          {digits(dealer.whatsapp || dealer.phone) && (
            <a
              data-testid="repasse-whatsapp-btn"
              href={waLink(dealer.whatsapp || dealer.phone, REPASSE_WA_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white h-14 font-bold uppercase tracking-tight"
            >
              <WhatsAppIcon size={22} />
              Falar no WhatsApp
            </a>
          )}

          {/* Dealer info */}
          {dealer.store_name && (
            <div className="mt-6 border border-zinc-200 p-4">
              <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Revendedor</div>
              <div className="mt-1 text-base font-bold tracking-tight">{dealer.store_name}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{dealer.city}/{dealer.uf}</div>
              <Link
                to={`/revendedor/${dealer.slug || dealer.id}`}
                className="mt-3 inline-block text-xs font-bold uppercase tracking-tight border-b-2 border-black hover:text-[#FF3B30] hover:border-[#FF3B30]"
              >
                Ver perfil →
              </Link>
            </div>
          )}

          {/* Specs */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <Spec icon={<Calendar size={14} />} label="Ano modelo" value={v.year_model} />
            <Spec icon={<Gauge size={14} />} label="Quilometragem" value={km(v.km)} />
            <Spec icon={<Fuel size={14} />} label="Combustível" value={fuelLabel(v.fuel) || "—"} />
            <Spec icon={<Settings size={14} />} label="Câmbio" value={txLabel(v.transmission) || "—"} />
            <Spec icon={<Palette size={14} />} label="Cor" value={v.color || "—"} />
            <Spec icon={<Lock size={14} />} label="Visibilidade" value="Hub B2B" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, label, value }) {
  return (
    <div className="border border-zinc-200 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className="text-sm font-bold tracking-tight mt-0.5">{value}</div>
    </div>
  );
}
