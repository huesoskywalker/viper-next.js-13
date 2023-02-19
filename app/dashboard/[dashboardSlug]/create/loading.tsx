export default function Loading() {
    return (
        <div>
            <div className="static right-12 top-12" role="status">
                <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}
