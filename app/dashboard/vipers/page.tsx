import { getVipers } from "../../../lib/vipers"
import ViperInfo from "../../profile/ViperInfo"
import { Suspense } from "react"
import Loading from "./loading"

export default async function VipersPage() {
    const vipers = await getVipers()

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <Suspense fallback={<Loading />}>
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                        {vipers?.map((viper: any) => {
                            /* @ts-expect-error Async Server Component */
                            return <ViperInfo key={viper._id} id={viper._id} />
                        })}
                    </div>
                </Suspense>
            </div>
        </div>
    )
}
