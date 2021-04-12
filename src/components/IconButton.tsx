import React from 'react';
import { ButtonsClassNames } from '../constants/ClassNames';

interface IconButonProps {
  icon: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const IconButton: React.FC<IconButonProps> = (props: IconButonProps) => {
  const { icon, className, disabled } = props;
  const { onClick } = props;
  return (
    <button
      type="button"
      className={`${ButtonsClassNames.IconButton} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  );
};

IconButton.defaultProps = {
  className: '',
  disabled: false,
  onClick: () => {},
};

export default IconButton;
