'use client'
import ProductAction from '@/actions/ProductAction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { redirect } from 'next/navigation'


import React from 'react'

const page = () => {
  return (
    <div className='col-span-9 bg-white p-4 shadow-md rounded-lg'>
        <div className='max-w-xs mx-auto flex flex-col gap-4'>
        <h1 className='text-xl font-bold mb-4 text-gray-800 text-center'>Add Product</h1>
        <form action={async (data:FormData) => {
            console.log(data.get('productid'))
            const productID = await ProductAction(data.get('productid') as string)
            if (productID) {
                console.log('Product added successfully:', productID)
                alert('Product added successfully')
                redirect('/')
            }

        }}>
            <label className='text-sm' htmlFor="productid">Product ID</label>
            <Input name='productid' id='productid' placeholder='Enter Product ID, example:B081F1Z9Z7'></Input>
            <div className='flex justify-center mt-4'>
            <Button type='submit'>Add Product</Button>
            </div>
        </form>
        </div>
    </div>
  )
}

export default page