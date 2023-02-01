"use client"

import { useTransition, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function Follow({ id, isFollowed }: { id: string; isFollowed: string }) {
    const [isPending, startTransition] = useTransition()
    // const [isFollow, setIsFollow] = useState<string>(followCookie)

    const router = useRouter()

    // const toggleFollow = () => {
    //     setIsFollow(isFollow === "Follow" ? "Following" : "Follow")
    // }

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
        // toggleFollow()
        startTransition(() => {
            router.refresh()
        })
    }

    // useEffect(() => {
    //     // document.cookie = `${id}_is_followed=${isFollow}; path=/${eventId}; max-age=${
    //     //     60 * 60 * 24 * 30
    //     // }}`
    //     document.cookie = `${id}_is_followed=${isFollow}; path=/dashboard/vipers/${id}; max-age=${
    //         60 * 60 * 24 * 30
    //     }}`
    // }, [isFollow])

    return (
        <div>
            <button
                className="flex w-28 items-center space-x-1 rounded-lg bg-yellow-800/70 hover:bg-yellow-600/70  px-3 py-1  text-sm font-medium text-white hover:bg-vercel-blue/90 disabled:text-white/70"
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
                {isFollowed === "true" ? "Following" : "Follow"}
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
        </div>
    )
}
