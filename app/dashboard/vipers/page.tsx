import { getVipers } from "../../../lib/vipers"
import ViperInfo from "../../profile/ViperInfo"
import { Suspense } from "react"
import Loading from "./loading"
import { delay } from "../../../lib/delay"
import OrganizerInfo from "../../[id]/OrganizerInfo"
import ViperSearchBar from "../../../components/ViperSearchBar"

export default async function VipersPage() {
    const vipers = await getVipers()

    return (
        <>
            <div className="space-y-6">
                <ViperSearchBar />

                <div className="flex justify-between">
                    <Suspense fallback={<Loading />}>
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                            {vipers?.map((viper: any) => {
                                return (
                                    /* @ts-expect-error Async Server Component */
                                    <OrganizerInfo
                                        key={JSON.stringify(viper?._id)}
                                        id={JSON.stringify(viper?._id)}
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

// <ViperInfo
//     key={viper._id}
//     id={JSON.stringify(viper._id)}
// />
