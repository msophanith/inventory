interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='w-full max-w-lg px-6 py-6 bg-white rounded-lg shadow-md'>
        {children}
      </div>
    </div>
  );
};

export default Layout;
