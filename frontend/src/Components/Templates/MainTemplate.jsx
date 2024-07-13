import React from 'react';

export default function MainTemplate({ children }) {
  return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">{children}</div>;
}
