'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { CustomDropdownPrimary } from '@/components/common/CustomDropdownPrimary';
import { logError } from '@/utils';
import { updateProjectData } from '@/services/admin';

const Cards = React.memo(({ classes, name, onClick }) => (
    <div
        className={`${classes ?? ''} col-span-1 border text-left border-primary-border flex flex-col gap-y-[10px] p-[10px] cursor-pointer`}
    >
        <div className='flex justify-between'>
            <span className='font-haasRegular text-secondary-alt uppercase text-[16px] block'>
                {name}
            </span>
            <div
                onClick={onClick}
                className='flex items-center justify-center rounded-full w-[25px] h-[25px] border border-primary-border transform transition-all duration-300 group cursor-pointer hover:bg-black'
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="20" width="20" className='group-hover:hidden' fill="black">
                    <path d="M16 4.707 15.293 4 10 9.293 4.707 4 4 4.707 9.293 10 4 15.293l.707.707L10 10.707 15.293 16l.707-.707L10.707 10 16 4.707Z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="20" width="20" className="hidden group-hover:block fill-white">
                    <path d="M16 4.707 15.293 4 10 9.293 4.707 4 4 4.707 9.293 10 4 15.293l.707.707L10 10.707 15.293 16l.707-.707L10.707 10 16 4.707Z" />
                </svg>
            </div>
        </div>
    </div>
));

const renderCardGrid = (items, labelKey, altkey, handleRemove) => {
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
            {items.map((item) => {
                const key = item._id || item.id;
                const name = item[labelKey] || item[altkey];
                return (
                    <Cards key={key} name={name} onClick={() => handleRemove(key)} />
                );
            })}
            {items.length === 0 && <p className='col-span-2 text-secondary-alt text-[16px] font-haasRegular uppercase'>No items found</p>}
        </div>
    );
};

const TAB_CONFIG = [
    {
        key: 'products',
        label: 'products',
        placeholder: 'Select Product',
        labelKey: 'name',
        dataKey: 'product?.name'
    },
    {
        key: 'studios',
        label: 'studios',
        placeholder: 'Select Studio',
        labelKey: 'name',
        dataKey: 'name'
    },
    {
        key: 'markets',
        label: 'markets',
        placeholder: 'Select Market',
        labelKey: 'category',
        dataKey: 'category',
        altkey: 'title'
    }
];

const ProjectsListUpdate = ({
    data = {},
    productsData = [],
    studiosData = [],
    marketsData = [],
    handleSelectedProject,
    setFilteredProjects
}) => {
    const { portfolioRef, studios = [], markets = [], storeProducts = [] } = data;
    const [isLoading, setIsLoading] = useState(false);
    const [updatedProducts, setUpdatedProducts] = useState(storeProducts);
    const [updatedStudios, setUpdatedStudios] = useState(studios);
    const [updatedMarkets, setUpdatedMarkets] = useState(markets);

    // Generic state updater
    const createStateUpdater = useCallback((setter) => (item) => {
        setter(prev => {
            const itemToAdd = item.product || item; // Handle products vs studios/markets
            if (prev.some(existingItem => existingItem._id === itemToAdd._id)) return prev;
            return [...prev, itemToAdd];
        });
    }, []);

    const handleRemove = useCallback((id) => {
        setUpdatedProducts(prev => prev.filter(item => item._id !== id));
        setUpdatedStudios(prev => prev.filter(item => item._id !== id));
        setUpdatedMarkets(prev => prev.filter(item => item._id !== id));
    }, []);

    const handleOnSelectProducts = useCallback(createStateUpdater(setUpdatedProducts), [createStateUpdater]);
    const handleOnSelectStudios = useCallback(createStateUpdater(setUpdatedStudios), [createStateUpdater]);
    const handleOnSelectMarkets = useCallback(createStateUpdater(setUpdatedMarkets), [createStateUpdater]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const payloadData = {
                ...data,
                storeProducts: updatedProducts,
                studios: updatedStudios,
                markets: updatedMarkets
            };
            
            setFilteredProjects(prev => prev.map(item => item._id === data._id ? { ...item, ...payloadData } : item));
            await updateProjectData(payloadData);
            handleSelectedProject(null);
        } catch (error) {
            setFilteredProjects(prev => prev.map(item => item._id === data._id ? data : item));
            logError("Error saving data", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Memoized tab configurations with data
    const tabsData = useMemo(() => [
        {
            ...TAB_CONFIG[0],
            data: productsData.map(item => ({ ...item, label: item.product?.name })),
            items: updatedProducts,
            onSelect: handleOnSelectProducts
        },
        {
            ...TAB_CONFIG[1],
            data: studiosData.map(item => ({ ...item, label: item.name })),
            items: updatedStudios,
            onSelect: handleOnSelectStudios
        },
        {
            ...TAB_CONFIG[2],
            data: marketsData.map(item => ({ ...item, label: item.title })),
            items: updatedMarkets,
            onSelect: handleOnSelectMarkets
        }
    ], [productsData, studiosData, marketsData, updatedProducts, updatedStudios, updatedMarkets, handleOnSelectProducts, handleOnSelectStudios, handleOnSelectMarkets]);

    return (
        <div className='w-full flex flex-col justify-center items-center text-center py-[50px] gap-y-[40px] relative'>
            <svg
                onClick={() => handleSelectedProject()}
                className="absolute top-9 left-0 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                height="57"
                width="57"
                style={{ transform: "rotate(45deg)" }}
            >
                <path d="M137 133a4 4 0 0 1-4 4H67a4 4 0 0 1-4-4V67a4 4 0 0 1 8 0v56.3l59.2-59.2a4 4 0 1 1 5.7 5.7L76.7 129H133a4 4 0 0 1 4 4z" />
            </svg>

            <div className='w-full grid gap-x-[10px] gap-y-[20px] grid-cols-3 mt-[30px]'>
                <div className='flex flex-col gap-y-[5px] col-span-3'>
                    <span className='text-[16px] text-secondary-alt uppercase font-haasBold'>Project title</span>
                    <span className='text-[16px] text-secondary-alt uppercase font-recklessRegular'>{portfolioRef?.title}</span>
                </div>

                <Tabs className='col-span-3'>
                    <TabList className='w-full flex flex-col md:flex-row gap-x-[10px] items-center'>
                        {tabsData.map(({ label }) => (
                            <Tab key={label} className='cursor-pointer w-full sm:w-1/3 px-[10px] py-[20px] border border-primary-border text-[16px] text-secondary-alt uppercase font-haasBold hover:bg-primary transition-all duration-300'>
                                {label}
                            </Tab>
                        ))}
                    </TabList>

                    <div className='w-full relative'>
                        {tabsData.map(({ key, placeholder, labelKey, altkey, data, items, onSelect }) => (
                            <TabPanel key={key}>
                                <div className='w-full flex flex-col justify-center items-center text-center py-[50px] gap-y-[40px]'>
                                    <div className='relative h-[60px]'>
                                        <CustomDropdownPrimary
                                            onSelect={onSelect}
                                            products={data}
                                            placeholder={placeholder}
                                        />
                                    </div>
                                    {renderCardGrid(items, labelKey, altkey, handleRemove)}
                                </div>
                            </TabPanel>
                        ))}
                    </div>
                </Tabs>
            </div>

            <div className='w-full flex justify-center items-center'>
                <button
                    disabled={isLoading}
                    onClick={handleSave}
                    className='w-[400px] tracking-[3px] hover:tracking-[5px] bg-primary hover:bg-secondary-alt hover:text-primary hover:font-haasBold transition-all duration-300 h-[58px] text-secondary-alt uppercase text-[14px] font-haasRegular'
                >
                    {isLoading ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
};

export default ProjectsListUpdate;