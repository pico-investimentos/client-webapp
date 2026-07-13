import { Shield } from 'lucide-react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
      className="mx-auto max-w-2xl"
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-[#dcefe8] text-[#0f6b57]">
        <Shield size={23} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#287765]">
        Privacidade
      </p>
      <h1 className="mt-2 text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
        Compartilhamento de dados com a B3
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600 sm:text-base">
        <p>
          Ao conectar sua carteira, você será encaminhado ao ambiente oficial da B3 para autorizar
          que a Pico Investimentos consulte informações de investimento vinculadas ao seu CPF.
        </p>
        <p>
          A Pico não recebe nem solicita a senha que você usa na B3. A autorização ocorre apenas na
          interface da B3; a Pico só marca a conta como conectada depois de confirmar o status junto
          à B3.
        </p>
        <p>
          Enquanto a confirmação não for concluída, o status na Pico permanece como autorização
          iniciada — o redirecionamento sozinho não prova que o compartilhamento foi autorizado.
        </p>
      </div>
      <Link
        to="/"
        className="mt-8 inline-flex min-h-10 items-center text-sm font-semibold text-[#0f6b57]"
      >
        Voltar ao início
      </Link>
    </motion.div>
  )
}
