import type { NavItem } from '~/types/navigation'

export function useNavigation() {
  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'layout-dashboard', to: '/dashboard' },
    { label: 'Sales Income', icon: 'trending-up', to: '/sales-income' },
    { label: 'Sales Tracker', icon: 'shopping-cart', to: '/sales-tracker' },
    { label: 'Expense Tracker', icon: 'wallet', to: '/expense-tracker' },
    { label: 'Stores', icon: 'store', to: '/management-stores' },
  ]

  return { navItems }
}
