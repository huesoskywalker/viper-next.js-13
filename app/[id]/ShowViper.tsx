"use client"
import Image from "next/image"
import { ReactNode, useState } from "react"
import { delay } from "../../lib/delay"

export default function ShowViper({
    // viperImage,
    viperName,
    children,
}: {
    // viperImage: string
    viperName: string
    children: ReactNode
}) {
    const [isDisplay, setIsDisplay] = useState<boolean>(false)

    const displayOrganizer = async () => {
        await delay(400)
        setIsDisplay(!isDisplay)
        await delay(100)
        setIsDisplay(true)
    }

    const closeOrganizer = async () => {
        await delay(200)
        setIsDisplay(false)
    }
    return (
        <div className="max-w-fit max-h-fit" onMouseLeave={closeOrganizer}>
            <div className="relative grid grid-flow-row z-20 w-full h-full">
                <h1 className="text-gray-300 text-xs ">
                    Organized by:
                    <span className="text-yellow-700/80 text-xs px-1  hover:text-yellow-600/80 hover:underline">
                        <button
                            onMouseEnter={displayOrganizer}
                            // onMouseMoveCapture={displayOrganizer}
                            // href={`/vipers/${viperImage}`}
                            className="max-h-fit max-w-fit"
                        >
                            {viperName}
                        </button>
                    </span>
                </h1>
            </div>
            {isDisplay ? (
                <div className="absolute top-[18.5rem] left-[21rem] z-10 overflow-y-hidden  max-h-[14rem]">
                    <div className="flex items-center  px-2 py-2">
                        <div
                            className="static w-[14rem] h-[11rem] max-w-lg p-4 mx-auto bg-gray-800 rounded-xl shadow-lg"
                            onMouseLeave={closeOrganizer}
                        >
                            {/* <div className="mx-10 "> */}
                            {/* <div className=" text-center sm:ml-4 sm:text-left"> */}
                            {/* <div className="items-center gap-2 mt-3 grid grid-rows-2 grid-cols-4 "> */}
                            {children}
                            {/* </div> */}
                            {/* </div> */}
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
