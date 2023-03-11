import { ReactNode } from "react"
import { Dashboard, fetchDashboard } from "../../lib/getDashboard"
import { DashGroup } from "../../components/DashGroup"

export default async function Layout({ children }: { children: ReactNode }) {
    const categories: Dashboard[] = await fetchDashboard()
    return (
        <>
            <div className="grid grid-cols-4 gap-2">
                <div className="lg:border-r lg:border-gray-800">
                    <DashGroup
                        path={`/dashboard`}
                        items={[
                            {
                                text: "Board",
                            },
                            ...categories.map((x) => ({
                                text: x.name,
                                slug: x.slug,
                            })),
                        ]}
                    />
                </div>
                <div className="col-span-3 max-w-6xl space-y-8 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                    {children}
                </div>
            </div>
        </>
    )
}
