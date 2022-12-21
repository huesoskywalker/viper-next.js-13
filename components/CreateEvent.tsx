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
        <div>
            <h2>Create an event</h2>
            <form onSubmit={handleSubmit}>
                {/* <input
                    name="csrfToken"
                    type="hidden"
                    defaultValue={csrfToken}
                /> */}

                <label htmlFor="name">Event</label>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <label htmlFor="location">Location</label>
                <input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />

                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <select id="category" onChange={(e) => setCategory(e.target.value)}>
                    <option value={"Music"}>Music</option>
                    <option value={"Food"}>Food</option>
                    <option value={"Drinks"}>Drinks</option>
                </select>

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
