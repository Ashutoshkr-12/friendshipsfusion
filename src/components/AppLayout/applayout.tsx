
import Navbar from '@/components/AppLayout/nav';
import { ThemeProvider } from '../theme-provider';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <html>
      <body>
      <ThemeProvider>
    <div className="flex flex-col min-h-screen md:flex-row">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0 md:pl-16">
        {children}
      </main>
    </div>
    </ThemeProvider>
    </body>
    </html>
  )
};

export default AppLayout;