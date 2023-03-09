"use client"

import { useTransition } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function Follow({
    id,
    isFollowed,
    event,
}: {
    id: string
    isFollowed: boolean
    event: boolean
}) {
    const [isPending, startTransition] = useTransition()

    const router = useRouter()

    const { data: session } = useSession()
    const viperId = session?.user.id

    const follow = async () => {
        const response = await fetch(`/api/follow-viper`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                viperId: viperId,
                id: id,
            }),
        })

        await response.json()
        startTransition(() => {
            router.refresh()
        })
    }

    return (
        <div>
            {event ? (
                <button
                    className={
                        isFollowed
                            ? "flex w-28 items-center space-x-1 rounded-lg bg-yellow-800/70  hover:bg-red-600/70  px-3 py-1  text-sm font-medium text-gray-200 hover:text-white disabled:text-white/70"
                            : "flex w-28 items-center space-x-1 rounded-lg bg-yellow-800/70  hover:bg-yellow-600/70  px-3 py-1  text-sm font-medium text-gray-200 hover:text-white disabled:text-white/70"
                    }
                    onClick={follow}
                    disabled={isPending}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    <span></span>
                    {isFollowed ? <span>Following</span> : <span>Follow</span>}
                    {isPending ? (
                        <div className="absolute" role="status">
                            <div
                                className="
            h-4 w-4 animate-spin rounded-full border-[2.5px] border-white border-r-transparent"
                            />
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : null}
                </button>
            ) : null}
        </div>
    )
}
