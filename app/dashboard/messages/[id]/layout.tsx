import { PageProps } from "../../../../lib/getCategories"
import { getCurrentViper } from "../../../../lib/session"
import ChatInput from "./ChatInput"

export default async function Layout({ children, params }: PageProps) {
    const id: string = params.id
    const viper = await getCurrentViper()
    if (!viper) return

    return (
        <div>
            <div className="my-5">{children}</div>

            <ChatInput id={id} viperId={viper.id} />
        </div>
    )
}
