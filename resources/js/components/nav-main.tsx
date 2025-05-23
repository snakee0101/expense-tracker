import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

function stripDomain(url) {
    const urlParts = new URL(url);
    return urlParts.pathname + urlParts.search + urlParts.hash;
}

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild isActive={stripDomain(item.href) == page.url}
                            tooltip={{ children: item.title }}
                            size='lg'
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span className='text-lg'>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
    );
}
