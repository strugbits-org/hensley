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