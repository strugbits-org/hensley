"use client"
import React, { useEffect, useState } from 'react'
import { ViewQuoteModal } from './ViewQuoteModal';
import { fetchAllQuotes } from '@/services/quotes/QuoteApis';
import { logError } from '@/utils';
import { loaderActions } from '@/store/loaderStore';
import { QuoteItem } from './QuoteItem';

function QuotesHistory({ pageTitle, data: labels }) {

    const { loadMoreButtonLabel } = labels;

    const pageSize = 5;
    const [quotesData, setQuotesData] = useState([]);
    const [pageLimit, setPageLimit] = useState(pageSize);
    const [selectedQuote, setSelectedQuote] = useState();

    const data = {
        heading: pageTitle,
    };

    const fetchQuotesData = async () => {
        try {
            const quotesData = await fetchAllQuotes();
            const filteredQuotes = quotesData.filter(quote => quote?.lineItems?.length > 0);
            setQuotesData(filteredQuotes);
            loaderActions.hide();
        } catch (error) {
            logError("Error while fetching quotes", error);
        }
    };

    useEffect(() => {
        fetchQuotesData();
    }, []);

    const handleAutoSeeMore = () => {
        setPageLimit((prev) => prev + pageSize);
    };

    const showLoadMore = pageLimit < quotesData.length;

    return (
        <div className='QuotesHistory'>
            <header className='heading w-full pt-[51px] pb-[54px] flex justify-center items-center border-b border-b-[#E0D6CA] max-lg:pt-[78px] max-lg:pb-0 max-lg:border-b-0 max-md:pt-[50px]'>
                <h1 className='uppercase text-[140px] font-recklessRegular text-center w-full leading-[125px] max-lg:text-[55px] max-lg:leading-[50px] max-md:text-[35px]'>
                    {data.heading}
                </h1>
            </header>

            <main className='quotesTable w-full px-6 pt-[70px] max-lg:pt-[6.5px]'>
                <div className='max-w-[1240px] max-sm:pt-[50px] max-sm:pb-[77px] w-full mx-auto'>
                    {quotesData.length === 0 ? (
                        <div className='w-full text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular' role="status" aria-live="polite">
                            No Quotes Found
                        </div>
                    ) : (
                        <div className='quotes-list space-y-0 mb-10' role="list">
                            {quotesData.slice(0, pageLimit).map((quote) => (
                                <QuoteItem
                                    data={labels}
                                    key={quote._id}
                                    quote={quote}
                                    handleViewClick={() => setSelectedQuote(quote)}
                                />
                            ))}
                        </div>
                    )}

                    {showLoadMore && (
                        <button
                            onClick={handleAutoSeeMore}
                            className={`w-full h-[150px] max-lg:h-[90px] bg-primary tracking-[6px] group hover:tracking-[10px] transform transition-all duration-300 hover:bg-[#2C2216] hover:text-primary relative flex items-center justify-center mb-20`}
                            aria-label="Load more quotes"
                        >
                            <span className='font-haasLight uppercase text-sm leading-[30px] group-hover:font-haasBold'>
                                {loadMoreButtonLabel || "LOAD MORE"}
                            </span>
                            <svg
                                className='rotate-45 size-[13px] group-hover:w-4 transition-all duration-300 ease-in-out absolute right-[26.3px] text-[#2c2216] group-hover:text-white hidden max-lg:block'
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 10.665 10.367"
                                aria-hidden="true"
                            >
                                <g id="Group_2072" data-name="Group 2072" transform="translate(-13.093 0.385)">
                                    <path id="Path_3283" data-name="Path 3283" d="M0,0H9.867V9.867" transform="translate(13.39 0.115)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1" />
                                    <line id="Line_14" data-name="Line 14" x1="9.822" y2="9.27" transform="translate(13.436 0)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1" />
                                </g>
                            </svg>
                        </button>
                    )}
                </div>
            </main>

            <ViewQuoteModal
                labels={labels}
                data={selectedQuote}
                onClose={() => setSelectedQuote(null)}
            />
        </div>
    );
}

export default QuotesHistory;