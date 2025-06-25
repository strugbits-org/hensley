export default function NotFound() {
  return (
    <div className='z-[999] bg-primary h-screen w-full flex items-center justify-center'>
      <h1 className="absolute text-primary-alt text-[242px] sm:text-[400px] lg:text-[600px] 2xl:text-[900px] leading-[85px] font-recklessRegular">404</h1>
      <p className="absolute text-secondary-alt text-[14px] sm:text-[16px] lg:text-[20px] font-haasBold text-center">PAGE NOT <br /> FOUND</p>
    </div>
  );
}