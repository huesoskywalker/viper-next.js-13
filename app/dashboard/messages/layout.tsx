import Contacts from "./Contacts"
import { getCurrentViper } from "../../../lib/session"
import { getViperFollows } from "../../../lib/vipers"
import { ReactNode, Suspense } from "react"
import { Follow } from "../../../types/viper"
import { ViperContacts } from "./ViperContatcs"

export default async function Layout({ children }: { children: ReactNode }) {
    const viper = await getCurrentViper()
    if (!viper) return
    const viperFollows: Promise<Follow[]> = getViperFollows(viper.id)
    return (
        <div>
            <div className="grid grid-cols-4 gap-2 ">
                <div className="col-span-1 lg:border-r lg:border-gray-800 ">
                    <h1 className="text-gray-300 text-sm py-3 ">Contacts</h1>
                    <Suspense
                        fallback={
                            <div className="text-yellow-400 text-sm">
                                Suspense from layout
                            </div>
                        }
                    >
                        {/* @ts-expect-error Async Server Component */}
                        <ViperContacts contactsPromise={viperFollows} />
                    </Suspense>
                </div>
                <div className="relative col-span-3 max-w-6xl space-y-8 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                    <div className="rounded-lg bg-gray-700-700 mb-3 lg:p-1">
                        <h1 className="text-gray-300 text-sm">{children}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
