"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { firstLogin } from "../lib/utils"

export default function AddComment({
    id,
    commentId,
    viperIdImage,
    viperIdName,
    bloggerIdName,
    commentReplies,
    timestamp,
    commentCookie,
    event,
    reply,
    blog,
    showComment,
}: {
    id: string | null
    commentId: string | null
    viperIdImage: string | undefined
    viperIdName: string | undefined
    bloggerIdName: string | undefined
    commentReplies: number | null
    timestamp: number | null
    commentCookie: string | "none"
    event: boolean
    reply: boolean
    blog: boolean
    showComment: string | undefined
}) {
    const [comment, setComment] = useState<string>("")
    const [openCommentInput, setOpenCommentInput] = useState<boolean>(false)
    const [pendingComment, setPendingComment] = useState<boolean>(false)
    const [isCommented, setIsCommented] = useState<string>(commentCookie)
    const [isDisplayComment, setIsDisplayComment] = useState<boolean>(false)

    const [isPending, startTransition] = useTransition()

    const router = useRouter()

    const viper = useSession()
    const viperId = viper.data?.user.id
    const viperImage = viper.data?.user.image

    const submitComment = async (e: any): Promise<void> => {
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
        setIsCommented(isCommented === "none" ? "blue" : "none")
        startTransition(() => {
            setPendingComment(false)
            setComment("")
            setOpenCommentInput(false)
            router.refresh()
        })
    }

    const writeComment = (): void => {
        setPendingComment(true)
        setOpenCommentInput(!openCommentInput)
    }

    const displayComment = (): void => {
        setIsDisplayComment(!isDisplayComment)
    }

    useEffect(() => {
        document.cookie = `_${timestamp}_is_commented=${isCommented}; path=/profile; max-age=${
            60 * 60 * 24 * 30
        }}`
    }, [isCommented])

    return (
        <div>
            <div className="flex justify-start">
                {!event && !reply && !blog && id !== null ? (
                    <button
                        onClick={writeComment}
                        className="relative right-16 text-gray-300 bg-yellow-800/70 rounded-xl py-1 px-3 hover:bg-yellow-600/70"
                    >
                        Let's Blog
                    </button>
                ) : !event && !reply && !blog && id === null ? null : blog ? (
                    <div className="flex justify-start space-x-4">
                        {blog && !reply ? (
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
                                    className={`w-6 h-6 hover:animate-pulse ${
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
                        ) : showComment ? (
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
                                    } hover:animate-pulse ${
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
                                <span className=" text-sm text-gray-400 flex justify-start self-end ml-2">
                                    {commentReplies ?? "0"}
                                </span>
                            </button>
                        ) : (
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
                                    className={`w-6 h-6 hover:animate-pulse ${
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
                                    {commentReplies ?? "0"}
                                </span>
                            </button>
                        )}
                    </div>
                ) : event ? (
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
                        <span className=" text-xs text-gray-400 flex justify-start self-end ml-2">
                            {commentReplies ?? "0"}
                        </span>
                    </button>
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
                            className="w-5 h-5 "
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                            />
                        </svg>
                        <span className=" text-xs text-gray-400 flex justify-start self-end ml-2">
                            {commentReplies ?? "0"}
                        </span>
                    </button>
                )}
            </div>
            <div>
                {openCommentInput ? (
                    <div className="fixed  inset-0 z-30 overflow-x-auto ">
                        <div className="flex items-center min-h-screen px-4 py-4">
                            <div className="relative w-full max-w-md p-4  mx-auto bg-gray-900 rounded-xl shadow-lg">
                                <div className="space-x-2">
                                    <div className=" text-center sm:ml-2 sm:text-left ">
                                        <div className="grid grid-cols-9 space-y-2">
                                            <button
                                                className="absolute left-2 top-2 text-gray-300 hover:text-red-700"
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
                                                    className="w-5 h-5 "
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                            <div className="col-start-1 col-span-2  self-center">
                                                <Image
                                                    src={`${
                                                        firstLogin(viperImage!)
                                                            ? viperImage
                                                            : `/vipers/${viperImage}`
                                                    }`}
                                                    alt={`/vipers/${viperImage}`}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full h-fit w-fit"
                                                />
                                                <span className="text-gray-300/90 text-xs flex justify-center ">
                                                    {viperIdName}
                                                </span>
                                            </div>
                                            <textarea
                                                className="h-20 p-2 col-start-3 col-span-7 text-gray-300 bg-black/30 border-[2px] rounded-lg border-transparent sm:text-xs outline-none focus:border-yellow-700/80"
                                                value={comment}
                                                onChange={(e) =>
                                                    setComment(e.target.value)
                                                }
                                                rows={3}
                                                placeholder={
                                                    !event && !reply
                                                        ? "What's happening?"
                                                        : "Share your thoughts"
                                                }
                                                maxLength={160}
                                                required
                                            ></textarea>
                                            <button
                                                className="col-start-5 col-span-2 relative w-full items-center space-x-2 rounded-lg bg-gray-800 px-3 py-1  text-sm font-medium text-white hover:bg-yellow-900/80 disabled:text-white/70"
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
                                                        <span className="sr-only">
                                                            Loading...
                                                        </span>
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
                    <div className="fixed  inset-0 z-30 overflow-x-auto ">
                        <div className="flex items-center min-h-screen px-4 py-4">
                            <div className="relative w-full max-w-md p-4  mx-auto bg-gray-900 rounded-xl shadow-lg">
                                <div className="space-x-2">
                                    <div className=" text-center sm:ml-2 sm:text-left ">
                                        <div className="grid grid-cols-9 ">
                                            <button
                                                className="absolute left-2 top-2 mb-3 text-gray-300 hover:text-red-700"
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
                                                    className="w-5 h-5 "
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                            <div className="col-start-1 col-span-2  self-center">
                                                <Image
                                                    // src={`/vipers/${viperIdImage}`}
                                                    src={`${
                                                        firstLogin(
                                                            viperIdImage!
                                                        )
                                                            ? viperIdImage
                                                            : `/vipers/${viperIdImage}`
                                                    }`}
                                                    alt={`/vipers/${viperIdImage}`}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full h-fit w-fit"
                                                />
                                                <span className="text-gray-300/90 text-xs flex justify-center ">
                                                    {viperIdName}
                                                </span>
                                            </div>
                                            <div className="col-start-3 col-span-7 border-[1px] border-slate-600 rounded-xl bg-black/30 p-2">
                                                <span className="text-gray-400 text-xs flex align-top">
                                                    Replying to:{" "}
                                                    <span className="text-yellow-500/80 text-xs ml-[5px]">
                                                        {" "}
                                                        {bloggerIdName}
                                                    </span>
                                                </span>
                                                <span className="h-16 flex justify-start text-gray-300 text-sm mx-2 mt-2 ">
                                                    {showComment}
                                                </span>
                                            </div>
                                        </div>
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
