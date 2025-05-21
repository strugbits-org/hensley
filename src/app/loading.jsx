export default function Loading({ inline = true, custom = false, classes = "" }) {
    if (custom) {
        return (
            <div className={classes}>
                <div className="loader"></div>
            </div>
        )
    }
    return inline ? (
        <div className='z-[999] bg-primary-alt h-screen w-full flex items-center justify-center'>
            <div className="loader"></div>
        </div>
    ) : (
        <div className='z-[999] fixed inset-0 flex items-center justify-center'>
            <div className="absolute inset-0 bg-secondary-alt opacity-30"></div>
            <div className="loader"></div>
        </div>
    )
}