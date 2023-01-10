import Contacts from "./Contacts"
import { getCurrentViper } from "../../../lib/session"
import { getViperFollows } from "../../../lib/vipers"
import { ReactNode } from "react"

export default async function Layout({ children }: { children: ReactNode }) {
    const viper = await getCurrentViper()
    const viperFollows = await getViperFollows(viper!.id)
    const follows = viperFollows.map((follow) => {
        return follow.follows
    })
    return (
        <div>
            <div className="grid grid-cols-4 gap-4 ">
                <div className=" lg:border-r lg:border-gray-800 ">
                    <h1 className="text-gray-300 text-sm py-3 ">Contacts</h1>
                    {follows?.map((followsId) => {
                        return (
                            /* @ts-expect-error Async Server Component */
                            <Contacts key={followsId} id={followsId} />
                        )
                    })}
                </div>
                <div className="relative col-span-3 mx-2 max-w-6xl space-y-8 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                    <div className="rounded-lg bg-gray-700-700 mb-3 lg:p-1">
                        <h1 className="text-gray-300 text-sm">{children}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
