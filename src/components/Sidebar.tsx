import { AlignJustifyIcon, BellIcon, PackagePlusIcon,} from 'lucide-react'
import React from 'react'
import Link from 'next/link'

const Sidebar = () => {
  return (
    <aside 
    style={{minHeight:`calc(100vh - 120px)`}}
    className='bg-white rounded-2xl p-4 h-full'>
        <h2 className='uppercase mb-2 text-gray-600 btext-xs font-extrabold'>Navigation</h2>
        <nav className='flex flex-col gap-2 *:flex *:gap-1 *:items-center'>
            <Link href={'/'}>
                <AlignJustifyIcon className='h-5'/>
                All Products
            </Link>
            <Link href={'/addProduct'}>
                <PackagePlusIcon className='h-5'/>
                Add Products
            </Link>
            <Link href={'/notifications'}>
                <BellIcon className='h-5'/>
                Notifications
            </Link>
        </nav>
   
    </aside>
  )
}

export default Sidebar