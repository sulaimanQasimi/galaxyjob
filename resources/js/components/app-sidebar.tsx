import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import {
    Bell,
    Briefcase,
    Building2,
    CreditCard,
    FileText,
    FolderOpen,
    Heart,
    LayoutGrid,
    ListChecks,
    MapPin,
    Package,
    Tags,
    UserCircle,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const role = auth?.user?.role;

    const mainNavItems: NavItem[] =
        role === 'admin'
            ? [
                  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
                  { title: 'Users', href: '/admin/users', icon: Users },
                  { title: 'Companies', href: '/admin/companies', icon: Building2 },
                  { title: 'Jobs', href: '/admin/jobs', icon: Briefcase },
                  { title: 'Categories', href: '/admin/categories', icon: Tags },
                  { title: 'Locations', href: '/admin/locations', icon: MapPin },
                  { title: 'Applications', href: '/admin/applications', icon: FileText },
                  { title: 'Packages', href: '/admin/packages', icon: Package },
                  { title: 'Payments', href: '/admin/payments', icon: CreditCard },
              ]
            : role === 'employer'
              ? [
                    { title: 'Dashboard', href: '/employer/dashboard', icon: LayoutGrid },
                    { title: 'Company', href: '/employer/company/edit', icon: Building2 },
                    { title: 'Jobs', href: '/employer/jobs', icon: Briefcase },
                    { title: 'Post Job', href: '/employer/jobs/create', icon: FolderOpen },
                ]
              : [
                    { title: 'Dashboard', href: '/employee/dashboard', icon: LayoutGrid },
                    { title: 'Profile', href: '/employee/profile/edit', icon: UserCircle },
                    { title: 'Applications', href: '/employee/applications', icon: ListChecks },
                    { title: 'Saved Jobs', href: '/employee/saved-jobs', icon: Heart },
                    { title: 'Job Alerts', href: '/employee/job-alerts', icon: Bell },
                ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={[{ title: 'Public jobs', href: '/jobs', icon: Briefcase }]} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
