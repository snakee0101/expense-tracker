import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';
import { GrTransaction } from "react-icons/gr";
import { MdOutlineCategory } from "react-icons/md";
import { SlWallet } from "react-icons/sl";
import { RiBankCardFill } from "react-icons/ri";
import { MdOutlineSavings } from "react-icons/md";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { IoCalendarNumberOutline } from "react-icons/io5";


const mainNavItems: NavItem[] = [
    {
        title: 'Transactions',
        href: route('transaction.index'),
        icon: GrTransaction,
    },
    {
        title: 'Transaction Categories',
        href: route('transaction_category.index'),
        icon: MdOutlineCategory,
    },
    {
        title: 'Wallets',
        href: route('wallet.index'),
        icon: SlWallet,
    },
    {
        title: 'Cards',
        href: route('card.index'),
        icon: RiBankCardFill,
    },
    {
        title: 'Savings Plans',
        href: route('savings_plan.index'),
        icon: MdOutlineSavings,
    },
    {
        title: 'Transfers',
        href: route('transfer.index'),
        icon: FaMoneyBillTransfer,
    },
    {
        title: 'Recurring Payments',
        href: route('recurring_payment.index'),
        icon: IoCalendarNumberOutline,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="" prefetch>
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
