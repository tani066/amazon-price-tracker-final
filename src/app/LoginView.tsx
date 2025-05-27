'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React from 'react';
import { signIn } from 'next-auth/react'; // ⬅️ Use next-auth client method here

const LoginView = () => {
  const handleLogin = async () => {
    await signIn('google');
  };

  return (
    <div className='w-full h-screen flex items-center justify-center bg-gray-100'>
      <Card className='p-8 w-full max-w-md text-center space-y-6'>
        <div>
          <h1 className='text-2xl font-bold mb-2'>Welcome Back</h1>
          <p className='text-gray-600'>Please log in to continue</p>
        </div>
        <div>
          <Button onClick={handleLogin}>Login with Google</Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginView;
