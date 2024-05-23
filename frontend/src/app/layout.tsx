import type { Metadata } from 'next';
import '@/styles/globals.css';
import Sidebar from './_components/sidebar';
import { ModalContextProvider } from './_lib/context/modal-context';

export const metadata: Metadata = {
  title: 'Snarøya Curlinghall',
  description: 'Webapplikasjon for å planlegge og sette i gang eksperimenter med klimaanlegget i Snarøya Curlinghall.',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon/favicon-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '48x48',
      url: '/favicon/favicon-48x48.png',
    },
  ],
};

const RootLayout = ({ children }: Readonly <{ children: React.ReactNode }>) => {
  return (
    <html lang="no">
      <body>
        <div className="flex min-h-screen min-w-full bg-gray-100">
          <Sidebar />
          <main className="flex flex-col w-full min-h-full bg-gray-100 p-6">
            <ModalContextProvider>
              {children}
            </ModalContextProvider>
          </main>
        </div>
      </body>
    </html>
  );
}

export default RootLayout;