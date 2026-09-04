import React from 'react';
import { AuthProvider } from './AuthContext';
import { ContractProvider } from './ContractContext';
import { AIProvider } from './AIContext';
import { NotificationProvider } from './NotificationContext';

export * from './AuthContext';
export * from './ContractContext';
export * from './AIContext';
export * from './NotificationContext';

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ContractProvider>
          <AIProvider>
            {children}
          </AIProvider>
        </ContractProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};
