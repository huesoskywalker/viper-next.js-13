import { getCurrentViper } from "../../lib/session"
import { getViperById } from "../../lib/vipers"
import { Profile } from "./Profile"
import { PageProps } from "../../lib/getCategories"

export default async function DashboardPage({ params }: PageProps) {
    const viper = await getCurrentViper()
    const fullViper = await getViperById(viper!.id)

    return (
        <div className="space-y-1">
            {/* @ts-expect-error Async Server Component */}
            <Profile fullViper={fullViper} />
        </div>
    )
}
