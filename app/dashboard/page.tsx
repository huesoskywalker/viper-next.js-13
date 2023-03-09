import { PageProps } from "../../lib/getCategories"

export default async function DashboardPage({ params }: PageProps) {
    return (
        <div className="space-y-1">
            <span className="text-gray-300 flex align-center justify-center mx-5 py-8">
                {" "}
                Welcome to the dashboard, where you can manage your events or
                keep swimming
            </span>
        </div>
    )
}
