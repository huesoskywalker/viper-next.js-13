import { Suspense } from "react"
import { PageProps } from "@/lib/getCategories"
import { getViperById } from "@/lib/vipers"
import { Viper } from "@/types/viper"
// import { ProfileToEdit } from "./ProfileToEdit"
import EditProfile from "./EditProfile"

export default async function Layout({ children, params }: PageProps) {
    // const id: string = params.id
    // const viper: Promise<Viper | null> = getViperById(id)

    return (
        <div className="space-y-4">
            <Suspense
                fallback={<div className="text-yellow-400 text-sm">Do something pretty here</div>}
            >
                <EditProfile />
                {/* <ProfileToEdit profilePromise={viper} /> */}
            </Suspense>

            <div>{children}</div>
        </div>
    )
}
