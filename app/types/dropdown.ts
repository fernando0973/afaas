export interface DropdownItem {
  type: 'item' | 'divider'
  label?: string
  icon?: any
  action?: (() => void) | string
  variant?: 'default' | 'danger'
}

export interface DropdownPosition {
  top?: string
  bottom?: string
  left?: string
  right?: string
}

export interface DropdownProps {
  show: boolean
  items: DropdownItem[]
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'custom'
  customPosition?: DropdownPosition
  width?: 'sm' | 'md' | 'lg' | 'auto'
  triggerClass?: string
}