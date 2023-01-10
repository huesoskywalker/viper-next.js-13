"use client"

import { useTransition } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function Participate({
    id,
    participants,
}: {
    id: string
    participants: string[]
}) {
    const [isPending, startTransition] = useTransition()

    const router = useRouter()

    const { data: session } = useSession()
    const viperId = session?.user.id

    const addParticipant = async () => {
        const response = await fetch(`/api/participate-event`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                viper: viperId,
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
            <div className="grid grid-cols-2">
                <h1 className="text-l font-medium text-gray-400/80 pb-2 flex justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
                            clipRule="evenodd"
                        />
                        <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                    </svg>
                </h1>
                <div>
                    <h1 className="text-l font-medium text-gray-400/80 pb-2 flex justify-start">
                        {participants.length}
                    </h1>
                </div>
            </div>

            <button
                className="relative w-full items-center space-x-2 rounded-lg bg-gray-700 px-3 py-1  text-sm font-medium text-white hover:bg-vercel-blue/90 disabled:text-white/70"
                onClick={addParticipant}
                disabled={isPending}
            >
                Participate
                {isPending ? (
                    <div className="absolute right-2 top-1.5" role="status">
                        <div
                            className="
            h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent"
                        />
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : null}
            </button>
        </div>
    )
}
