"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { loaderActions } from '@/store/loaderStore';
import { CustomLink } from '../common/CustomLink';
import useUserData from '@/hooks/useUserData';
import { logError } from '@/utils';
import { checkIsAdmin } from '@/services/auth';
import useRedirectWithLoader from '@/hooks/useRedirectWithLoader';

const SidebarIcons = {
    account: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 15.955 16.043">
            <path id="fe2df171891038b33e9624c27e96e367" d="M13,10.585a4.81,4.81,0,1,0-5.949,0,8.017,8.017,0,0,0-4.987,6.558.807.807,0,1,0,1.6.176,6.414,6.414,0,0,1,12.747,0,.8.8,0,0,0,.8.714h.088a.8.8,0,0,0,.705-.882A8.017,8.017,0,0,0,13,10.585Zm-2.974-.569a3.207,3.207,0,1,1,3.207-3.207A3.207,3.207,0,0,1,10.03,10.016Z" transform="translate(-2.064 -1.995)" fill="#2c2216" />
        </svg>
    ),
    savedProducts: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 14.413 18.476">
            <path id="Caminho_13152" data-name="Caminho 13152" d="M4885.519,4822.486h12.913a.75.75,0,0,1,.75.75v16.976a.75.75,0,0,1-1.28.53l-5.926-5.926-5.926,5.926a.75.75,0,0,1-1.28-.53v-16.976A.75.75,0,0,1,4885.519,4822.486Zm12.163,1.5h-11.413V4838.4l5.176-5.176a.75.75,0,0,1,1.061,0l5.176,5.176Z" transform="translate(-4884.769 -4822.486)" fill="#2c2216" />
        </svg>
    ),
    quotesHistory: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 17.921 15.897">
            <path id="Path_13185" data-name="Path 13185" d="M11.909,3a7.955,7.955,0,0,0-8.177,7.947H2.151a.437.437,0,0,0-.309.751L4.306,14.17a.437.437,0,0,0,.627,0L7.4,11.7a.441.441,0,0,0-.318-.751H5.5a6.179,6.179,0,0,1,6.269-6.181,6.259,6.259,0,0,1,6.093,6.093,6.185,6.185,0,0,1-6.181,6.269A6.089,6.089,0,0,1,7.9,15.821.883.883,0,0,0,6.8,17.207a7.822,7.822,0,0,0,4.874,1.687,7.955,7.955,0,0,0,7.947-8.177A8.041,8.041,0,0,0,11.909,3Zm-.45,4.415a.667.667,0,0,0-.662.662v3.25a.893.893,0,0,0,.433.759l2.755,1.634a.663.663,0,0,0,.68-1.139l-2.543-1.51v-3a.665.665,0,0,0-.662-.653Z" transform="translate(-1.708 -2.997)" fill="#2c2216" />
        </svg>
    ),
    productSets: (
        <svg data-bbox="144 113.98 766.019 766.02" viewBox="0 0 1024 1024" width="18" height="18" xmlns="http://www.w3.org/2000/svg" data-type="color">
            <g>
                <path d="M464 144c8.837 0 16 7.163 16 16v304c0 8.836-7.163 16-16 16H160c-8.837 0-16-7.164-16-16V160c0-8.837 7.163-16 16-16zm-52 68H212v200h200zm493.333 87.686c6.248 6.248 6.248 16.379 0 22.627l-181.02 181.02c-6.248 6.248-16.378 6.248-22.627 0l-181.019-181.02c-6.248-6.248-6.248-16.379 0-22.627l181.02-181.02c6.248-6.248 16.378-6.248 22.627 0zm-84.853 11.313L713 203.52 605.52 311 713 418.48zM464 544c8.837 0 16 7.164 16 16v304c0 8.837-7.163 16-16 16H160c-8.837 0-16-7.163-16-16V560c0-8.836 7.163-16 16-16zm-52 68H212v200h200zm452-68c8.837 0 16 7.164 16 16v304c0 8.837-7.163 16-16 16H560c-8.837 0-16-7.163-16-16V560c0-8.836 7.163-16 16-16zm-52 68H612v200h200z" fillRule="evenodd" fill="#262116" data-color="1" />
            </g>
        </svg>
    ),
    manageBlogs: (
        <svg data-bbox="3 2.999 18 18.001" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" data-type="color">
            <g>
                <path d="M3 9.009a6.01 6.01 0 0 1 6.01-6.01H12a6.01 6.01 0 0 1 6.01 5.982h.943c1.15 0 2.047.896 2.047 2.047v3.962A6.01 6.01 0 0 1 14.99 21H9.01A6.01 6.01 0 0 1 3 14.99zm6.01-4.01A4.01 4.01 0 0 0 5 9.01v5.981A4.01 4.01 0 0 0 9.01 19h5.98A4.01 4.01 0 0 0 19 14.99V11h-1c-1.076 0-2-.924-2-2 0-2.214-1.786-4-4-4zM8 9a1 1 0 0 1 1-1h3.5a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m1 5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2z" fill="#262116" data-color="1" />
            </g>
        </svg>
    ),
    manageProjects: (
        <svg data-bbox="0 128 2048 1792" viewBox="0 0 2048 2048" width="18" height="18" xmlns="http://www.w3.org/2000/svg" data-type="color">
            <g>
                <path d="M0 128h2048v1792H0zm1920 128H128v256h1792zM128 1792h1792V640H128zm128-640V768h384v384zm128-256v128h128V896zm-128 768v-384h384v384zm128-256v128h128v-128zm512-384V896h768v128zm0 512v-128h768v128z" fill="#262116" data-color="1" />
            </g>
        </svg>
    ),
    productSorting: (
        <svg data-bbox="0 44.46 490 401.08" stroke="#2c2216" viewBox="0 0 490 490" xmlns="http://www.w3.org/2000/svg" width="18" height="18" data-type="ugc">
            <g>
                <path d="M85.877 154.014v274.295h45.829V154.014l48.791 67.199 37.087-26.943L108.792 44.46 0 194.27l37.087 26.943z" fill="#2c2216" />
                <path d="M404.13 335.988V61.691h-45.829V335.99l-48.798-67.203-37.087 26.943 108.8 149.81L490 295.715l-37.087-26.913z" fill="#2c2216" />
            </g>
        </svg>
    ),
    logout: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 15.085 18.097">
            <path id="_7ec0fd32b008f39961cd7042bd351db2" data-name="7ec0fd32b008f39961cd7042bd351db2" d="M9.8,2l.133.015,7.543,1.508a.754.754,0,0,1,.595.607l.012.132V17.835a.754.754,0,0,1-.479.7l-.127.037L9.936,20.083a.754.754,0,0,1-.89-.606l-.012-.134V2.754l.012-.134A.755.755,0,0,1,9.8,2ZM7.525,3.509V5.017H4.508V17.08H7.525v1.508H3.754a.755.755,0,0,1-.742-.619L3,17.835V4.263a.754.754,0,0,1,.619-.742l.136-.012Zm3.017.166V18.423l6.034-1.207V4.881Zm2.263,6.62a.754.754,0,1,1-.754.754A.754.754,0,0,1,12.805,10.294Z" transform="translate(-3 -2)" fill="#2c2216" />
        </svg>
    )
};

export const AccountSidebar = React.memo(() => {
    const [cookies, _setCookie, removeCookie] = useCookies(["authToken", "userData", "cartQuantity", "userTokens"]);
    const [isAdmin, setIsAdmin] = useState(false);
    const { firstName, memberId } = useUserData();
    const redirectWithLoader = useRedirectWithLoader();

    const handleLogOut = async () => {
        try {
            removeCookie("authToken", { path: "/" });
            removeCookie("userData", { path: "/" });
            removeCookie("cartQuantity", { path: "/" });
            removeCookie("userTokens", { path: "/" });

            redirectWithLoader("/");
        } catch (error) {
            logError("Error while logging out", error);
        }
    };

    const links = useMemo(() => [
        {
            name: "My Account",
            icon: SidebarIcons.account,
            to: '/account',
        },
        {
            name: "Saved Products",
            icon: SidebarIcons.savedProducts,
            to: '/saved-products',
        },
        {
            name: "Quotes History",
            icon: SidebarIcons.quotesHistory,
            to: '/quotes-history',
        },
        {
            name: "Product Sets",
            icon: SidebarIcons.productSets,
            to: '/product-sets',
            isAdmin: true,
        },
        {
            name: 'Manage Blogs',
            icon: SidebarIcons.manageBlogs,
            to: '/manage-blogs',
            isAdmin: true,
        },
        {
            name: 'Manage Projects',
            icon: SidebarIcons.manageProjects,
            to: '/manage-projects',
            isAdmin: true,
        },
        {
            name: 'Product Sorting',
            icon: SidebarIcons.productSorting,
            to: '/product-sorting',
            isAdmin: true,
        },
        {
            name: "Log Out",
            icon: SidebarIcons.logout,
            action: handleLogOut,
        }
    ], [handleLogOut]);

    const filteredLinks = useMemo(() =>
        links.filter((link) => link.isAdmin ? isAdmin : true),
        [links, isAdmin]
    );

    const setInitialValues = async () => {
        try {
            if (!memberId) return;
            const response = await checkIsAdmin(memberId);
            setIsAdmin(response);
        } catch (error) {
            logError(error);
        }
    }

    useEffect(() => {
        setInitialValues();
    }, [memberId, cookies.authToken]);

    return (
        <div className='sidebar lg:h-screen lg:sticky top-[90px] w-[317px] max-lg:w-full max-lg:p-3'>
            <div className='innerSidebar bg-[#F0DEA2] w-full h-full py-[61px] pl-[64px] max-lg:py-6 max-lg:pl-6'>
                <h2 className='text-[45px] font-recklessRegular uppercase leading-[42px] max-lg:hidden break-words'>
                    Hello,<br />
                    {firstName || ""}
                </h2>
                <div className='sidebarLinks flex flex-col max-lg:flex-row max-lg:flex-wrap gap-6 max-lg:gap-0 max-lg:gap-y-7 mt-[70px] max-lg:mt-0'>
                    {filteredLinks.map((link) =>
                        link.action ? (
                            <button
                                key={link.name}
                                className='inline-flex gap-4 font-haasRegular text-sm text-secondary-alt max-lg:w-1/3 max-md:w-1/2 uppercase transition-opacity hover:opacity-70'
                                onClick={link.action}
                                type="button"
                            >
                                {link.icon} {link.name}
                            </button>
                        ) : (
                            <CustomLink
                                key={link.name}
                                to={link.to}
                                className='inline-flex gap-4 font-haasRegular text-sm text-secondary-alt max-lg:w-1/3 max-md:w-1/2 uppercase transition-opacity hover:opacity-70'
                            >
                                {link.icon} {link.name}
                            </CustomLink>
                        )
                    )}
                </div>
            </div>
        </div>
    );
});