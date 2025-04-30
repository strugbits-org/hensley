export const NewsLetter = () => {
  return (
    <div className="flex gap-2 lg:gap-6">
        <input type="email" name="email" id="email" placeholder="Enter your email"
        className="w-full min-w-[240px] max-w-[292px] lg:min-w-[242px] xl:min-w-[292px] bg-transparent appearance-none outline-none lg:p-5 p-3 border border-primary text-base text-primary placeholder:text-primary placeholder:uppercase error:border-red-600" />
        <button className="border border-primary text-primary transition-all duration-300 ease-in-out lg:p-5 p-3 grow px-6 lg:px-12 hover:bg-primary hover:text-secondary-alt text-sm font-haasMedium uppercase tracking-widest max-w-[150px]">SEND</button>
    </div>
  )
}