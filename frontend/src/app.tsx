import * as React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { WalletProvider } from './contexts/WalletContext';

export const App: React.FC = () => {
  return (
    <WalletProvider>
      <RouterProvider router={router} />
    </WalletProvider>
  );
};
