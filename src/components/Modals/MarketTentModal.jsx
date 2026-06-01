import { getAdditionalInfoSection } from "@/utils";
import { CustomLink } from "../common/CustomLink";
import { PrimaryImage } from "../common/PrimaryImage";
import { PrimaryButton } from "../common/PrimaryButton";

export const MarketTentModal = ({ selectedMenu, closeModal }) => {
  const { data = [], type } = selectedMenu;
  if (!data) return null;

  return (
    <div className="relative lg:p-6 lg:h-[calc(100dvh-90px)] flex items-start lg:items-center justify-center lg:overflow-hidden mt-4 lg:mt-0">
      <div
        onClick={closeModal}
        className="absolute inset-0 -z-10 bg-secondary-glass backdrop-blur-[20px] brightness-[50px] h-full cursor-pointer"
      ></div>

      <div
        className={
          "w-full h-auto lg:h-[75vh] 2xl:h-[82vh] lg:max-h-[calc(100dvh-110px)] flex justify-center gap-y-4 lg:gap-4 xl:gap-6 lg:flex-row flex-col"
        }
      >
        {data.map((category) => {
          const {
            title,
            tagline,
            slug,
            headerCoverImage,
            tent,
            buttonLabel,
            buttonLabelMenu,
            featuredImage,
            heroBackground,
          } = category;
          const coverImage =
            headerCoverImage ||
            featuredImage ||
            heroBackground ||
            tent?.mainMedia ||
            category?.mainMedia ||
            null;

          return (
            <CustomLink
              key={title}
              to={`/${type === "markets" ? "market" : "tent"}${slug}`}
              className={
                "group relative min-h-[480px] lg:min-h-0 lg:h-full w-full lg:w-1/3 flex justify-center lg:border border-primary-border"
              }
              onClick={closeModal}
            >
              <div className="absolute font-semibold inset-0 lg:inset-4 xl:inset-6 group-hover:inset-0 transition-[inset] duration-300 ease-in-out">
                {coverImage && (
                  <PrimaryImage
                    timeout={0}
                    url={coverImage}
                    size="card"
                    alt={title}
                    customClasses="w-full h-full object-cover brightness-[90%]"
                  />
                )}
              </div>
              <div className="z-10 py-12 lg:py-6 xl:py-10 px-6 lg:px-8 xl:px-10 2xl:px-12 flex flex-col h-full w-full overflow-hidden">
                <h2 className="lg:mt-4 text-[32px] xs:text-[35px] leading-tight lg:text-[28px] xl:text-[36px] 2xl:text-[48px] uppercase tracking-wider text-primary-alt font-recklessRegular mb-2">
                  {title}
                </h2>

                <hr className="mb-3 xl:mb-4 border-primary-alt" />

                <div className="flex flex-col gap-2">
                  {tagline ? (
                    <div>
                      <p className="my-2 xl:my-4 text-[13px] lg:text-[13px] xl:text-[15px] uppercase tracking-wider text-primary-alt font-haasLight">
                        {tagline}
                      </p>
                    </div>
                  ) : (
                    tent?.additionalInfoSections?.length > 0 && (
                      <div className="text-[13px] lg:text-[13px] xl:text-[15px] uppercase tracking-wider text-primary-alt font-haasLight">
                        {getAdditionalInfoSection(
                          tent.additionalInfoSections,
                          "INFO",
                        )}
                      </div>
                    )
                  )}
                  <div className="lg:hidden mt-2 flex justify-start">
                    <PrimaryButton className="border border-primary-alt text-primary-alt hover:bg-primary-alt hover:text-secondary font-haasRegular tracking-widest text-sm min-w-[198px]">
                      {buttonLabel || buttonLabelMenu || "SEE MORE"}
                    </PrimaryButton>
                  </div>
                </div>

                <hr className="border-primary-alt my-3 xl:my-4" />

                <div className="hidden lg:block relative grow mt-4 xl:mt-8 min-h-[40px]">
                  <PrimaryImage
                    url={"/icons/8ba81b_2be7b3074d224933a0484d17c7885b75.svg"}
                    alt={title}
                    customClasses="absolute fill-primary-alt left-0 bottom-0 w-[34px] h-[34px] transition-all duration-500 ease-in-out group-hover:w-full group-hover:h-full"
                  />
                </div>
              </div>
            </CustomLink>
          );
        })}
      </div>
    </div>
  );
};
