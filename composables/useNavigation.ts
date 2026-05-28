import type { NavItem } from '~/types/navigation'

export function useNavigation() {
  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'LayoutDashboard', to: '/dashboard' },
    { label: 'Sales Income', icon: 'TrendingUp', to: '/sales-income' },
    { label: 'Sales Tracker', icon: 'ShoppingCart', to: '/sales-tracker' },
    { label: 'Expense Tracker', icon: 'Wallet', to: '/expense-tracker' },
    { label: 'Management Users', icon: 'Users', to: '/management-users' },
  ]

  return { navItems }
}
