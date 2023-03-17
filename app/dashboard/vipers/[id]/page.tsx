import { getViperBlogs, preloadViperBlogs } from "../../../../lib/vipers"
import { PageProps } from "../../../../lib/utils"
import { Suspense } from "react"
import Loading from "./loading"
import { Blog } from "../../../../types/viper"
import { ViperBlogs } from "../../../profile/ViperBlogs"

export default async function ViperPage({ params }: PageProps) {
    const viperId: string = params.id

    // Using cache pattern built on top of parallel fetching
    preloadViperBlogs(viperId)

    return (
        <div className="flex justify-center">
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Server Component */}
                <ViperBlogs viperId={viperId} />
            </Suspense>
        </div>
    )
}
