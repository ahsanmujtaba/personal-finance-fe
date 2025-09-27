import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DashboardStatsCards } from './components/dashboard-stats-cards'
import { RecentTransactions } from './components/recent-transactions'
import { TopSpendingCategories } from './components/top-spending-categories'
import { ActiveBudgets } from './components/active-budgets'
import { useDashboard } from '@/hooks/use-dashboard'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Download } from 'lucide-react'

export function Dashboard() {
  const { dashboardData, isLoading, error } = useDashboard()

  // Show alert for API issues but don't block the UI
  const showApiWarning = error && dashboardData
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main fluid={true}>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        
        {showApiWarning && (
          <Alert className='mb-6'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              API unavailable - showing cached data. Some information may be outdated.
            </AlertDescription>
          </Alert>
        )}

        {/* Dashboard Content */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <DashboardStatsCards 
            dashboardData={dashboardData}
            isLoading={isLoading}
          />
          
          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Recent Transactions - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <RecentTransactions 
                dashboardData={dashboardData}
                isLoading={isLoading}
              />
            </div>
            
            {/* Top Spending Categories */}
            <div>
              <TopSpendingCategories 
                dashboardData={dashboardData}
                isLoading={isLoading}
              />
            </div>
          </div>
          
          {/* Active Budgets - Full width */}
          <ActiveBudgets 
            dashboardData={dashboardData}
            isLoading={isLoading}
          />
        </div>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: '/',
    isActive: true,
    disabled: false,
  }
]
