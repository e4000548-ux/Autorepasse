import { Link } from "react-router-dom";
import { brl, km } from "@/lib/format";
import { fileUrl } from "@/lib/api";
import { MapPin, TrendingUp, Tag, Flame } from "lucide-react";

/**
 * Card especial para o Hub de Repasse B2B.
 * Visual diferenciado (borda amarela + selo "REPASSE B2B") para se diferenciar
 * do classificado público. Mostra Valor FIPE vs Valor de Oferta e estima a
 * margem em R$ e % quando ambos os valores estão preenchidos.
 * Quando a margem é >= 20%, exibe selo "MELHOR MARGEM" em destaque.
 */
export default function RepasseCard({ v, testid }) {
  const photo = v.main_photo || (v.photos && v.photos[0]);
  const img = fileUrl(photo);
  const fipe = Number(v.fipe_price) || 0;
  const offer = Number(v.price) || 0;
  const hasMargin = fipe > 0 && offer > 0 && fipe > offer;
  const marginValue = hasMargin ? fipe - offer : 0;
  const marginPct = hasMargin ? ((fipe - offer) / fipe) * 100 : 0;
  const isTopMargin = marginPct >= 20;

  return (
    <Link
      to={`/repasse/${v.slug || v.id}`}
      data-testid={testid}
      className={`group flex flex-col bg-white border-2 transition-all duration-300 hover:-translate-y-1 ${
        isTopMargin
          ? "border-[#FF3B30] hover:border-[#E13128] hover:shadow-[0_12px_40px_rgba(255,59,48,0.25)]"
          : "border-[#F5A623] hover:border-[#E59411] hover:shadow-[0_12px_40px_rgba(245,166,35,0.25)]"
      }`}
    >
      <div className="aspect-[4/3] overflow-hidden bg-zinc-100 relative">
        {img ? (
          <img
            src={img}
            alt={`${v.brand} ${v.model} ${v.year_model} - Repasse B2B`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">sem foto</div>
        )}
        <div
          className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 inline-flex items-center gap-1 ${
            isTopMargin ? "bg-[#FF3B30] text-white" : "bg-[#F5A623] text-black"
          }`}
        >
          <Tag size={11} /> Repasse B2B
        </div>
        <div className="absolute top-3 right-3 bg-black/80 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
          {v.category}
        </div>
        {isTopMargin && (
          <div
            className="absolute bottom-3 left-3 bg-white text-[#FF3B30] text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 inline-flex items-center gap-1 shadow-lg"
            data-testid={`repasse-top-margin-${v.id}`}
          >
            <Flame size={12} /> Melhor margem
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          {v.brand} • {v.year_made}/{v.year_model}
        </div>
        <h3
          className="mt-1 font-bold text-lg leading-tight tracking-tight"
          style={{ fontFamily: "Cabinet Grotesk, Inter, sans-serif" }}
        >
          {v.model}{" "}
          {v.version ? <span className="font-medium text-zinc-600">{v.version}</span> : null}
        </h3>
        <div className="mt-2 text-sm text-zinc-600 flex items-center gap-3">
          <span>{km(v.km)}</span>
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {v.city}/{v.uf}
          </span>
        </div>

        <div className="mt-auto pt-5 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-zinc-200 px-3 py-2 bg-zinc-50">
              <div className="text-[9px] uppercase tracking-widest font-bold text-zinc-500">FIPE</div>
              <div className="text-sm font-bold text-zinc-700 line-through decoration-1">
                {fipe ? brl(fipe) : "—"}
              </div>
            </div>
            <div
              className={`border-2 px-3 py-2 ${
                isTopMargin ? "border-[#FF3B30] bg-red-50" : "border-[#F5A623] bg-[#FFF8EC]"
              }`}
            >
              <div
                className={`text-[9px] uppercase tracking-widest font-black ${
                  isTopMargin ? "text-[#FF3B30]" : "text-[#8A5F0D]"
                }`}
              >
                Oferta
              </div>
              <div
                className="text-base font-black tracking-tight text-black"
                style={{ fontFamily: "Cabinet Grotesk, Inter, sans-serif" }}
              >
                {offer ? brl(offer) : "—"}
              </div>
            </div>
          </div>
          {hasMargin && (
            <div
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 ${
                isTopMargin ? "bg-[#FF3B30] text-white" : "bg-emerald-50 text-emerald-800"
              }`}
            >
              <TrendingUp size={13} />
              Margem est. {brl(marginValue)} ({marginPct.toFixed(1)}%)
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
