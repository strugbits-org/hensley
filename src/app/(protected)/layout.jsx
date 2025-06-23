import { AccountSidebar } from '@/components/Account/Sidebar'
import React from 'react'

function Layout({ children }) {
    return (
        <div className='flex  max-lg:h-auto flex-row  max-lg:flex-col'>
            <AccountSidebar />
            <div className='h-full overflow-auto w-[calc(100%-317px)] max-lg:w-full'>
                {children}
            </div>
        </div>
    )
}

export default Layout;