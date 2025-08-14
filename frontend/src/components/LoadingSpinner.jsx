import React from 'react';

const LoadingSpinner = ({ fullHeight = false }) => {
  return (
    <div className={`tw-flex tw-justify-center tw-items-center ${fullHeight ? 'tw-min-h-[calc(100vh-200px)]' : ''}`}>
      <div className="tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-t-2 tw-border-b-2 tw-border-[#99CCD0]"></div>
    </div>
  );
};

export default LoadingSpinner;
