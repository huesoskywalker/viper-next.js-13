"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export function CreateEvent() {
    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [date, setDate] = useState<string>("")
    const [category, setCategory] = useState<string>("")

    const { data: session } = useSession()
    const organizer = session?.user

    const router = useRouter()

    const handleSubmit = async () => {
        const response = await fetch(`/api/form`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                organizer,
                title,
                content,
                location,
                date,
                category,
            }),
        })

        setTitle("")
        setContent("")
        setLocation("")
        setDate("")
        setCategory("")

        router.refresh()
    }

    return (
        <div className="py-2">
            <h2 className="text-2xl font-bold text-yellow-400">
                {" "}
                Hello motherfucker from Dashboard
            </h2>
            <div className="mt-8 max-w-md">
                <div className="grid grid-cols-1 gap-6">
                    <form onSubmit={handleSubmit}>
                        <label className="block">
                            <span className="text-green-700">Event name</span>
                            <input
                                type="text"
                                className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                  "
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </label>
                        <label className="block">
                            <span className="text-green-700">
                                Additional details
                            </span>
                            <textarea
                                className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                  "
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={3}
                            ></textarea>
                        </label>
                        <label className="block">
                            <span className="text-green-700">
                                What type of event is it?
                            </span>
                            <select
                                className="
                    block
                    w-full
                    mt-1
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                  "
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value={"none"} disabled hidden>
                                    Select an Option
                                </option>

                                <option value={"music"}>Music</option>
                                <option value={"food"}>Food</option>
                                <option value={"drinks"}>Drinks</option>
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-green-700">
                                When is your event?
                            </span>
                            <input
                                type="date"
                                className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                  "
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </label>
                        <label className="block">
                            <span className="text-green-700">Location</span>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                  "
                                required
                            />
                        </label>
                        <div className="block">
                            <div className="mt-2">
                                <div>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="
                          rounded
                          bg-gray-200
                          border-transparent
                          focus:border-transparent focus:bg-gray-200
                          text-gray-700
                          focus:ring-1 focus:ring-offset-2 focus:ring-gray-500
                        "
                                        />
                                        <span className="ml-2 text-red-700">
                                            Email me news and special offers
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="ml-2 text-yellow-800">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )

    // return (
    //     <div>
    //         <h2>Create an event</h2>
    //         <form onSubmit={handleSubmit}>
    //             {/* <input
    //                 name="csrfToken"
    //                 type="hidden"
    //                 defaultValue={csrfToken}
    //             /> */}

    //             <label htmlFor="name">Event</label>
    //             <input
    //                 type="text"
    //                 placeholder="Title"
    //                 value={title}
    //                 onChange={(e) => setTitle(e.target.value)}
    //                 required
    //             />
    //             <textarea
    //                 placeholder="Content"
    //                 value={content}
    //                 onChange={(e) => setContent(e.target.value)}
    //                 required
    //             />
    //             <label htmlFor="location">Location</label>
    //             <input
    //                 placeholder="Location"
    //                 value={location}
    //                 onChange={(e) => setLocation(e.target.value)}
    //                 required
    //             />

    //             <label htmlFor="date">Date</label>
    //             <input
    //                 type="date"
    //                 value={date}
    //                 onChange={(e) => setDate(e.target.value)}
    //                 required
    //             />

    //             <select
    //                 id="category"
    //                 onChange={(e) => setCategory(e.target.value)}
    //             >
    //                 <option value={"Music"}>Music</option>
    //                 <option value={"Food"}>Food</option>
    //                 <option value={"Drinks"}>Drinks</option>
    //             </select>

    //             <button type="submit">Submit</button>
    //         </form>
    //     </div>
    // )
}
