import { PageProps } from "../../lib/getCategories"
import GoBackArrow from "./GoBackArrow"
import { Event } from "./Event"
// export const dynamic = "auto"
// export const dynamicParams = true
// export const revalidate = 30
// export const fetchCache = "auto"
// export const runtime = "nodejs"
// export const preferredRegion = "auto"

export default async function Layout({ children, params }: PageProps) {
    const eventId: string = params.id
    return (
        <div className="grid grid-cols-11 gap-4 ">
            <GoBackArrow />
            <div className="col-start-2 col-span-9 mx-2 max-w-6xl lg:border-x lg:border-gray-800 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                <div className="my-5 max-h-[100%] border-b-[1px] pb-3 border-gray-700/80">
                    {/* @ts-expect-error Server Component */}
                    <Event eventId={eventId} />
                </div>
                {children}
            </div>
        </div>
    )
}
