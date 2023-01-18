"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTransition, useState, useEffect } from "react"

export function AddLike({
    eventId,
    commentId,
    replyId,
    likes,
    event,
    reply,
    likedCookie,
}: {
    eventId: string
    commentId: string
    replyId: string
    likes: number
    event: boolean
    reply: boolean
    likedCookie: string
}) {
    const [isPending, startTransition] = useTransition()

    const [isLiked, setIsLiked] = useState<string>(likedCookie)

    const toggleLike = () => {
        if (event) {
            setIsLiked(isLiked === "none" ? "red" : "none")
        } else {
            setIsLiked(isLiked === "none" ? "yellow" : "none")
        }
    }

    const viper = useSession()
    const viperId = viper.data?.user.id

    const router = useRouter()

    const likeEvent = async (e: any) => {
        e.preventDefault()
        if (event && !reply) {
            const response = await fetch(`/api/like-event`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    id: eventId,
                    viperId: viperId,
                }),
            })

            await response.json()
        } else if (!event && !reply) {
            const response = await fetch(`/api/like-comment`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    id: eventId,
                    commentId: commentId,
                    // comment: comment,
                    viperId: viperId,
                }),
            })

            await response.json()
        } else if (!event && reply) {
            const response = await fetch(`/api/like-reply`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    eventId: eventId,
                    commentId: commentId,
                    replyId: replyId,
                    // comment: comment,
                    viperId: viperId,
                }),
            })
        }

        toggleLike()
        startTransition(() => {
            router.refresh()
        })
    }

    useEffect(() => {
        if (event && !reply) {
            document.cookie = `_is_liked=${isLiked}; path=/${eventId}; max-age=${
                60 * 60 * 24 * 30
            }}`
        } else if (!event && !reply) {
            document.cookie = `_${commentId}_is_liked=${isLiked}; path=/${eventId}; max-age=${
                60 * 60 * 24 * 30
            }}`
        } else if (!event && reply) {
            document.cookie = `_${replyId}_is_liked=${isLiked}; path=/${eventId}; max-age=${
                60 * 60 * 24 * 30
            }}`
        }
    }, [isLiked])

    return (
        <div className="flex justify-start">
            <button
                onClick={(e) => likeEvent(e)}
                className="grid grid-cols-2 ml-1 "
            >
                {event ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={` ${isPending ? "rgb(64,0,0)" : likedCookie}`}
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-6 h-6 hover:text-red-700 hover:animate-pulse ${
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
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={` ${isPending ? "rgb(64,0,0)" : isLiked}`}
                        fillOpacity="0.77"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className={`w-6 h-6 mt-1 text-gray-400 hover:text-yellow-900 ${
                            isPending
                                ? "text-yellow-600"
                                : `text-${isLiked}-700`
                        }`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                        />
                    </svg>
                )}
                <span className=" text-sm text-gray-400 flex justify-start self-end ml-2">
                    {likes ?? "0"}
                </span>
            </button>
        </div>
    )
}
