import { PageProps } from "../../../../lib/utils"
import GoBackArrow from "../../GoBackArrow"

export default async function Layout({ children, params }: PageProps) {
    console.log(params)
    return (
        <div className="border-t-[1px] border-gray-800">
            <div className="relative top-0 left-0 my-4">
                <GoBackArrow href={`/${params.id}`} />
            </div>
            {children}
        </div>
    )
}
