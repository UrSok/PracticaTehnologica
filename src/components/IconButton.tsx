import React from 'react';

interface IconButonProps {
  icon: React.ReactNode;
  className?: string;
  onClick: () => void;
}

const IconButton: React.FC<IconButonProps> = (props: IconButonProps) => {
  const { icon } = props;
  const { className } = props;
  const { onClick } = props;
  return (
    <button
      type="button"
      className={`IconButton ${className}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

IconButton.defaultProps = {
  className: '',
};

export default IconButton;
