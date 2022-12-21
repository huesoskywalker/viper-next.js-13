import type { ReactNode } from "react"
import "../styles/globals.css"
import Providers from "../components/Providers"
import NavBar from "../components/NavBar"

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html>
            <body>
                <main>
                    <Providers>
                        <NavBar />
                        {children}
                    </Providers>
                </main>
            </body>
        </html>
    )
}
