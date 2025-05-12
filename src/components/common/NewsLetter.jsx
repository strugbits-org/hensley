export const NewsLetter = ({ data }) => {
  const { newsletterPlaceholder, newsletterButtonLabel, newsletterHeading, newsletterDescription } = data;
  return (
    <div className="newsletter-form">
      <h2 className='text-sm font-haasMedium uppercase text-primary mb-[18.5px]'>{newsletterHeading}</h2>
      <p className='text-sm font-haasRegular uppercase text-primary mb-5'>{newsletterDescription}</p>
      <div className="flex gap-2 lg:gap-6">
        <input type="email" name="email" id="email" placeholder={newsletterPlaceholder}
          className="w-full sm:min-w-[240px] lg:min-w-[220px] md:max-w-[350px] bg-transparent appearance-none outline-none lg:p-5 p-3 border border-primary text-base text-primary placeholder:text-primary placeholder:uppercase error:border-red-600" />
        <button className="border border-primary text-primary transition-all duration-300 ease-in-out p-5 grow px-12 hover:bg-primary hover:text-secondary-alt text-sm font-haasMedium uppercase tracking-widest max-w-[150px]">{newsletterButtonLabel}</button>
      </div>
    </div>
  )
}