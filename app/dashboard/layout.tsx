import { ReactNode } from "react"
import { fetchDashboard } from "../../lib/getDashboard"
import { DashGroup } from "../../components/DashGroup"

export default async function Layout({ children }: { children: ReactNode }) {
    const categories = await fetchDashboard()
    return (
        <>
            <div className="grid grid-cols-4 gap-4">
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
                    {/* <LockOpenIcon className="block w-6 text-yellow-700" /> */}
                </div>
                {/* <div className="col-span-3 mx-2 max-w-6xl space-y-8 px-2 pt-10 lg:py-8 lg:px-8 bg-red-600"> */}
                {/* <main className="bg-slate-900"> */}
                <div className="col-span-3 mx-2 max-w-6xl space-y-8 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                    {/* <div className="static rounded-lg bg-gray-700-700 p-3.5 lg:p-6"> */}
                    {children}
                    {/* </div> */}
                </div>
            </div>
        </>
    )
}
