import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout = ({ children, className = "" }: PageLayoutProps) => {
  return (
    <div className={`min-h-screen text-white relative overflow-hidden flex flex-col ${className}`}>
      {children}
    </div>
  );
};

export default PageLayout;
