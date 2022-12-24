"use client"
import { useSelectedLayoutSegment } from "next/navigation"
import { data, type Item } from "../lib/data"
import Link from "next/link"
import clsx from "clsx"

export default function GlobalNav() {
    return (
        <div className="fixed top-0 z-10 flex w-full flex-col border-b border-gray-800 bg-black lg:bottom-0 lg:z-auto lg:w-48 lg:border-r lg:border-gray-800">
            <div className="flex h-14 items-center py-4 px-4 lg:h-auto">
                <Link
                    href="/"
                    className="group flex w-full items-center space-x-2.5"
                    // onClick={close}
                >
                    <div className="h-7 w-7 rounded-full border border-white/30 group-hover:border-white/50">
                        {/* <ViperLogo /> */}
                    </div>

                    <h3 className="font-semibold tracking-wide text-gray-400 group-hover:text-gray-50">
                        Homie <span className="Work in progress">(VIP)</span>
                    </h3>
                </Link>
            </div>
            <div
                className="overflow-y-auto lg:static lg:block"
                // className={clsx('overflow-y-auto lg:static lg:block', {
                //   'fixed inset-x-0 bottom-0 top-14 mt-px bg-black': isOpen,
                //   hidden: !isOpen,
                // })}
            >
                <nav className="space-y-6 px-2 py-5">
                    {data.map((item) => (
                        <GlobalNavItem key={item.slug} item={item} />
                    ))}
                </nav>
            </div>
        </div>
    )
}

function GlobalNavItem({ item }: { item: Item }) {
    const segment = useSelectedLayoutSegment()
    const isActive = item.slug === segment
    console.log(isActive)

    return (
        <Link
            href={`/${item.slug}`}
            className={clsx(
                "block rounded-md px-3 py-2 text-sm font-medium hover:text-gray-300",
                {
                    "text-gray-400 hover:bg-gray-800": !isActive,
                    "text-white": isActive,
                }
            )}
        >
            {item.name}
        </Link>
    )
}
