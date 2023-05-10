"use client"
import { FormEvent, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

export default function ChatInput({ contactId, viperId }: { contactId: string; viperId: string }) {
    const [message, setMessage] = useState<string>("")
    const [isPending, startTransition] = useTransition()
    const [isFetching, setIsFetching] = useState(false)

    const isMutating = isFetching || isPending

    const router = useRouter()

    const sendMessage = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        setIsFetching(true)
        setMessage("")

        const response = await fetch(`/api/messages/chat`, {
            method: "POST",
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                contact: { _id: contactId },
                viper: { _id: viperId },
                message: message,
                timestamp: Date.now(),
            }),
        })

        const freshChat = await response.json()
        console.log(`-----------freshChat`)
        console.log(freshChat)
        setIsFetching(false)
        startTransition(() => {
            router.refresh()
        })
    }
    return (
        <div className="absolute bottom-0 w-11/12">
            <form onSubmit={(e) => sendMessage(e)}>
                <label className="flex items-stretch ">
                    <input
                        data-test="message"
                        type="text"
                        className="p-[6px] w-full rounded-lg border-[2px] border-transparent sm:text-xs outline-none dark:bg-gray-700 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white focus:border-yellow-600"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                    <button data-test="send-message" type="submit">
                        {isMutating ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5 ml-3 self-end animate-ping  text-yellow-400/75"
                            >
                                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5 ml-3 self-end  hover:text-yellow-400/75"
                            >
                                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                            </svg>
                        )}
                    </button>
                </label>
            </form>
        </div>
    )
}
