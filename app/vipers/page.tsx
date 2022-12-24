import { getVipers } from "../../lib/vipers"
import Link from "next/link"
// import styles from "../../styles/Events.module.css"
import { Suspense } from "react"
import Loading from "./loading"

export default async function VipersPage() {
    const vipers = await getVipers()

    return (
        <div>
            <h1>vipers around the hood</h1>
            <Suspense fallback={<Loading />}>
                <div className="">
                    {vipers?.map((event: any) => {
                        return <Viper key={event._id} event={event} />
                    })}
                </div>
            </Suspense>
        </div>
    )
}

function Viper({ event }: any) {
    const { _id, name, email, image } = event || {}
    const id: string = _id

    return (
        <Link href={`vipers/${id}`}>
            <div>
                <h3>{name}</h3>
                <p>{image}</p>
                <h5>{email}</h5>
            </div>
        </Link>
    )
}
