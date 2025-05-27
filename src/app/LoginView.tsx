import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import React from 'react'
import { signIn } from "@/auth"

const LoginView = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
        <Card className=' text-center'>
          <div>
            <h1 className='text-2xl font-bold m-0'>Welcome Back</h1>
            <p>please login to continue</p>
          </div>
          <div>
            <form action={async() => {
              'use server'
              await signIn('google')
            }}>
              <Button type='submit'>Login with Google</Button>
            </form>
            
          </div>
        </Card>
    </div>
  )
}

export default LoginView