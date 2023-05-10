// import { getCsrfToken } from "next-auth/react"
// // Static metadata
// export const metadata = {
//     title: "viper",
// }

// // or dynamic metadata
// // export async function generateMetadata({ params, searchParams }) {
// //     return { title: "..." }
// // }
// export default async function HomePage() {
//     // const csrfToken = await getCsrfToken()
//     // console.log(csrfToken)
//     return (
//         <div className="  space-y-8 mt-7">
//             <h1
//                 data-test-id="authenticated"
//                 className="flex justify-center text-xl font-medium text-gray-300"
//             >
//                 Welcome to the best app in the world
//             </h1>
//             <p className="text-gray-400 flex justify-center">
//                 Find & organize Events, match people, have fun and enjoy
//             </p>
//         </div>
//     )
// }

import { getCsrfToken } from "next-auth/react"

// Static metadata
export const metadata = {
    title: "viper",
}

export default async function HomePage() {
    // const csrfToken = await getCsrfToken()
    // console.log(csrfToken)
    return (
        <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-7">
            <h2
                data-test-id="authenticated"
                className="text-xl font-medium text-gray-300 text-center"
            >
                Welcome to the best app in the world
            </h2>
            <p className="text-gray-400 text-center">
                Find & organize Events, match people, have fun and enjoy
            </p>
        </div>
    )
}
