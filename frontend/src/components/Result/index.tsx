import React from 'react';
import { Button, ButtonProps, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { Stack } from '@mui/system';

interface ResultProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonTo?: string;
  secondaryButtonTo?: string;
  hidePrimaryButton?: boolean;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  children?: React.ReactNode;
}

interface Variant {
  icon: JSX.Element;
  title: string;
  color: 'success' | 'error' | 'warning' | 'info';
  primaryButtonText: string;
}

interface DefaultVariant {
  success: Variant;
  error: Variant;
  warning: Variant;
  info: Variant;
}

const Result: React.FC<ResultProps> = ({
  variant,
  title,
  message,
  icon,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonTo,
  secondaryButtonTo,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  hidePrimaryButton,
  children,
}) => {
  const defaultVariant: DefaultVariant = {
    success: {
      icon: <CheckCircleIcon fontSize="large" color="success" />,
      title: 'Yay! it worked!',
      color: 'success',
      primaryButtonText: 'Okay',
    },
    error: {
      icon: <ErrorOutlineIcon fontSize="large" color="error" />,
      title: 'Oh no! Something went wrong...',
      color: 'error',
      primaryButtonText: 'Back',
    },
    warning: {
      icon: <WarningIcon fontSize="large" color="warning" />,
      title: 'Uh oh! There might be an issue...',
      color: 'warning',
      primaryButtonText: 'Okay',
    },
    info: {
      icon: <InfoIcon fontSize="large" color="info" />,
      title: 'Heads up!',
      color: 'info',
      primaryButtonText: 'Okay',
    },
  };

  const {
    color,
    primaryButtonText: defaultPrimaryButtonText,
    icon: defaultIcon,
    title: defaultTitle,
  } = defaultVariant[variant];

  const handlePrimaryButtonClick = () => {
    if (onPrimaryButtonClick) {
      onPrimaryButtonClick();
    }
  };

  const handleSecondaryButtonClick = () => {
    if (onSecondaryButtonClick) {
      onSecondaryButtonClick();
    }
  };

  const buttonSx = {
    width: '100%',
  };

  const primaryButtonProps: ButtonProps = {
    sx: buttonSx,
    variant: 'contained',
    color,
    onClick: handlePrimaryButtonClick,
    ...(primaryButtonTo ? { component: Link, to: primaryButtonTo } : {}),
  };

  const secondaryButtonProps: ButtonProps = {
    sx: buttonSx,
    variant: 'outlined',
    onClick: handleSecondaryButtonClick,
    ...(secondaryButtonTo ? { component: Link, to: secondaryButtonTo } : {}),
  };

  return (
    <Stack alignItems="center">
      <Stack
        alignItems="center"
        spacing={2}
        sx={{
          maxWidth: '300px',
        }}
      >
        {icon || defaultIcon}
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          {title || defaultTitle}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ textAlign: 'center' }}>
          {message || children}
        </Typography>
        {!hidePrimaryButton && <Button {...primaryButtonProps}>{primaryButtonText || defaultPrimaryButtonText}</Button>}
        {secondaryButtonText && <Button {...secondaryButtonProps}>{secondaryButtonText}</Button>}
      </Stack>
    </Stack>
  );
};

export default Result;
