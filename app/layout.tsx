import type { ReactNode } from "react"
import "./globals.css"
import Providers from "../components/Providers"
import GlobalNav from "../components/GlobalNav"
import Auth from "../components/AuthCHECKTHIS"

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html>
            <body className="overflow-y-scroll bg-gray-900">
                <Providers>
                    <GlobalNav />
                    <div className="lg:pl-48">
                        <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:py-8 lg:px-8">
                            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
                                <div className="rounded-lg bg-black p-3.5 lg:p-6">
                                    <Auth>{children}</Auth>
                                </div>
                            </div>
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    )
}
