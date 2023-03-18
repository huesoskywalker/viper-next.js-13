"use client"

// COMPONENT

// import { useSearchParams } from 'next/navigation';

// export default function SearchBar() {
//   const searchParams = useSearchParams();

//   const search = searchParams.get('search');

//   // This will not be logged on the server when using static rendering
//   console.log(search)

//   return (
//     <>Search: {search}</>
//   );
// }

// PAGE

// import { Suspense } from 'react'
// import SearchBar from './search-bar'

// // This component passed as fallback to the Suspense boundary
// // will be rendered in place of the search bar in the initial HTML.
// // When the value is available during React hydration the fallback
// // will be replaced with the `<SearchBar>` component.
// function SearchBarFallback() {
//   return <>placeholder</>
// }

// export default function Page() {
//   return <>
//     <nav>
//       <Suspense fallback={<SearchBarFallback />}>
//         <SearchBar />
//       </Suspense>
//     </nav>
//     <h1>Dashboard</h1>
//   </>
// }

import { useState, FormEvent } from "react"

export default function ViperSearchBar() {
    const [searchViper, setSearchViper] = useState<string>("")

    const findViper = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault()

        setSearchViper("")
    }
    return (
        <div className="flex justify-center">
            <form className="flex items-center" onSubmit={(e) => findViper(e)}>
                <label htmlFor="simple-search" className="sr-only">
                    Search
                </label>
                <div className="relative w-5/6">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
                        <svg
                            aria-hidden="true"
                            className="w-4 h-4 text-gray-500 dark:text-gray-400  "
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="simple-search"
                        className="border-[1.5px]  text-xs rounded-lg outline-none block w-full pl-10 p-1  dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                        placeholder="Search"
                        onChange={(e) => setSearchViper(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="p-[4px] ml-2 text-sm font-medium  rounded-md border  focus:ring-4 focus:outline-none focus:ring-blue-300 dark:text-gray-200 dark:border-yellow-900 dark:bg-yellow-700 dark:hover:bg-yellow-600/90 dark:hover:text-white dark:focus:ring-yellow-800"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                    </svg>
                    <span className="sr-only">Search</span>
                </button>
            </form>
        </div>
    )
}
