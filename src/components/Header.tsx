import React from 'react'
import Link from 'next/link'
import { ChartColumnIncreasing, SearchIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { signOut } from '@/auth'
import { User } from 'next-auth'
import { Input } from './ui/input'
// Server action
async function handleLogout() {
  'use server'
  await signOut()
  redirect('/login')
}
const Header = async({user}:{user:User}) => {
    if (!user) return null
  return (
    
    <header className="flex flex-wrap items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-gray-800">
              <ChartColumnIncreasing className="w-5 h-5" />
              <span>AmazonPriceTracker</span>
            </Link>

            {/* Avatar dropdown */}
            <div className='flex items-center gap-2'>
               <div className='flex bg-white rounded-full p-2 items-center relative'>
                <SearchIcon className='pointer-events-none absolute left-2'/>
                <Input className='rounded-full border-none shadow-none bg-white pl-8' placeholder='Search...'></Input>
               </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer w-9 h-9">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 bg-white p-2 rounded-md shadow-lg mt-2">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <form action={handleLogout}>
                        <Button variant="ghost" type="submit" className="w-full justify-start">
                          Logout
                        </Button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
  )
}

export default Header