import { PageProps } from "../../../../lib/getCategories"
import { Viper, getViperById } from "../../../../lib/vipers"
import EditProfile from "./EditProfile"

export default async function Layout({ children, params }: PageProps) {
    const id: string = params.id
    const viper: Viper | undefined = await getViperById(id)
    if (!viper) return
    const viperId: string = JSON.stringify(viper._id).replace(/['"]+/g, "")

    if (!viper) return null

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <EditProfile
                    // viper={viper}
                    viperId={viperId}
                    name={viper.name}
                    biography={viper.biography}
                    location={viper.location}
                />
            </div>
            <div>{children}</div>
        </div>
    )
}
