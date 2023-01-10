"use client"
import { useState } from "react"
import Image from "next/image"

export default function PrivatePage() {
    const [image, setImage] = useState<string>("")
    const [createObjectURL, setCreateObjectURL] = useState<string>("")

    const uploadToClient = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0]

            setImage(i)

            setCreateObjectURL(URL.createObjectURL(i))
        }
    }

    const uploadToServer = async () => {
        const body = new FormData()
        console.log("file", image)
        body.append("file", image)
        const response = await fetch(`/api/upload`, {
            method: "POST",
            body,
        })
    }

    return (
        <div>
            <div className="text-yellow-700">
                {/* <Image
                    src={createObjectURL}
                    className="hidden rounded-lg grayscale lg:block"
                    alt={createObjectURL}
                    height={400}
                    width={400}
                /> */}
                <img src={createObjectURL} />
                <h4>Select Image</h4>
                <input type="file" name="myImage" onChange={uploadToClient} />
                <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={uploadToServer}
                >
                    Send to server
                </button>
            </div>
        </div>
    )
}
