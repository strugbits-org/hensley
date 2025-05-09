import logo from '@/assets/logo-footer.png';
import { NewsLetter } from '../common/NewsLetter';
import { CustomLink } from '../common/CustomLink';
import { PrimaryImage } from '../common/PrimaryImage';

export const Footer = ({ data }) => {
  const { footerData, socialLinks, footerNaviationData, branches } = data;
  console.log("Footer data:", data);

  return (
    <footer className='relative footer bg-secondary-alt min-h-screen z-50 flex flex-col justify-between p-6 pt-12'>
      <div className='footer-content flex flex-wrap justify-between gap-y-6 lg:grow-0 grow'>
        <div className='order-1 w-full lg:w-1/2 xl:w-3/12'>
          <h2 className='text-sm font-haasMedium uppercase text-primary mb-[18.5px]'>NewsLetter:</h2>
          <p className='text-sm font-haasRegular uppercase text-primary mb-5'>REGISTER YOUR EMAIL AND STAY UP TO DATE WITH EVERYTHING BEFORE ANYONE ELSE.</p>
          <NewsLetter />
        </div>
        <div className='order-4 xl:order-2 lg:w-4/12 flex justify-between mb-20'>
          {branches.map((address, index) => (
            <div className='w-2/5 lg:w-1/3' key={index}>
              <h2 className='text-sm font-haasMedium uppercase text-primary mb-1'>{address.title}</h2>
              <p className='text-sm font-haasRegular uppercase text-primary'>{address.description}</p>
            </div>
          ))}
        </div>
        <div className='order-3 w-1/2 lg:w-2/12'>
          {footerNaviationData.map((item, index) => (
            <CustomLink to={item.link} key={index} target={item.target}>
              <p className='text-sm font-haasRegular uppercase text-primary mb-1'>{item.title}</p>
            </CustomLink>
          ))}
          <div className='max-w-[133px] mt-9 flex lg:hidden social-links w-full gap-3 justify-between'>
            {socialLinks.map((item, index) => (
              <CustomLink to={item.link} target={item.target} key={index}>
                <PrimaryImage timeout={0} url={item.icon} defaultDimensions={{ height: 19, width: 19 }} alt="icon" />
              </CustomLink>
            ))}
          </div>
        </div>
        <div className='order-2 xl:order-4 w-1/2 xl:w-2/12 flex flex-col items-end'>
          <div className='max-w-[132px]'>

          </div>
          <h2 className='text-sm font-haasMedium uppercase text-primary mb-[18.5px]'> {footerData.copyrightText1} </h2>
          <p className='text-sm font-haasRegular uppercase text-primary mb-5'>{footerData.copyrightText2}</p>
          <div className='hidden lg:flex social-links w-full gap-3 justify-between'>
            {socialLinks.map((item, index) => (
              <CustomLink to={item.title} key={index} target={item.target}>
                <PrimaryImage timeout={0} url={item.icon} defaultDimensions={{ height: 19, width: 19 }} alt="icon" />
              </CustomLink>
            ))}
          </div>
        </div>
      </div>
      <PrimaryImage timeout={0} url={footerData.logo} fit='fit' customClasses="mt-20 lg:mt-0 mx-auto w-full" src={logo} alt="logo" />
    </footer>
  )
}