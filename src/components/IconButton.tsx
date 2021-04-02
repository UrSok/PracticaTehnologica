import React from 'react';

interface IconButonProps {
  icon: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}

const IconButton: React.FC<IconButonProps> = (props: IconButonProps) => {
  const { icon, className, disabled } = props;
  const { onClick } = props;
  return (
    <button
      type="button"
      className={`IconButton ${className}`}
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
};

export default IconButton;
