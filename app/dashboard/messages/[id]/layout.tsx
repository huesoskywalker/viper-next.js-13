import { Session } from "next-auth"
import { PageProps } from "../../../../lib/getCategories"
import { getCurrentViper } from "../../../../lib/session"
import ChatInput from "./ChatInput"

export default async function Layout({ children, params }: PageProps) {
    const id: string = params.id
    const viperSession: Session | null = await getCurrentViper()
    if (!viperSession) throw new Error("No Viper bro")
    const viper = viperSession?.user

    return (
        <div>
            <div className="my-5">{children}</div>

            <ChatInput id={id} viperId={viper.id} />
        </div>
    )
}
