import b3LogoUrl from '@/shared/assets/b3-logo.png'

type B3LogoProps = {
  className?: string
  title?: string
}

/** Logo oficial da B3 para o indicador de conexão no header. */
export function B3Logo({ className, title = 'B3' }: B3LogoProps) {
  return (
    <img
      src={b3LogoUrl}
      alt={title}
      width={28}
      height={28}
      decoding="async"
      className={className}
    />
  )
}
