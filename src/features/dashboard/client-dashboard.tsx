import type { LucideIcon } from 'lucide-react'
import type { Variants } from 'motion/react'
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  FileCheck2,
  Landmark,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from 'lucide-react'
import { Button, Card, Chip, Label, ProgressBar } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'

import { formatCurrency, formatPercent } from '@/shared/lib/formatters'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.2, 0, 0, 1] },
  },
}

const allocation = [
  { label: 'Renda fixa', value: 46, color: 'success' as const },
  { label: 'Fundos', value: 28, color: 'accent' as const },
  { label: 'Renda variável', value: 18, color: 'warning' as const },
  { label: 'Liquidez', value: 8, color: 'default' as const },
]

const documents = [
  { title: 'Informe mensal — junho', detail: 'Disponível para download', icon: FileCheck2 },
  { title: 'Boleto de mensalidade', detail: 'Vencimento em 15 de julho', icon: ReceiptText },
]

type MetricCardProps = {
  label: string
  value: string
  detail: string
  icon: LucideIcon
}

function MetricCard({ label, value, detail, icon: Icon }: MetricCardProps) {
  return (
    <Card className="surface-card rounded-[20px] bg-white p-0">
      <Card.Content className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-xl font-semibold tracking-[-0.025em] text-slate-950 tabular-nums">{value}</p>
            <p className="mt-1.5 text-xs leading-5 text-slate-500">{detail}</p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e7f2ee] text-[#176b58]">
            <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
          </span>
        </div>
      </Card.Content>
    </Card>
  )
}

export function ClientDashboard() {
  const navigate = useNavigate()

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mx-auto max-w-[1240px]">
      <motion.header variants={itemVariants} className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#287765]">Sexta-feira, 10 de julho</p>
            <Chip variant="soft" color="success" size="sm">Dados demonstrativos</Chip>
          </div>
          <h1 className="mt-3 text-balance text-[2rem] font-semibold leading-tight tracking-[-0.045em] text-slate-950 sm:text-[2.5rem]">Bom dia, Luis.</h1>
          <p className="mt-2 text-pretty text-sm leading-6 text-slate-600 sm:text-base">Acompanhe sua posição consolidada e as últimas movimentações da conta.</p>
        </div>
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck size={16} className="text-[#287765]" aria-hidden="true" />
          Ambiente protegido
        </p>
      </motion.header>

      <motion.section variants={itemVariants} aria-labelledby="patrimonio-title" className="mt-8">
        <Card className="surface-card overflow-hidden rounded-[28px] bg-[#103f35] p-0 text-white">
          <Card.Content className="relative p-6 sm:p-8">
            <div className="portfolio-glow" aria-hidden="true" />
            <div className="relative z-10 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
              <div>
                <p id="patrimonio-title" className="text-sm font-medium text-white/65">Patrimônio total</p>
                <p className="mt-3 text-balance text-4xl font-semibold tracking-[-0.045em] text-white tabular-nums sm:text-5xl">{formatCurrency(486240.7)}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-300/15 px-2.5 py-1 text-xs font-semibold text-emerald-100">
                    <ArrowUpRight size={14} aria-hidden="true" />
                    {formatPercent(0.024)} no mês
                  </span>
                  <span className="text-xs text-white/55">Atualizado hoje às 09:42</span>
                </div>
              </div>
              <Button
                variant="secondary"
                className="min-h-11 rounded-xl bg-white px-4 text-[#103f35] shadow-none"
                onPress={() => void navigate({ to: '/portfolio' })}
              >
                Ver carteira
                <ArrowRight size={17} aria-hidden="true" />
              </Button>
            </div>
          </Card.Content>
        </Card>
      </motion.section>

      <motion.section variants={itemVariants} aria-label="Resumo da conta" className="mt-4 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Valor aplicado" value={formatCurrency(472890.2)} detail="97,3% do patrimônio" icon={Landmark} />
        <MetricCard label="Saldo disponível" value={formatCurrency(13350.5)} detail="Disponível para movimentação" icon={WalletCards} />
        <MetricCard label="Rendimento no mês" value={formatCurrency(11402.8)} detail="Posição líquida estimada" icon={Sparkles} />
      </motion.section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.section variants={itemVariants} aria-labelledby="allocation-title">
          <Card className="surface-card h-full rounded-[24px] bg-white p-0">
            <Card.Header className="flex-row items-start justify-between p-6 pb-0 sm:p-7 sm:pb-0">
              <div>
                <Card.Title id="allocation-title" className="text-lg font-semibold tracking-[-0.025em] text-slate-950">Distribuição da carteira</Card.Title>
                <Card.Description className="mt-1 text-sm text-slate-500">Alocação por classe de ativo</Card.Description>
              </div>
              <Button isIconOnly variant="ghost" aria-label="Abrir carteira" className="min-h-10 min-w-10 rounded-xl" onPress={() => void navigate({ to: '/portfolio' })}>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Button>
            </Card.Header>
            <Card.Content className="space-y-5 p-6 sm:p-7">
              {allocation.map((item) => (
                <ProgressBar key={item.label} value={item.value} color={item.color} size="sm" className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2">
                  <Label className="text-sm font-medium text-slate-700">{item.label}</Label>
                  <ProgressBar.Output className="text-sm font-semibold text-slate-700 tabular-nums" />
                  <ProgressBar.Track className="col-span-2 h-2 rounded-full bg-slate-100">
                    <ProgressBar.Fill className="rounded-full" />
                  </ProgressBar.Track>
                </ProgressBar>
              ))}
            </Card.Content>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants} aria-labelledby="documents-title">
          <Card className="surface-card h-full rounded-[24px] bg-white p-0">
            <Card.Header className="flex-row items-start justify-between p-6 pb-0 sm:p-7 sm:pb-0">
              <div>
                <Card.Title id="documents-title" className="text-lg font-semibold tracking-[-0.025em] text-slate-950">Documentos recentes</Card.Title>
                <Card.Description className="mt-1 text-sm text-slate-500">Arquivos e cobranças da sua conta</Card.Description>
              </div>
              <Button isIconOnly variant="ghost" aria-label="Abrir documentos" className="min-h-10 min-w-10 rounded-xl" onPress={() => void navigate({ to: '/documents' })}>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Button>
            </Card.Header>
            <Card.Content className="p-4 pt-5 sm:p-5 sm:pt-6">
              <div className="divide-y divide-slate-900/[0.06]">
                {documents.map(({ title, detail, icon: Icon }) => (
                  <button key={title} type="button" className="document-row" onClick={() => void navigate({ to: '/documents' })}>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3f0] text-[#287765]">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block truncate text-sm font-semibold text-slate-800">{title}</span>
                      <span className="mt-1 block text-xs text-slate-500">{detail}</span>
                    </span>
                    <ArrowDownToLine size={17} className="shrink-0 text-slate-400" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </Card.Content>
          </Card>
        </motion.section>
      </div>

      <motion.section variants={itemVariants} aria-labelledby="recommendation-title" className="mt-4">
        <Card className="surface-card overflow-hidden rounded-[24px] bg-[#e4f1ec] p-0">
          <Card.Content className="flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0f6b57] shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                <CalendarClock size={20} aria-hidden="true" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 id="recommendation-title" className="text-lg font-semibold tracking-[-0.025em] text-slate-950">Nova recomendação disponível</h2>
                  <Chip variant="soft" color="success" size="sm">Hoje</Chip>
                </div>
                <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-6 text-slate-600">Seu assessor preparou uma revisão de alocação considerando seus objetivos e perfil atual.</p>
              </div>
            </div>
            <Button variant="primary" className="min-h-10 shrink-0 rounded-xl bg-[#0f6b57] pl-4 pr-3.5 text-white" onPress={() => void navigate({ to: '/documents' })}>
              Revisar recomendação
              <ArrowRight size={17} aria-hidden="true" />
            </Button>
          </Card.Content>
        </Card>
      </motion.section>

      <motion.p variants={itemVariants} className="mt-6 text-pretty text-xs leading-5 text-slate-500">
        Valores meramente ilustrativos nesta fundação. Rentabilidade passada não representa garantia de resultados futuros.
      </motion.p>
    </motion.div>
  )
}
