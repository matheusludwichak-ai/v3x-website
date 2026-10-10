import { BarChart3, Home, MessageCircle, Send, UserRound } from "lucide-react";

const ACCENT = "#4F5BFF";

function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-7 pt-4 text-[12px] font-semibold ${dark ? "text-white" : "text-[#0d0f1c]"}`}>
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <i className={`h-2.5 w-4 rounded-[3px] border ${dark ? "border-white/80" : "border-[#0d0f1c]/80"}`} />
      </span>
    </div>
  );
}

function TabBar({ active }: { active: number }) {
  const icons = [Home, BarChart3, MessageCircle, UserRound];
  return (
    <div className="absolute inset-x-4 bottom-4 flex justify-around rounded-[22px] bg-white px-2 py-3 shadow-[0_10px_30px_-12px_rgba(20,24,60,0.35)]">
      {icons.map((Icon, i) => (
        <Icon key={i} className="size-[19px]" strokeWidth={2} color={i === active ? ACCENT : "#a3a6bd"} />
      ))}
    </div>
  );
}

function HomeScreen() {
  const bars = [38, 52, 44, 61, 57, 74, 88];
  return (
    <div className="h-full bg-[#f4f5fa] text-[#0d0f1c] [font-variant-numeric:tabular-nums]">
      <StatusBar />
      <div className="px-5 pt-8">
        <p className="text-[12px] text-[#6b6f88]">Bom dia, Camila</p>
        <p className="mt-0.5 text-[22px] font-semibold tracking-tight">Resumo de hoje</p>

        <div className="mt-5 rounded-[22px] p-5 text-white" style={{ background: `linear-gradient(140deg, ${ACCENT}, #8B5CF6)` }}>
          <p className="text-[11.5px] text-white/80">Vendas hoje</p>
          <p className="mt-1 text-[28px] font-semibold tracking-tight">R$ 12.480</p>
          <p className="text-[11px] text-white/85">+18% em relação a ontem</p>
          <div className="mt-4 flex h-[54px] items-end gap-[7px]">
            {bars.map((b, i) => (
              <span key={i} className="flex-1 rounded-[4px]" style={{ height: `${b}%`, background: i === bars.length - 1 ? "#fff" : "rgba(255,255,255,0.38)" }} />
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-[18px] bg-white p-4">
            <p className="text-[11px] text-[#6b6f88]">Pedidos</p>
            <p className="mt-1 text-[20px] font-semibold">86</p>
          </div>
          <div className="rounded-[18px] bg-white p-4">
            <p className="text-[11px] text-[#6b6f88]">Ticket médio</p>
            <p className="mt-1 text-[20px] font-semibold">R$ 145</p>
          </div>
        </div>

        <div className="mt-3 rounded-[18px] bg-white p-4">
          <div className="flex justify-between text-[11.5px]">
            <span className="font-medium">Meta do mês</span>
            <span className="text-[#6b6f88]">68%</span>
          </div>
          <div className="mt-2.5 h-[7px] rounded-full bg-[#e7e8f2]">
            <div className="h-full w-[68%] rounded-full" style={{ background: ACCENT }} />
          </div>
        </div>
      </div>
      <TabBar active={0} />
    </div>
  );
}

function AssistantScreen() {
  const week = [30, 42, 38, 51, 47, 66, 58];
  const pts = week.map((v, i) => `${(i / 6) * 200},${70 - v}`).join(" ");
  return (
    <div className="h-full bg-white text-[#0d0f1c]">
      <StatusBar />
      <div className="flex items-center gap-3 border-b border-[#eceef5] px-5 pb-3 pt-7">
        <span className="grid size-9 place-items-center rounded-full text-[13px] font-semibold text-white" style={{ background: `linear-gradient(140deg, ${ACCENT}, #8B5CF6)` }}>P</span>
        <div>
          <p className="text-[14px] font-semibold">Assistente Pulse</p>
          <p className="flex items-center gap-1.5 text-[11px] text-[#6b6f88]"><i className="size-1.5 rounded-full" style={{ background: ACCENT }} />online</p>
        </div>
      </div>

      <div className="space-y-3 px-4 pt-4 text-[12.5px] leading-snug">
        <div className="ml-auto w-fit max-w-[78%] rounded-[18px] rounded-br-[6px] px-4 py-2.5 text-white" style={{ background: ACCENT }}>
          Como foram as vendas desta semana?
        </div>
        <div className="max-w-[86%] rounded-[18px] rounded-bl-[6px] bg-[#f1f2f8] px-4 py-2.5">
          As vendas subiram 12% em relação à semana passada.
        </div>
        <div className="max-w-[86%] rounded-[18px] border border-[#eceef5] p-3.5">
          <p className="text-[11px] text-[#6b6f88]">Faturamento por dia</p>
          <svg viewBox="0 -4 200 80" className="mt-2 h-[50px] w-full overflow-visible" preserveAspectRatio="none">
            <polyline points={pts} fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="mt-1 flex justify-between text-[9.5px] text-[#a3a6bd]">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => <span key={d}>{d}</span>)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {["Produtos em alta", "Ver o mês"].map((c) => (
            <span key={c} className="rounded-full border px-3 py-1.5 text-[11px] font-medium" style={{ borderColor: `${ACCENT}55`, color: ACCENT }}>{c}</span>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-5 flex items-center gap-2 rounded-full border border-[#e2e4ef] bg-white py-1.5 pl-4 pr-1.5">
        <span className="flex-1 text-[12px] text-[#a3a6bd]">Pergunte sobre o seu negócio</span>
        <span className="grid size-8 place-items-center rounded-full text-white" style={{ background: ACCENT }}><Send className="size-4" /></span>
      </div>
    </div>
  );
}

/** Two coherent screens of the "Pulse" mobile concept, built in code (base canvas 720x640). */
export function PulsePhones() {
  return (
    <div className="relative h-[640px] w-[720px]">
      <div className="pulse-a absolute left-[70px] top-[28px] h-[590px] w-[290px]">
        <div className="pulse-fan-a h-full">
          <div className="phone h-full -rotate-[4deg]"><div className="phone-island" /><div className="phone-screen"><HomeScreen /></div></div>
        </div>
      </div>
      <div className="pulse-b absolute left-[370px] top-[8px] h-[590px] w-[290px]">
        <div className="pulse-fan-b h-full">
          <div className="phone h-full rotate-[3deg]"><div className="phone-island" /><div className="phone-screen"><AssistantScreen /></div></div>
        </div>
      </div>
    </div>
  );
}
