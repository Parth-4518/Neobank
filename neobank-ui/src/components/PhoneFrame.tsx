import { type ReactNode } from 'react';

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] h-[850px] bg-gray-50 rounded-[3rem] shadow-2xl overflow-hidden relative border-8 border-gray-800 flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-800 rounded-b-2xl z-50" />
        {/* Status Bar */}
        <div className="h-12 bg-white flex items-center justify-between px-6 pt-2 shrink-0">
          <span className="text-sm font-semibold">9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-full bg-gray-800" />
            <div className="w-4 h-4 rounded-full bg-gray-800" />
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {children}
        </div>
        {/* Home Indicator */}
        <div className="h-5 bg-white flex justify-center items-center shrink-0">
          <div className="w-32 h-1 bg-gray-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}
