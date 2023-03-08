import { PageProps } from "../../../../lib/utils"
import GoBackArrow from "../../GoBackArrow"

export default async function Layout({ children, params }: PageProps) {
    return (
        <>
            <div className="relative top-0 left-0 my-4">
                <GoBackArrow />
            </div>
            {children}
        </>
    )
}
