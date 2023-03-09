"use client"
import Image from "next/image"
import { ReactNode, useState } from "react"
import { delay } from "../../lib/delay"
import { EventDate } from "./EventDate"

export default function ShowViper({
    // viperImage,
    viperName,
    event,
    blog,
    children,
}: {
    // viperImage: string
    viperName: string
    event: boolean
    blog: boolean
    children: ReactNode
}) {
    const [isDisplay, setIsDisplay] = useState<boolean>(false)

    const displayOrganizer = async () => {
        await delay(300)
        setIsDisplay(!isDisplay)
        await delay(100)
        setIsDisplay(true)
    }

    const closeOrganizer = async () => {
        await delay(100)
        setIsDisplay(false)
    }
    return (
        <div
            className="max-w-fit max-h-fit relative"
            onMouseLeave={closeOrganizer}
        >
            {event ? (
                <div className="relative grid grid-flow-row z-0 w-full h-full ">
                    <h1 className="text-gray-300 text-xs ">
                        Organized by:
                        <span className="text-yellow-700/80 text-xs px-1  hover:text-yellow-600/80 hover:underline">
                            <button
                                onMouseEnter={displayOrganizer}
                                className="max-h-fit max-w-fit"
                            >
                                {viperName}
                            </button>
                        </span>
                    </h1>
                </div>
            ) : blog ? null : (
                <div className="relative grid grid-flow-row z-0 w-full h-full">
                    <button
                        onMouseEnter={displayOrganizer}
                        className="max-h-fit max-w-fit flex justify-end text-yellow-800/90 text-xs  hover:text-yellow-600/90 "
                    >
                        {viperName}
                    </button>
                </div>
            )}

            {isDisplay ? (
                <div
                    className={
                        event
                            ? "absolute top-[1rem] left-[1rem] z-20 overflow-y-hidden  max-h-[14rem]"
                            : "absolute bottom-[0.7rem] left-[-1rem] z-20  overflow-y-hidden  max-h-[14rem]"
                    }
                >
                    <div className="flex items-centerpx-2 py-2">
                        <div
                            className=" w-[14rem] h-[11rem]max-h-fit max-w-lg p-4 mx-auto bg-gray-800 border-[1px] border-gray-700 rounded-xl shadow-lg"
                            onMouseLeave={closeOrganizer}
                        >
                            {children}
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
