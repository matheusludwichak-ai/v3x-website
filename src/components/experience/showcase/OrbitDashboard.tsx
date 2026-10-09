const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const revenue = [118, 124, 121, 133, 141, 138, 149, 157, 154, 166, 175, 184];
const previous = [104, 109, 112, 115, 119, 121, 126, 129, 133, 137, 140, 146];

const kpis = [
  { label: "Receita recorrente", value: "R$ 184,2 mil", delta: "+6,4%", up: true },
  { label: "Clientes ativos", value: "1.248", delta: "+3,1%", up: true },
  { label: "Ticket médio", value: "R$ 147,60", delta: "-1,2%", up: false },
  { label: "Cancelamentos", value: "2,3%", delta: "-0,4 p.p.", up: true },
];

const channels = [
  { name: "Orgânico", pct: 42 },
  { name: "Indicação", pct: 27 },
  { name: "Mídia paga", pct: 19 },
  { name: "Parcerias", pct: 12 },
];

const rows = [
  ["Atlas Engenharia", "Plano Pro", "R$ 1.290", "Pago"],
  ["Casa Brava Café", "Plano Base", "R$ 349", "Pago"],
  ["Norte Logística", "Plano Pro", "R$ 1.290", "Pendente"],
  ["Lume Odontologia", "Plano Base", "R$ 349", "Pago"],
];

const W = 640;
const H = 210;
const min = 95;
const max = 190;
const x = (i: number) => (i / (months.length - 1)) * W;
const y = (v: number) => H - ((v - min) / (max - min)) * H;
const line = (data: number[]) => data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

export function OrbitDashboard() {
  return (
    <div className="flex h-full w-full bg-[#0b0d1a] text-[#f5f6fa] [font-variant-numeric:tabular-nums]">
      <aside className="flex w-[190px] shrink-0 flex-col border-r border-white/8 bg-[#090a15] px-5 py-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-full border-2 border-[#5B8CFF]">
            <span className="size-2 rounded-full bg-[#8B5CF6]" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Orbit</span>
        </div>
        <nav className="mt-9 space-y-1 text-[12.5px]">
          {["Visão geral", "Receita", "Clientes", "Cohorts", "Relatórios", "Configurações"].map((item, i) => (
            <div key={item} className={i === 0 ? "rounded-lg bg-white/8 px-3 py-2 text-white" : "px-3 py-2 text-[#8a8da3]"}>
              {item}
            </div>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-white/8 p-3 text-[11px] leading-snug text-[#8a8da3]">
          Dados fictícios para demonstração.
        </div>
      </aside>

      <main className="flex-1 px-7 py-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a8da3]">Painel financeiro</p>
            <h4 className="mt-1.5 text-[22px] font-semibold tracking-tight">Visão geral</h4>
          </div>
          <div className="flex gap-2 text-[11.5px]">
            <span className="rounded-lg border border-white/10 px-3 py-1.5 text-[#c9cbe0]">Últimos 12 meses</span>
            <span className="rounded-lg bg-gradient-to-r from-[#3882F6] to-[#8B5CF6] px-3 py-1.5 font-medium">Exportar</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-3">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-white/8 bg-[#11132a] p-4">
              <p className="text-[11px] text-[#8a8da3]">{k.label}</p>
              <p className="mt-2 text-[21px] font-semibold tracking-tight">{k.value}</p>
              <p className={k.up ? "mt-1.5 text-[11px] font-medium text-[#7fb2ff]" : "mt-1.5 text-[11px] font-medium text-[#c4b5fd]"}>
                {k.delta} <span className="font-normal text-[#6f7290]">vs. mês anterior</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-[1fr_250px] gap-3">
          <div className="rounded-xl border border-white/8 bg-[#11132a] p-5">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium">Receita recorrente mensal</p>
              <div className="flex gap-4 text-[10.5px] text-[#8a8da3]">
                <span className="flex items-center gap-1.5"><i className="h-[3px] w-4 rounded bg-gradient-to-r from-[#3882F6] to-[#8B5CF6]" />2026</span>
                <span className="flex items-center gap-1.5"><i className="h-[3px] w-4 rounded bg-white/25" />2025</span>
              </div>
            </div>
            <svg viewBox={`0 -10 ${W} ${H + 30}`} className="mt-4 h-[210px] w-full overflow-visible">
              <defs>
                <linearGradient id="orbit-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#5B6CF6" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#5B6CF6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="orbit-line" x1="0" x2="1">
                  <stop offset="0" stopColor="#3882F6" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1="0" x2={W} y1={(H / 3) * i} y2={(H / 3) * i} stroke="white" strokeOpacity="0.06" />
              ))}
              <path d={`${line(revenue)} L${W},${H} L0,${H} Z`} fill="url(#orbit-area)" />
              <path d={line(previous)} fill="none" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 5" />
              <path d={line(revenue)} fill="none" stroke="url(#orbit-line)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx={x(11)} cy={y(184)} r="5" fill="#8B5CF6" stroke="#0b0d1a" strokeWidth="2.5" />
              {months.map((m, i) => (
                <text key={m} x={x(i)} y={H + 20} textAnchor="middle" fontSize="10.5" fill="#6f7290">{m}</text>
              ))}
            </svg>
          </div>

          <div className="rounded-xl border border-white/8 bg-[#11132a] p-5">
            <p className="text-[13px] font-medium">Novos clientes por canal</p>
            <div className="mt-5 space-y-4">
              {channels.map((c, i) => (
                <div key={c.name}>
                  <div className="flex justify-between text-[11.5px]">
                    <span className="text-[#c9cbe0]">{c.name}</span>
                    <span className="text-[#8a8da3]">{c.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-[6px] rounded-full bg-white/6">
                    <div className="h-full rounded-full" style={{ width: `${c.pct * 2.1}%`, background: `linear-gradient(90deg,#3882F6,${i % 2 ? "#8B5CF6" : "#6E74F7"})`, opacity: 1 - i * 0.15 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-white/8 bg-[#11132a] px-5 py-4">
          <div className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr] text-[10.5px] uppercase tracking-[0.14em] text-[#6f7290]">
            <span>Cliente</span><span>Plano</span><span>Valor</span><span>Status</span>
          </div>
          {rows.map((r) => (
            <div key={r[0]} className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr] border-t border-white/6 py-2.5 text-[12px]">
              <span>{r[0]}</span>
              <span className="text-[#c9cbe0]">{r[1]}</span>
              <span className="text-[#c9cbe0]">{r[2]}</span>
              <span className={r[3] === "Pago" ? "text-[#7fb2ff]" : "text-[#c4b5fd]"}>{r[3]}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
