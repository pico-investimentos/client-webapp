import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { Button, Card, Chip } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'

type PlaceholderPageProps = {
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
  plannedItems: string[]
}

export function PlaceholderPage({ eyebrow, title, description, icon: Icon, plannedItems }: PlaceholderPageProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
      className="mx-auto max-w-4xl"
    >
      <Chip variant="soft" color="success" size="sm">Fundação preparada</Chip>
      <div className="mt-5 flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#dcefe8] text-[#0f6b57]">
          <Icon size={23} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#287765]">{eyebrow}</p>
          <h1 className="mt-2 text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
        </div>
      </div>

      <Card className="surface-card mt-9 rounded-[24px] bg-white p-0">
        <Card.Header className="p-6 pb-0 sm:p-7 sm:pb-0">
          <Card.Title className="text-lg font-semibold tracking-[-0.02em]">Próximas entregas deste módulo</Card.Title>
          <Card.Description className="mt-1 text-sm text-slate-500">A rota, o layout e a navegação já estão disponíveis.</Card.Description>
        </Card.Header>
        <Card.Content className="p-6 sm:p-7">
          <ul className="grid gap-3 sm:grid-cols-2">
            {plannedItems.map((item) => (
              <li key={item} className="flex min-h-12 items-center gap-3 rounded-xl bg-[#f6f8f7] px-4 py-3 text-sm text-slate-700">
                <span className="size-1.5 shrink-0 rounded-full bg-[#3d8d79]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Card.Content>
      </Card>

      <Button variant="outline" className="mt-6 min-h-10 rounded-xl pl-4 pr-3.5" onPress={() => void navigate({ to: '/' })}>
        Voltar à visão geral
        <ArrowRight size={17} aria-hidden="true" />
      </Button>
    </motion.div>
  )
}
