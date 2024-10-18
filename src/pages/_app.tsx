import React from 'react'
import { AppProps } from 'next/app'
import { AppProvider } from '@/context/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import '@/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  console.log('Rendering MyApp')
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Header />
        <main className="flex-grow p-4 pt-20 pb-16">
          <Component {...pageProps} />
        </main>
        <Footer />
        <Sidebar />
      </div>
    </AppProvider>
  )
}

export default MyApp