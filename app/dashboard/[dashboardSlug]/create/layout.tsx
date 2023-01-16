import { CreateEvent } from "./CreateEvent"
import { PageProps } from "../../../../lib/getCategories"

export default async function Layout({ children, params }: PageProps) {
    return (
        <div>
            <CreateEvent />
            <div>{children}</div>
        </div>
    )
}
