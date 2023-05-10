// import "./globals.css"
// import type { ReactNode } from "react"
// import AuthProvider from "@/components/AuthProvider"
// import GlobalNav from "@/components/GlobalNav"

// export default function RootLayout({ children }: { children: ReactNode }) {
//     return (
//         <html>
//             <body className="overflow-y-scroll bg-gray-900">
//                 <AuthProvider>
//                     <GlobalNav />
//                     <div className="lg:pl-48">
//                         <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:py-8 lg:px-8">
//                             <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
//                                 <div className=" rounded-lg bg-black p-3.5 lg:p-6">{children}</div>
//                             </div>
//                         </div>
//                     </div>
//                 </AuthProvider>
//             </body>
//         </html>
//     )
// }

import "./globals.css"
import type { ReactNode } from "react"
import AuthProvider from "@/components/AuthProvider"
import GlobalNav from "@/components/GlobalNav"

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html>
            <body className="overflow-y-scroll bg-gray-900">
                <AuthProvider>
                    <GlobalNav />
                    <div className="lg:pl-44">
                        <div className="mx-auto max-w-4xl px-2 pt-20 pb-8 lg:py-8 lg:px-8">
                            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
                                <div className="rounded-lg bg-black p-3.5 lg:p-6">{children}</div>
                            </div>
                        </div>
                    </div>
                </AuthProvider>
            </body>
        </html>
    )
}
