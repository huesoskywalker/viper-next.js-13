import { PageProps } from "../../../../lib/getCategories"
import { getViperById } from "../../../../lib/vipers"
import EditProfile from "./EditProfile"

export default async function Layout({ children, params }: PageProps) {
    const id: string = params.id
    const viper = await getViperById(id)

    if (!viper) return null

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <EditProfile viper={viper} />
            </div>
            <div>{children}</div>
        </div>
    )
}
