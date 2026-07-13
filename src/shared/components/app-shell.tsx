import type { PropsWithChildren, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  CircleUserRound,
  FileText,
  HandHelping,
  House,
  WalletCards,
} from 'lucide-react'
import { Button } from '@heroui/react'
import { Link, useRouterState } from '@tanstack/react-router'

import { BrandMark } from '@/shared/components/brand-mark'

type AppPath = '/' | '/portfolio' | '/documents' | '/services' | '/profile'

type NavigationItem = {
  label: string
  shortLabel: string
  to: AppPath
  icon: LucideIcon
}

type AppShellProps = PropsWithChildren<{
  headerAccessory?: ReactNode
  banner?: ReactNode
}>

const navigationItems: NavigationItem[] = [
  { label: 'Visão geral', shortLabel: 'Início', to: '/', icon: House },
  { label: 'Minha carteira', shortLabel: 'Carteira', to: '/portfolio', icon: WalletCards },
  { label: 'Documentos', shortLabel: 'Docs', to: '/documents', icon: FileText },
  { label: 'Serviços', shortLabel: 'Serviços', to: '/services', icon: HandHelping },
  { label: 'Meu perfil', shortLabel: 'Perfil', to: '/profile', icon: CircleUserRound },
]

function AppNavigationLink({ item, mobile = false }: { item: NavigationItem; mobile?: boolean }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isActive = pathname === item.to
  const Icon = item.icon

  return (
    <Link
      to={item.to}
      preload="intent"
      aria-current={isActive ? 'page' : undefined}
      className={
        mobile
          ? `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`
          : `sidebar-nav-link ${isActive ? 'sidebar-nav-link-active' : ''}`
      }
    >
      <Icon size={mobile ? 19 : 18} strokeWidth={isActive ? 2.2 : 1.8} aria-hidden="true" />
      <span>{mobile ? item.shortLabel : item.label}</span>
    </Link>
  )
}

export function AppShell({ children, headerAccessory, banner }: AppShellProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  if (pathname === '/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-dvh bg-[#f4f7f5] text-slate-950">
      <div className="sticky top-0 z-40">
        <header className="border-b border-slate-900/6 bg-[#f4f7f5]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <BrandMark />

            <div className="flex items-center gap-2 sm:gap-3">
              {headerAccessory}
              <Button
                isIconOnly
                variant="ghost"
                aria-label="Abrir notificações"
                className="min-h-10 min-w-10 rounded-xl text-slate-600"
              >
                <Bell size={19} strokeWidth={1.8} aria-hidden="true" />
              </Button>
              <div className="hidden h-9 w-px bg-slate-900/8 sm:block" aria-hidden="true" />
              <Link to="/profile" className="user-summary" aria-label="Abrir menu da conta">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#d9eee7] text-sm font-semibold text-[#155f4f]">
                  LF
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-semibold leading-tight text-slate-900">
                    Luis Fernando
                  </span>
                  <span className="mt-0.5 block text-xs leading-tight text-slate-500">
                    Conta individual
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </header>
        {banner}
      </div>

      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-[72px] hidden h-[calc(100dvh-72px)] w-[256px] shrink-0 flex-col px-6 py-8 lg:flex">
          <nav aria-label="Navegação principal" className="flex flex-col gap-1.5">
            {navigationItems.map((item) => (
              <AppNavigationLink key={item.to} item={item} />
            ))}
          </nav>

          <div className="mt-auto rounded-2xl bg-[#e7f1ed] p-4 shadow-[inset_0_0_0_1px_rgba(15,107,87,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#287765]">
              Precisa de ajuda?
            </p>
            <p className="mt-2 text-sm leading-5 text-slate-600">
              Fale com seu assessor pelo canal seguro da plataforma.
            </p>
            <Link
              to="/services"
              className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-[#0f6b57]"
            >
              Acessar atendimento
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-28 pt-7 sm:px-6 sm:pt-9 lg:px-8 lg:pb-12 xl:px-10">
          {children}
        </main>
      </div>

      <nav aria-label="Navegação principal" className="mobile-nav lg:hidden">
        {navigationItems.map((item) => (
          <AppNavigationLink key={item.to} item={item} mobile />
        ))}
      </nav>
    </div>
  )
}
