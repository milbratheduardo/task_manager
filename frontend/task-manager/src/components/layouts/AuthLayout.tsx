import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">Gerenciador de Tarefas</h2>
        {children}
      </div>

      <div
        className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-orange-50 bg-cover bg-no-repeat bg-center overflow-hidden p-8"
        style={{ backgroundImage: `url('/bg-img.png')` }}
      >
      </div>
    </div>
  );
};

export default AuthLayout;
