// Reusable spinner. NOTE: this intentionally lives in components/, NOT as
// app/loading.jsx. A root-level app/loading.jsx registers a Suspense boundary
// around every route, which makes notFound() stream-and-swap on the client
// (React #310 in the App Router, prod-only). Keeping the spinner here, and
// letting pages render notFound() into the initial SSR shell, avoids that.
export default function Loading({ inline = true, custom = false, classes = "", type = "primary" }) {
    if (custom) {
        return (
            <div className={classes}>
                <div className={type === "primary" ? "loader" : "loader-secondary"}></div>
            </div>
        )
    }
    return inline ? (
        <div className='z-[999] bg-primary-alt h-screen w-full flex items-center justify-center'>
            <div className={type === "primary" ? "loader" : "loader-secondary"}></div>
        </div>
    ) : (
        <div className='z-[999] fixed inset-0 flex items-center justify-center'>
            <div className="absolute inset-0 bg-secondary-alt opacity-30"></div>
            <div className={type === "primary" ? "loader" : "loader-secondary"}></div>
        </div>
    )
}
