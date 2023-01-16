import { getCurrentViper } from "../../lib/session"
import { getViperById } from "../../lib/vipers"
import { PageProps } from "../../lib/getCategories"
// import BlogBarNav from "../../components/BlogBarNav"

export default async function DashboardPage({ params }: PageProps) {
    const viper = await getCurrentViper()
    const fullViper = await getViperById(viper!.id)

    return (
        <div className="space-y-1">
            <span className="text-gray-300 flex align-center justify-center mx-5 py-8">
                {" "}
                Welcome to the dashboard, where you can manage your events or
                keep swimming
            </span>

            {/* <BlogBarNav /> */}
        </div>
    )
}
