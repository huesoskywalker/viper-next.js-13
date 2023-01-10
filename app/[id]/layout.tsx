import { PageProps } from "../../lib/getCategories"

export default async function Layout({ children, params }: PageProps) {
    return (
        <div>
            <div>{children}</div>
        </div>
    )
}
