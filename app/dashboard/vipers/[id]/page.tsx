import { getViperBlogs } from "../../../../lib/vipers"
import { PageProps } from "../../../../lib/utils"
import { Suspense } from "react"
import Loading from "./loading"
import { Blog } from "../../../../types/viper"
import { ViperBlogs } from "../../../profile/ViperBlogs"

export default async function ViperPage({ params }: PageProps) {
    const viperId: string = params.id

    const viperBlogs: Promise<Blog[]> = getViperBlogs(viperId)
    if (!viperBlogs) throw new Error("No viper bro")

    return (
        <div className="flex justify-center">
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Server Component */}
                <ViperBlogs blogsPromise={viperBlogs} viperId={viperId} />
            </Suspense>
        </div>
    )
}
