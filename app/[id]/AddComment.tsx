"use client"

import { useSession } from "next-auth/react"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AddComment({
    id,
    comments,
}: {
    id: string
    comments: number
}) {
    const [comment, setComment] = useState<string>("")
    const [openComment, setOpenComment] = useState<boolean>(false)
    const [isPending, startTransition] = useTransition()

    const router = useRouter()

    const viper = useSession()
    const viperId = viper.data?.user.id
    const viperImage = viper.data?.user.image

    const submitComment = async (e: any) => {
        e.preventDefault()

        const response = await fetch(`/api/comment`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                viperId,
                comment: comment,
            }),
        })

        await response.json()
        startTransition(() => {
            setComment("")
            showComments()
            router.refresh()
        })
    }

    const showComments = () => {
        setOpenComment(!openComment)
    }

    return (
        <div>
            <div className="flex justify-start mt-4">
                <button onClick={showComments} className="grid grid-cols-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 hover:text-green-700"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                        />
                    </svg>
                    <h1 className=" text-sm text-gray-400 pb-2 flex justify-start ml-2 align-baseline">
                        {comments}
                    </h1>
                </button>
            </div>
            {openComment ? (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    {/* <div
                        className="fixed inset-0 w-full h-full bg-black opacity-40"
                        onClick={() => setOpenComment(false)}
                    ></div> */}
                    <div className="flex items-center min-h-screen px-4 py-8">
                        <div className="relative w-full max-w-lg p-4 mx-auto bg-gray-800 rounded-xl shadow-lg">
                            <div className="m-1 ">
                                <button
                                    className="flex justify-start self-start mb-3"
                                    // className="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                                    onClick={() => setOpenComment(false)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                                <div className=" text-center sm:ml-4 sm:text-left">
                                    {/* <h4 className="text-lg font-medium text-gray-800">
                                        Comment the event:
                                    </h4> */}
                                    <div className="grid grid-cols-9">
                                        {/* <label htmlFor="comment">
                                            Add a comment:
                                        </label> */}
                                        <Image
                                            src={`/vipers/${viperImage}`}
                                            alt={`/vipers/${viperImage}`}
                                            width={50}
                                            height={50}
                                            className="rounded-full col-start-1 "
                                        />
                                        <textarea
                                            className="cols-start-2 col-span-8 p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={comment}
                                            onChange={(e) =>
                                                setComment(e.target.value)
                                            }
                                            rows={2}
                                            placeholder={"Comment the event"}
                                            required
                                        ></textarea>
                                    </div>
                                    {/* <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna
                                        aliqua.
                                    </p> */}
                                    <div className="items-center gap-2 mt-3 grid grid-cols-6 ">
                                        <button
                                            className="col-start-3 col-span-2 relative w-full items-center space-x-2 rounded-lg bg-gray-700 px-3 py-1  text-sm font-medium text-white hover:bg-vercel-blue/90 disabled:text-white/70"
                                            onClick={(e) => submitComment(e)}
                                        >
                                            Comment
                                            {isPending ? (
                                                <div
                                                    className="absolute right-2 top-1.5"
                                                    role="status"
                                                >
                                                    <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
                                                    {/* <span className="sr-only">
                                                        Loading...
                                                    </span> */}
                                                </div>
                                            ) : null}
                                        </button>
                                        {/* <button
                                            className="flex justify-end self-end"
                                            // className="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                                            onClick={() =>
                                                setOpenComment(false)
                                            }
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
