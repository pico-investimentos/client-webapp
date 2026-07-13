import type { ReactNode } from 'react'
import { Modal, type useOverlayState } from '@heroui/react'

import {
  modalCustomBackdropClassName,
  modalFluidSlideContainerClassName,
} from '@/shared/ui/modal-presets'

type OverlayState = ReturnType<typeof useOverlayState>

type AppModalProps = {
  state: OverlayState
  children: ReactNode
  isDismissable?: boolean
  placement?: 'auto' | 'center' | 'top' | 'bottom'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'cover' | 'full'
}

/**
 * Standard Pico modal shell: HeroUI Custom Backdrop + Fluid Slide.
 */
export function AppModal({
  state,
  children,
  isDismissable = true,
  placement = 'center',
  size = 'md',
}: AppModalProps) {
  return (
    <Modal state={state}>
      <Modal.Backdrop
        variant="blur"
        className={modalCustomBackdropClassName}
        isDismissable={isDismissable}
      >
        <Modal.Container
          placement={placement}
          size={size}
          className={modalFluidSlideContainerClassName}
        >
          {children}
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

export { Modal }
