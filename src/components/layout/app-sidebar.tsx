import { useLayout } from '@/context/layout-provider'
import { useAuth } from '@/hooks/use-auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { HeaderLogo } from './header-logo'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { user } = useAuth()
  
  // Create reactive userData object that updates when user state changes
  const userData = {
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    avatar: user?.avatar || '/avatars/shadcn.jpg',
  }
  
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <HeaderLogo teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
