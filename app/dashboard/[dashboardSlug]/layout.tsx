import { fetchDashboardBySlug, PageProps } from "../../../lib/getDashboard"
import { TabGroup } from "../../../components/TabGroup"

export default async function Layout({ children, params }: PageProps) {
    const category = await fetchDashboardBySlug(params.dashboardSlug)

    if (!category) return null

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <TabGroup
                    path={`/dashboard/${category.slug}`}
                    items={[
                        {
                            text: "All",
                        },
                        ...category.items.map((x) => ({
                            text: x.name,
                            slug: x.slug,
                        })),
                    ]}
                />
            </div>
            <div>{children}</div>
        </div>
    )
}
