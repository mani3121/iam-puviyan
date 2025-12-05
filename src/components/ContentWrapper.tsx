import React from 'react';

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'desktop' | 'tablet' | 'mobile';
}

const ContentWrapper = ({ 
  children, 
  className = "", 
  maxWidth = 'desktop' 
}: ContentWrapperProps) => {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'desktop':
        return 'max-w-[1440px]';
      case 'tablet':
        return 'max-w-7xl';
      case 'mobile':
        return 'max-w-7xl';
      default:
        return 'max-w-[1440px]';
    }
  };

  const getPaddingClass = () => {
    switch (maxWidth) {
      case 'desktop':
        return 'px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20';
      case 'tablet':
        return 'px-6 md:px-12';
      case 'mobile':
        return 'px-4';
      default:
        return 'px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20';
    }
  };

  return (
    <div className={`${getMaxWidthClass()} mx-auto ${getPaddingClass()} w-full ${className}`}>
      {children}
    </div>
  );
};

export default ContentWrapper;
