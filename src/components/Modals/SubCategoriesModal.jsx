import { CustomLink } from "../common/CustomLink";
import { PrimaryImage } from "../common/PrimaryImage";
import { lightboxActions } from "@/store/lightboxStore";

export const SubCategoriesModal = ({ selectedMenu, closeModal }) => {
    const { data } = selectedMenu;
    if (!data) return null;

    return (
        <div className="relative px-4 sm:px-8 md:px-12 lg:px-24 xl:px-30 3xl:px-48 pt-8 sm:pt-12 md:pt-16 lg:py-8 3xl:py-14 lg:h-[calc(100dvh-90px)] 3xl:h-[calc(100dvh-144px)] flex flex-col justify-center">
            <div onClick={closeModal} className="absolute inset-0 -z-10 bg-secondary-glass backdrop-blur-[20px] brightness-[50px] h-full cursor-pointer"></div>

            <div className="flex flex-wrap justify-center gap-0 lg:gap-y-[48px] xl:gap-y-[62px] 3xl:gap-y-[100px] max-h-[85vh] overflow-auto hide-scrollbar">
                {data.map((item) => {
                    const relatedCollection = item?.category || item?.collection || item?.productCollection || {};
                    const collectionImage = relatedCollection.mainMedia || relatedCollection.media?.mainMedia || null;
                    const { title, type, lightbox, target, href } = item;
                    

                    const content = (
                        <>
                            <div className="relative bg-primary-alt rounded-full w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-[130px] lg:h-[130px] xl:w-[169px] xl:h-[169px] 3xl:w-[280px] 3xl:h-[280px] overflow-hidden">
                                {collectionImage && <PrimaryImage timeout={0} defaultDimensions={{ width: 250, height: 250 }} url={collectionImage} size="thumbnail" alt={title} customClasses="h-full w-full object-cover" />}
                            </div>
                            <p className="mt-3 sm:mt-4 md:mt-5 lg:mt-[26px] 3xl:mt-[44px] text-xs 3xl:text-[20px] uppercase tracking-wider 3xl:tracking-[3px] text-secondary-alt font-haasRegular text-center">
                                {title}
                            </p>
                        </>
                    );

                    return (
                        <div key={title} className="w-1/5 flex flex-col items-center">
                            {type === "lightbox" && lightbox ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        lightboxActions.showLightBox(lightbox);
                                        closeModal?.();
                                    }}
                                >
                                    {content}
                                </button>
                            ) : (
                                <CustomLink to={href} target={target} onClick={closeModal}>
                                    {content}
                                </CustomLink>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}