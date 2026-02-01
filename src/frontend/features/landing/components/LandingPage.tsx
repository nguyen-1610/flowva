'use client';

import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import Pricing from './Pricing';
import Footer from './Footer';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        
        {/* Simple Bottom CTA */}
        <div className="bg-indigo-600 py-16 px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get organized?</h2>
                <Link 
                  href="/signup"
                  className="inline-block bg-white text-indigo-600 hover:bg-slate-100 font-bold py-4 px-8 rounded-full shadow-xl transition-all hover:scale-105"
                >
                    Start Your Free Trial
                </Link>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}