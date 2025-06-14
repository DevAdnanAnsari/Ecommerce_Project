import React from 'react';
import { useSnackbar } from 'notistack';

// Toast notification types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Toast component to be used throughout the application
const Toast = {
  // Show success notification
  success: (message) => {
    const { enqueueSnackbar } = useSnackbar();
    enqueueSnackbar(message, { variant: TOAST_TYPES.SUCCESS });
  },
  
  // Show error notification
  error: (message) => {
    const { enqueueSnackbar } = useSnackbar();
    enqueueSnackbar(message, { variant: TOAST_TYPES.ERROR });
  },
  
  // Show warning notification
  warning: (message) => {
    const { enqueueSnackbar } = useSnackbar();
    enqueueSnackbar(message, { variant: TOAST_TYPES.WARNING });
  },
  
  // Show info notification
  info: (message) => {
    const { enqueueSnackbar } = useSnackbar();
    enqueueSnackbar(message, { variant: TOAST_TYPES.INFO });
  }
};

// Custom hook to use toast notifications
export const useToast = () => {
  const { enqueueSnackbar } = useSnackbar();
  
  return {
    success: (message) => enqueueSnackbar(message, { variant: TOAST_TYPES.SUCCESS }),
    error: (message) => enqueueSnackbar(message, { variant: TOAST_TYPES.ERROR }),
    warning: (message) => enqueueSnackbar(message, { variant: TOAST_TYPES.WARNING }),
    info: (message) => enqueueSnackbar(message, { variant: TOAST_TYPES.INFO })
  };
};

export default Toast;