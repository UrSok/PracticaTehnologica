import React from 'react';
import { SectionClassNames } from '../constants/ClassNames';

interface Props {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const Section: React.FC<Props> = (props: Props) => {
  const { title, className, children } = props;
  return (
    <div className={`${SectionClassNames.Main} ${className}`}>
      <div className={SectionClassNames.Title}>{title}</div>
      <div className={SectionClassNames.Options}>{children}</div>
    </div>
  );
};

Section.defaultProps = {
  className: '',
};

export default Section;
