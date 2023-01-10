import { File, Formidable } from "formidable"
import fs from "fs"
import type { NextApiRequest, NextApiResponse } from "next"
import { requestToBodyStream } from "next/dist/server/body-streams"

export const config = {
    api: {
        bodyParser: false,
    },
}

export default function uploadViperFiles(
    req: NextApiRequest,
    res: NextApiResponse<{
        data: {
            url: string | string[]
        } | null
        error: string | null
    }>
) {
    return new Promise(async (resolve, reject) => {
        const form = new Formidable({
            multiples: true,
            keepExtensions: true,
        })

        form.on("file", (name: string, file: File) => {
            const data = fs.readFileSync(file.filepath)
            file.filepath = file.newFilename

            // for (let i = 0; i < Array(file).length; i++) {
            // url.push(file.filepath)
            // }

            fs.writeFileSync(`public/vipers/${file.newFilename}`, data)

            // const url = Array.isArray(file)
            //     ? file.map((f) => f.filepath)
            //     : file.filepath

            // console.log(url)
            const url = file.filepath

            res.status(200).json({
                data: {
                    url: url,
                },
                error: null,
            })
        })
            .on("aborted", () => {
                reject(res.status(500))
            })
            .on("end", () => {
                resolve(res.status(200))
            })
        await form.parse(req)
    })
}
