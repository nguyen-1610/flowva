import React, { Suspense } from 'react';
import SignupForm from '@/frontend/features/auth/components/SignupForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Flowva',
  description: 'Create a new Flowva account',
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
