import { Viper, getVipers } from "../../../lib/vipers"
import { Suspense } from "react"
import Loading from "./loading"
import OrganizerInfo from "../../[id]/OrganizerInfo"
import ViperSearchBar from "./ViperSearchBar"

export default async function VipersPage() {
    const vipers: Viper[] = await getVipers()
    if (!vipers) return

    return (
        <>
            <div className="space-y-6">
                <ViperSearchBar />
                <div className="flex justify-between">
                    <Suspense fallback={<Loading />}>
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                            {vipers.map((viper: Viper) => {
                                return (
                                    /* @ts-expect-error Async Server Component */
                                    <OrganizerInfo
                                        key={JSON.stringify(viper._id)}
                                        id={JSON.stringify(viper._id)}
                                        event={false}
                                    />
                                )
                            })}
                        </div>
                    </Suspense>
                </div>
            </div>
        </>
    )
}
