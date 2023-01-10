"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTransition, useState, useEffect } from "react"

export function AddLike({
    id,
    likes,
    likedCookie,
}: {
    id: string
    likes: number
    likedCookie: string
}) {
    const [isPending, startTransition] = useTransition()

    const [isLiked, setIsLiked] = useState<string>(likedCookie)

    const toggleLike = () => {
        setIsLiked(isLiked === "none" ? "red" : "none")
    }

    const viper = useSession()
    const viperId = viper.data?.user.id

    const router = useRouter()

    const likeEvent = async (e: any) => {
        e.preventDefault()

        const response = await fetch(`/api/like`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                viperId: viperId,
            }),
        })

        await response.json()

        toggleLike()
        startTransition(() => {
            router.refresh()
        })
    }
    useEffect(() => {
        document.cookie = `_is_liked=${isLiked}; path=/${id}; max-age=${
            60 * 60 * 24 * 30
        }}`
    }, [isLiked])

    return (
        <div>
            {/* <EventContext.Provider value={{ isLiked, toggleLike }}> */}
            <div className="flex justify-start ">
                <button
                    onClick={(e) => likeEvent(e)}
                    className="grid grid-cols-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={` ${isPending ? "rgb(64,0,0)" : likedCookie}`}
                        // fill={` ${likedCookie}`}
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-6 h-6 hover:text-red-700 ${
                            isPending
                                ? "text-red-700"
                                : `text-${likedCookie}-700`
                        }`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                    </svg>

                    <h1 className=" text-sm text-gray-400 pb-2 flex justify-start ml-2 align-baseline">
                        {likes}
                    </h1>
                </button>
            </div>
            {/* </EventContext.Provider> */}
        </div>
    )
}
