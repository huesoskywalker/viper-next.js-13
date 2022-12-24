import type { ReactNode } from "react"
import { CreateEvent } from "../../components/CreateEvent"

export default async function Layout({ children }: { children: ReactNode }) {
    return (
        // <div className="grid grid-cols-2 gap-4">
        <div className="w-2/3 lg:border-r lg:border-gray-800 bg-green-500">
            <CreateEvent />
            <div className="lg:pl-48 bg-yellow-400">
                <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:py-8 lg:px-8 bg-red-600">
                    {/* <main className="bg-slate-900"> */}
                    <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
                        <div className="rounded-lg bg-black p-3.5 lg:p-6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
