import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Sidebar from '../components/Sidebar';
import '../styles/globals.css'


const MyApp = ({ Component, pageProps }: AppProps) => {

  const [isSSR, setIsSSR] = useState( true ); // Estado que indica si estamos en SSR o no

  useEffect(() => {                           // Cuando se carga la página, se cambia el estado a false
    setIsSSR( false );
  }, []);

  if(isSSR) return null;                      // Si estamos en SSR, no mostramos nada

  return (
    <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN}`}>
      <div className='xl:w-[1200px] m-auto overflow-hidden h-[100vh]'>
        <Navbar />
        <div className="flex gap-6 md:gap-20">
          <div className="h-[92vh] overflow-hidden xl:hover:overflow-auto">
            <Sidebar />
          </div>
          <div className="mt-4 flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1">
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  )

}

export default MyApp
