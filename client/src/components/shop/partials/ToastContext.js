import React, { createContext, useContext } from 'react';
import { useSnackbar } from 'notistack';

// Create a context for toast notifications
const ToastContext = createContext();

// Toast provider component
export const ToastProvider = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // Function to show a success toast
  const showSuccess = (message) => {
    enqueueSnackbar(message, { 
      variant: 'success',
      autoHideDuration: 3000
    });
  };

  // Function to show an error toast
  const showError = (message) => {
    enqueueSnackbar(message, { 
      variant: 'error',
      autoHideDuration: 3000
    });
  };

  // Function to show an info toast
  const showInfo = (message) => {
    enqueueSnackbar(message, { 
      variant: 'info',
      autoHideDuration: 3000
    });
  };

  // Function to show a warning toast
  const showWarning = (message) => {
    enqueueSnackbar(message, { 
      variant: 'warning',
      autoHideDuration: 3000
    });
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning, closeSnackbar }}>
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook to use toast notifications
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};