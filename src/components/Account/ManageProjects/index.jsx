"use client"
import React, { useState } from 'react';
import ProjectsList from './ProjectsList';
import ProjectsListUpdate from './ProjectsListUpdate';

function ManageProjects({ data }) {
    const { projectsData, productsData, marketsData, studiosData } = data;
    const [activeProject, setActiveProject] = useState(null);
    const [open, setOpen] = useState(false);
    const [filteredProjects, setFilteredProjects] = useState(projectsData);

    const handleSearch = (term = '') => {
        const filteredData = projectsData.filter((item) => item.titleAndDescription.toLowerCase().includes(term.toLowerCase()));
        setFilteredProjects(filteredData);
    };

    const handleSelectedProject = (item) => {
        if (item) {
            setActiveProject(item);
            setOpen(true);
        } else {
            setActiveProject(null);
            setOpen(false);
        }
    }

    return (
        <div className='MyAccount w-full max-lg:mb-[85px]'>
            <div className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0'>
                <h2 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[97px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px]'>
                    Manage Blogs
                </h2>
            </div>
            <div className='xl:px-[150px] px-[50px] max-lg:py-0 max-lg:mt-3 max-sm:p-9'>
                <div className='w-full mx-auto'>

                    {(
                        open ? (
                            <ProjectsListUpdate data={activeProject} productsData={productsData} studiosData={studiosData} marketsData={marketsData} handleSelectedProject={handleSelectedProject} setFilteredProjects={setFilteredProjects} />
                        ) : (
                            <ProjectsList data={filteredProjects} products={productsData} handleSearch={handleSearch} handleSelectedProject={handleSelectedProject} />
                        )
                    )}

                </div>
            </div>
        </div>
    );
}

export default ManageProjects;
