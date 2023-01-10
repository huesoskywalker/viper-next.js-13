"use client"

import { ReactNode, useState } from "react"

export default function ShowFollows({
    children,
    follows,
    followers,
}: {
    children: ReactNode
    follows: number
    followers: boolean
}) {
    const [openFollows, setOpenFollows] = useState<boolean>(false)
    const showFollows = () => {
        setOpenFollows(!openFollows)
    }
    return (
        <span>
            <button onClick={showFollows}>
                <span>
                    <span className="text-sm">{follows}</span>{" "}
                    {followers ? "Followers" : "Following"}
                </span>
            </button>

            {openFollows ? (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-center min-h-screen px-4 py-8">
                        <div className="relative w-full max-w-lg p-4 mx-auto bg-gray-800 rounded-xl shadow-lg">
                            <button
                                className="flex justify-start self-start mb-3"
                                onClick={() => setOpenFollows(false)}
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
                            <div className="mx-10 ">
                                <div className=" text-center sm:ml-4 sm:text-left">
                                    <div className="items-center gap-2 mt-3 grid grid-rows-2 grid-cols-4 ">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </span>
    )
}