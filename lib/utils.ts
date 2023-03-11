import React from "react"

export interface PageProps {
    params?: any
    children?: React.ReactNode
}

export const firstLogin = (string: string) => {
    if (string.startsWith("https")) return true
    return false
}
