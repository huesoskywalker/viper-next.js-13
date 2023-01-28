"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AddComment({
    id,
    commentId,
    viperIdImage,
    viperIdName,
    bloggerIdName,
    commentReplies,
    rePosts,
    timestamp,
    commentCookie,
    rePostCookie,
    event,
    reply,
    blog,
    showComment,
}: {
    id: string | null
    commentId: string
    viperIdImage: string
    viperIdName: string
    bloggerIdName: string
    commentReplies: number | null
    rePosts: number
    timestamp: number
    commentCookie: string
    rePostCookie: string
    event: boolean
    reply: boolean
    blog: boolean
    showComment: string
}) {
    const [comment, setComment] = useState<string>("")
    const [openCommentInput, setOpenCommentInput] = useState<boolean>(false)
    const [pendingComment, setPendingComment] = useState<boolean>(false)
    const [isCommented, setIsCommented] = useState<string>(commentCookie)
    const [isRePosted, setIsRePosted] = useState<string>(rePostCookie)
    const [commentEffect, setCommentEffect] = useState<boolean>(false)
    const [isDisplayComment, setIsDisplayComment] = useState<boolean>(false)

    const [isPending, startTransition] = useTransition()

    const router = useRouter()

    const viper = useSession()
    const viperId = viper.data?.user.id
    const viperImage = viper.data?.user.image

    const submitComment = async (e: any) => {
        e.preventDefault()
        if (event && !reply && !blog) {
            const response = await fetch(`/api/comment`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    viperId: viperId,
                    comment: comment,
                }),
            })

            await response.json()
        } else if (!event && reply && !blog) {
            const response = await fetch(`/api/comment-comment`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    viperId: viperId,
                    commentId: commentId,
                    comment: comment,
                }),
            })

            await response.json()
        } else if (!event && !reply && !blog) {
            const response = await fetch(`/api/create-blog`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    viperId: viperId,
                    comment: comment,
                }),
            })
            await response.json()
        } else if (blog) {
            const response = await fetch(`/api/comment-blog`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    viperId: viperId,
                    commentId: commentId,
                    comment: comment,
                }),
            })
            await response.json()
        }
        startTransition(() => {
            // toggleComment()
            // setPendingComment(!pendingComment)
            setIsCommented(isCommented === "none" ? "blue" : "none")
            setPendingComment(false)
            setComment("")
            setOpenCommentInput(false)
            router.refresh()
        })
    }

    const writeComment = () => {
        setCommentEffect(!commentEffect)
        setPendingComment(true)
        setOpenCommentInput(!openCommentInput)
    }

    const displayComment = () => {
        setIsDisplayComment(!isDisplayComment)
    }

    const rePostBlog = async (e: any) => {
        e.preventDefault()

        const response = await fetch(`/api/re-post-blog`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                bloggerId: id,
                blogId: commentId,
                viperId: viperId,
            }),
        })
        // toggleComment()

        startTransition(() => {
            setIsRePosted(isRePosted === "none" ? "green" : "none")
            router.refresh()
        })
    }
    useEffect(() => {
        if (commentEffect) {
            document.cookie = `_${timestamp}_is_commented=${isCommented}; path=/profile; max-age=${
                60 * 60 * 24 * 30
            }}`
            setCommentEffect(!commentEffect)
        } else {
            document.cookie = `_${timestamp}_is_rePosted=${isRePosted}; path=/profile; max-age=${
                60 * 60 * 24 * 30
            }}`
        }
    }, [isCommented, isRePosted])

    return (
        <div>
            <div className="flex justify-start">
                {!event && !reply && !blog && id !== null ? (
                    <button
                        onClick={writeComment}
                        className="relative right-16 text-gray-300 bg-yellow-800/70 rounded-xl py-1 px-3 hover:bg-yellow-600/70"
                    >
                        Bloggie
                    </button>
                ) : !event && !reply && !blog && id === null ? null : blog ? (
                    <div className="flex justify-start space-x-4">
                        {reply ? (
                            <button
                                onClick={writeComment}
                                className="grid grid-cols-2 ml-1 text-gray-400 hover:text-blue-500/75"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className={`w-6 h-6  hover:text-blue-500/75 hover:animate-pulse ${
                                        isPending && pendingComment
                                            ? "text-blue-700"
                                            : `text-${isCommented}-700`
                                    }`}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                                    />
                                </svg>
                                <span className=" text-sm text-gray-400 flex justify-start self-end ml-2">
                                    {commentReplies}
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={displayComment}
                                className="grid grid-cols-2 ml-1 text-gray-400 hover:text-blue-500/75"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className={`w-6 h-6 text-gray-400 
                                    ${
                                        showComment !== undefined &&
                                        showComment !== ""
                                            ? "text-blue-700"
                                            : null
                                    } hover:text-blue-500/75 hover:animate-pulse ${
                                        isPending && pendingComment
                                            ? "text-blue-700"
                                            : `text-${isCommented}-700`
                                    }`}
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        )}
                        <button
                            onClick={rePostBlog}
                            className="grid grid-cols-2 ml-1 text-gray-400 hover:text-green-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className={`w-6 h-6 hover:text-green-700 hover:animate-pulse ${
                                    isPending && !pendingComment
                                        ? "text-green-700"
                                        : `text-${isRePosted}-700`
                                }`}
                                // className={"h-5 w-5 text-green-500"}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 4.5c1.215 0 2.417.055 3.604.162a.68.68 0 01.615.597c.124 1.038.208 2.088.25 3.15l-1.689-1.69a.75.75 0 00-1.06 1.061l2.999 3a.75.75 0 001.06 0l3.001-3a.75.75 0 10-1.06-1.06l-1.748 1.747a41.31 41.31 0 00-.264-3.386 2.18 2.18 0 00-1.97-1.913 41.512 41.512 0 00-7.477 0 2.18 2.18 0 00-1.969 1.913 41.16 41.16 0 00-.16 1.61.75.75 0 101.495.12c.041-.52.093-1.038.154-1.552a.68.68 0 01.615-.597A40.012 40.012 0 0110 4.5zM5.281 9.22a.75.75 0 00-1.06 0l-3.001 3a.75.75 0 101.06 1.06l1.748-1.747c.042 1.141.13 2.27.264 3.386a2.18 2.18 0 001.97 1.913 41.533 41.533 0 007.477 0 2.18 2.18 0 001.969-1.913c.064-.534.117-1.071.16-1.61a.75.75 0 10-1.495-.12c-.041.52-.093 1.037-.154 1.552a.68.68 0 01-.615.597 40.013 40.013 0 01-7.208 0 .68.68 0 01-.615-.597 39.785 39.785 0 01-.25-3.15l1.689 1.69a.75.75 0 001.06-1.061l-2.999-3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className=" text-sm text-gray-400 flex justify-start self-end ml-2">
                                {rePosts ?? "0"}
                            </span>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={writeComment}
                        className="grid grid-cols-2 ml-1 text-gray-400 hover:text-blue-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 "
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                            />
                        </svg>
                        <span className=" text-sm text-gray-400 flex justify-start self-end ml-2">
                            {commentReplies ?? "0"}
                        </span>
                    </button>
                )}
            </div>
            <div>
                {openCommentInput ? (
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex items-center min-h-screen px-4 py-8">
                            <div className="relative w-full max-w-lg p-4 mx-auto bg-gray-800 rounded-xl shadow-lg">
                                <div className="m-1 ">
                                    <button
                                        className="flex justify-start self-start mb-3 text-gray-300 hover:text-yellow-800"
                                        onClick={() =>
                                            setOpenCommentInput(false)
                                        }
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6 "
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                    <div className=" text-center sm:ml-4 sm:text-left">
                                        <div className="grid grid-cols-9">
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
                                                placeholder={
                                                    !event && !reply
                                                        ? "What's happening?"
                                                        : "Share your thoughts"
                                                }
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="items-center gap-2 mt-3 grid grid-cols-6 ">
                                            <button
                                                className="col-start-3 col-span-2 relative w-full items-center space-x-2 rounded-lg bg-gray-700 px-3 py-1  text-sm font-medium text-white hover:bg-vercel-blue/90 disabled:text-white/70"
                                                onClick={(e) =>
                                                    submitComment(e)
                                                }
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
                {isDisplayComment ? (
                    <div className="fixed inset-0 z-10 overflow-y-auto ">
                        <div className="flex items-center min-h-screen px-4 py-8">
                            <div className="relative w-full max-w-lg p-4 mx-auto bg-gray-800 rounded-xl shadow-lg">
                                <div className="m-1 ">
                                    <button
                                        className="flex justify-start self-start mb-3 text-gray-300 hover:text-yellow-800"
                                        onClick={() =>
                                            setIsDisplayComment(
                                                !isDisplayComment
                                            )
                                        }
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6 "
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                    <div className=" text-center sm:ml-4 sm:text-left">
                                        <div className="grid grid-cols-9">
                                            <div className="col-start-1 col-span-2 space-y-8">
                                                <Image
                                                    src={`/vipers/${viperIdImage}`}
                                                    alt={`/vipers/${viperIdImage}`}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full "
                                                />
                                                <span className="text-gray-300 text-sm">
                                                    {viperIdName}
                                                </span>
                                            </div>
                                            <div className="col-start-3 col-span-6 border-[1px] border-slate-600 rounded-xl bg-gray-700/50 p-2">
                                                <span className="text-gray-400 text-xs flex align-top">
                                                    Replying to:{" "}
                                                    <span className="text-blue-500/80 text-xs ml-[5px]">
                                                        {" "}
                                                        {bloggerIdName}
                                                    </span>
                                                </span>
                                                <span className=" flex justify-start text-gray-300 text-sm mx-2 mt-2 ">
                                                    {showComment}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="items-center gap-2 mt-3 grid grid-cols-6 "></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
