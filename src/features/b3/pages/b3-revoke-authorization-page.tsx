import { useState } from 'react'
import { Button } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

import { B3RevokeAuthorizationModal } from '@/features/b3/components/b3-revoke-authorization-modal'
import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import { useB3Connection } from '@/features/b3/hooks/use-b3-connection'

export function B3RevokeAuthorizationPage() {
  const currentUser = useCurrentUser()
  const connection = useB3Connection(Boolean(currentUser.data))
  const [isModalOpen, setIsModalOpen] = useState(false)

  const status = connection.data?.status
  const canRevoke = status === 'AUTHORIZED' || status === 'AUTHORIZATION_REQUESTED'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
      className="mx-auto max-w-2xl"
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-[#dcefe8] text-[#0f6b57]">
        <ShieldCheck size={23} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#287765]">
        Segurança Pico + B3
      </p>
      <h1 className="mt-2 text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
        Como protegemos seus dados — e como revogar, se quiser
      </h1>

      <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600 sm:text-base">
        <p>
          A Pico Investimentos só consulta informações da sua carteira depois que você autoriza na
          B3. Essa autorização acontece no ambiente oficial da B3 — a Pico nunca pede nem armazena a
          senha que você usa lá.
        </p>
        <p>
          No nosso lado, usamos sessão segura (cookie HttpOnly), validamos sua identidade na API e
          só marcamos a conta como autorizada depois de confirmar o status diretamente com a B3.
          Credenciais técnicas da integração ficam apenas no servidor, nunca no navegador.
        </p>
      </div>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
          Por que vale a pena manter a autorização
        </h2>
        <ul className="space-y-3 text-sm leading-6 text-slate-600 sm:text-base">
          <li className="flex gap-3">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-[#0f6b57]" aria-hidden="true" />
            <span>
              Visão consolidada da carteira sem planilhas manuais — a Pico acompanha posições com
              base nos dados oficiais da B3.
            </span>
          </li>
          <li className="flex gap-3">
            <LockKeyhole className="mt-0.5 size-5 shrink-0 text-[#0f6b57]" aria-hidden="true" />
            <span>
              Você continua no controle: a autorização pode ser revogada a qualquer momento, e a
              Pico exige a senha da sua conta Pico antes de concluir o opt-out.
            </span>
          </li>
          <li className="flex gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#0f6b57]" aria-hidden="true" />
            <span>
              Menos fricção no dia a dia: com a autorização ativa, atualizações de status e
              próximos serviços de sincronização ficam disponíveis sem refazer o opt-in.
            </span>
          </li>
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
          Quer revogar mesmo assim?
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          Para revogar o acesso da Pico aos seus dados na B3, clique no botão abaixo. Vamos pedir
          sua senha da plataforma Pico e, se estiver correta, enviaremos o opt-out à B3 e
          atualizaremos seu status para revogado.
        </p>

        {!currentUser.data ? (
          <p className="mt-4 text-sm text-slate-600" role="status">
            Faça login para revogar a autorização.
          </p>
        ) : status === 'REVOKED' ? (
          <p className="mt-4 text-sm font-medium text-orange-700" role="status">
            Sua autorização já está revogada. Você pode reconectar pelo ícone B3 no topo.
          </p>
        ) : !canRevoke ? (
          <p className="mt-4 text-sm text-slate-600" role="status">
            Não há autorização ativa para revogar neste momento.
          </p>
        ) : (
          <Button
            type="button"
            variant="primary"
            className="mt-5 min-h-11 w-full rounded-xl bg-red-700 text-white sm:w-auto"
            onPress={() => setIsModalOpen(true)}
          >
            Revogar autorização na B3
          </Button>
        )}
      </section>

      <Link
        to="/"
        className="mt-8 inline-flex min-h-10 items-center text-sm font-semibold text-[#0f6b57]"
      >
        Voltar ao início
      </Link>

      <B3RevokeAuthorizationModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </motion.div>
  )
}
