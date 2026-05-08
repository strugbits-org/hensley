import facebookIcon from '@/assets/icons/facebook.png';
import instagramIcon from '@/assets/icons/instagram.png';
import linkedinIcon from '@/assets/icons/linkedin.png';
import twitterIcon from '@/assets/icons/twitter.png';
import { NewsLetter } from '../common/NewsLetter';
import { CustomLink } from '../common/CustomLink';
import { PrimaryImage } from '../common/PrimaryImage';

export const Footer = ({ data }) => {
  const { footer, footerData, socialLinks = [], footerNaviationData = [], branches = [] } = data || {};
  const brandHeading = footerData?.copyrightText1 || footer?.brand?.title || footer?.brand?.eyebrow || '';
  const brandCopy = footerData?.copyrightText2 || footer?.bottomBar?.tagline || '';
  const logoUrl = footer?.brand?.logo?.url || footer?.brand?.logo?.src || footerData?.logo || '';

  const socialIconMap = {
    facebook: facebookIcon,
    instagram: instagramIcon,
    linkedin: linkedinIcon,
    x: twitterIcon,
    twitter: twitterIcon,
  };

  const renderSocialIcon = (item) => {
    const platform = (item?.platform || item?.title || '').toLowerCase();
    const iconAsset = socialIconMap[platform];

    if (iconAsset) {
      return <img className='h-6 w-6 object-contain' src={iconAsset.src} alt={item?.label || item?.title || platform} />;
    }

    if (item?.icon) {
      return <PrimaryImage min_h={24} min_w={24} fit='fit' url={item.icon} defaultDimensions={{ height: '24px', width: '24px' }} alt={item?.label || item?.title || 'social icon'} />;
    }

    return <span className='text-primary text-sm font-haasMedium uppercase'>{(item?.platform || item?.title || '').slice(0, 1)}</span>;
  };

  return (
    <footer className='relative footer bg-secondary-alt min-h-screen flex flex-col justify-between p-6 pt-12 z-[100]'>
      <div className='footer-content flex justify-between flex-wrap lg:flex-nowrap lg:gap-x-10 gap-y-20 md:gap-y-14 lg:gap-y-6 grow md:grow-0 items-stretch md:items-start'>
        <div className='order-1 w-full md:w-1/2 lg:w-2/6'>
          <NewsLetter data={footerData} />
        </div>
        <div className='order-2 md:order-3 lg:order-2 w-full md:w-2/3 lg:w-2/6 flex justify-between lg:justify-evenly mt-80 md:mt-0'>
          {branches.map((address, index) => (
            <div className='w-2/5 lg:w-1/3' key={index}>
              <h2 className='text-sm font-haasMedium uppercase text-primary mb-1 break-words'>{address.title}</h2>
              <p className='text-sm font-haasRegular uppercase text-primary whitespace-pre-line'>{address.description}</p>
            </div>
          ))}
        </div>
        <div className='order-3 md:order-4 w-1/2 md:w-1/3 lg:w-1/6 flex flex-col md:items-end lg:items-center'>
          <div className='footer-navigation'>
            {footerNaviationData.map((item, index) => (
              <CustomLink to={item.link} key={index} target={item.target}>
                <p className='text-sm font-haasRegular uppercase text-primary mb-1'>{item.title}</p>
              </CustomLink>
            ))}
            <div className='max-w-[133px] mt-9 flex lg:hidden social-links w-full gap-3 justify-between'>
              {socialLinks.map((item, index) => (
                <CustomLink to={item.link || item.url} target={item.target || '_blank'} key={index}>
                  {renderSocialIcon(item)}
                </CustomLink>
              ))}
            </div>
          </div>
        </div>
        <div className='order-4 md:order-2 lg:order-4 w-1/2 lg:w-1/6 flex flex-col max-w-[150px]'>
          <h2 className='text-sm font-haasMedium uppercase text-primary mb-[18.5px]'> {brandHeading} </h2>
          <p className='text-sm font-haasRegular uppercase text-primary mb-5 whitespace-pre-line'>{brandCopy}</p>
          <div className='hidden lg:flex social-links w-full gap-3 justify-between max-w-[133px]'>
            {socialLinks.map((item, index) => (
              <CustomLink to={item.link || item.url} key={index} target={item.target || '_blank'}>
                {renderSocialIcon(item)}
              </CustomLink>
            ))}
          </div>
        </div>
      </div>
      <PrimaryImage customClasses='mt-20 lg:mt-0 mx-auto w-full' url={logoUrl} alt='logo' />
    </footer>
  )
}