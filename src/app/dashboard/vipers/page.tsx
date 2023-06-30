import { getViperByUsername, getVipers } from "@/lib/vipers"
import { Suspense } from "react"
import Loading from "./loading"
import ViperSearchBar from "./ViperSearchBar"
import { Viper } from "@/types/viper"
import { DisplayVipers } from "./DisplayVipers"

export default async function VipersPage({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string }
}) {
    const vipers: Promise<Viper[] | null> = searchParams.search
        ? getViperByUsername(searchParams.search)
        : getVipers()
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
