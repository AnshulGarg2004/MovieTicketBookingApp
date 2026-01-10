'use client'
import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const AdminSidebar = () => {

    const pathname = usePathname();

    const user = {
        name: "Admin",
        lastName: "User",
        image: ""
    }

    const adminNavLinks = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboardIcon
        },
        {
            name: "Add Shows",
            path: "/admin/addShows",
            icon: PlusSquareIcon
        },
        {
            name: "List shows",
            path: "/admin/listShows",
            icon: ListIcon
        },
        {
            name: "List Bookings",
            path: "/admin/listBookings",
            icon: ListCollapseIcon
        }
    ]
    return (
        <aside className="h-[calc(100vh-64px)] flex flex-col items-center w-60 pt-8 border-r border-gray-300/20 text-sm">
            {/* User */}
            <Image
                src={user.image || "/placeholder-avatar.png"}
                alt={user.name ? `${user.name} ${user.lastName}` : "Admin user"}
                width={56}
                height={56}
                className="rounded-full"
            />
            <p className="mt-2 text-base hidden md:block">
                {user.name} {user.lastName}
            </p>

            {/* Nav */}
            <div className="w-full mt-6">
                {adminNavLinks.map((link, idx) => {
                    const isActive = pathname === link.path
                    const Icon = link.icon

                    return (
                        <Link
                            key={idx}
                            href={link.path}
                            className={`relative flex items-center gap-3 py-2.5 px-6 text-gray-400 transition
                ${isActive ? 'bg-rose-400/20 text-white' : 'hover:bg-gray-800'}
              `}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="hidden md:block">{link.name}</span>

                            {isActive && (
                                <span className="absolute right-0 h-10 w-1.5 bg-rose-600 rounded-l" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </aside>
    )
}

export default AdminSidebar
