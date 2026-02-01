'use client';

import React from 'react';
import Link from 'next/link';
import Input from './Input';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { createClient } from '@/backend/lib/supabase/client';

const Hero: React.FC = () => {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/callback?next=/projects`,
      },
    });
  };

  return (
    <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-white">
      {/* Abstract Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 self-center lg:self-start px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              New: Project Boards
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Orchestrate your team's <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">potential.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Flowva connects your tasks, docs, and conversations in one intuitive platform. Stop switching tabs and start shipping value.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 size={16} className="text-green-500" /> No credit card required
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 size={16} className="text-green-500" /> Free for small teams
              </div>
            </div>
          </div>

          {/* Right Side: The "Jira-style" Login Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white rounded-2xl shadow-2xl shadow-indigo-900/10 border border-slate-100 p-8 sm:p-10 relative overflow-hidden group">
                
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-400 via-indigo-600 to-purple-600"></div>

              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-slate-900">Get started with Flowva</h3>
                <p className="text-slate-500 text-sm mt-2">Create your account in seconds.</p>
              </div>

              {/* Google Button - The "Hero" of the form */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex cursor-pointer items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md mb-6 group-focus:ring-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.2 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative flex py-2 items-center mb-6">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink-0 mx-4 text-slate-400 text-xs font-semibold uppercase">Or sign up with email</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              <form className="space-y-4" action="/signup" method="GET">
                <Input label="Work Email" type="email" placeholder="name@company.com" id="email" name="email" />
                <Input label="Full Name" type="text" placeholder="Jane Doe" id="name" name="name" />
                
                <button 
                  type="submit" 
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:scale-[1.01]"
                >
                   Create Account <ArrowRight size={18} />
                </button>
              </form>
              
              <p className="text-center text-xs text-slate-400 mt-6 leading-relaxed">
                By clicking "Create Account", you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
              </p>
            </div>
            
            {/* Decorative element behind card */}
            <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-slate-100 rounded-3xl transform rotate-3 opacity-0 lg:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
