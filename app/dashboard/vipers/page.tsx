import { getVipers } from "../../../lib/vipers"
import { Suspense } from "react"
import Loading from "./loading"
import OrganizerInfo from "../../[id]/OrganizerInfo"
import ViperSearchBar from "./ViperSearchBar"
import { Viper } from "../../../types/viper"
import { DisplayVipers } from "./DisplayVipers"

export default async function VipersPage() {
    const vipers: Viper[] = await getVipers()
    if (!vipers) throw new Error("No vipers bro")

    return (
        <>
            <div className="space-y-6 space-x-2">
                <ViperSearchBar />
                <Suspense fallback={<Loading />}>
                    {/* @ts-expect-error Async Server Component */}
                    <DisplayVipers vipersPromise={vipers} />
                </Suspense>
            </div>
        </>
    )
}
