import { getCurrentViper } from "@/lib/session"
import { PageProps } from "@/lib/getCategories"
import { Viper } from "@/types/viper"
import CreateEvent from "./CreateEvent"

export default async function Layout({ children, params }: PageProps) {
    // Delete all this and stay with the session from the 'use client' component
    // Once cypress test i done and we head back to database strategy.
    // Also create a readme with some steps to change for testing. This is the first one.
    // const sessionViper = await getCurrentViper()
    // const viperId = sessionViper?.user.id
    // const fetchViper = await fetch(`http://localhost:3000/api/viper/${viperId}`, {
    //     method: "GET",
    //     headers: {
    //         "content-type": "application/json; charset=utf-8",
    //     },
    // })
    // const viper: Viper = await fetchViper.json()
    // if (!viper) throw new Error("No viper bro")
    // const viper_id = JSON.stringify(viper._id).replace(/[^a-zA-Z0-9]/g, "")
    return (
        <div>
            <CreateEvent />
            <div>{children}</div>
        </div>
    )
}
