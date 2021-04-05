import React from 'react';
import { ButtonsClassNames } from '../constants/ClassNames';

interface Props {
  text: string;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}

const Button: React.FC<Props> = (props: Props) => {
  const { text, className, disabled } = props;
  const { onClick } = props;
  return (
    <button
      type="button"
      className={`${ButtonsClassNames.Button} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

Button.defaultProps = {
  className: '',
  disabled: false,
};

export default Button;
