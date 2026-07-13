/**
 * HeroUI Modal preset for Pico frontend apps:
 * Custom Backdrop (blur + gradient) + Fluid Slide animation.
 * @see https://heroui.com/en/docs/react/components/modal#custom-backdrop
 * @see https://heroui.com/en/docs/react/components/modal#custom-animations
 */

export const modalCustomBackdropClassName = [
  'bg-linear-to-t from-black/80 via-black/40 to-transparent',
  'data-[entering]:duration-500',
  'data-[entering]:ease-[cubic-bezier(0.25,1,0.5,1)]',
  'data-[exiting]:duration-200',
  'data-[exiting]:ease-[cubic-bezier(0.5,0,0.75,0)]',
].join(' ')

export const modalFluidSlideContainerClassName = [
  'data-[entering]:animate-in',
  'data-[entering]:fade-in-0',
  'data-[entering]:slide-in-from-bottom-4',
  'data-[entering]:duration-500',
  'data-[entering]:ease-[cubic-bezier(0.25,1,0.5,1)]',
  'data-[exiting]:animate-out',
  'data-[exiting]:fade-out-0',
  'data-[exiting]:slide-out-to-bottom-2',
  'data-[exiting]:duration-200',
  'data-[exiting]:ease-[cubic-bezier(0.5,0,0.75,0)]',
].join(' ')
