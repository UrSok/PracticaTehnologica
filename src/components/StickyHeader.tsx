import React from 'react';

interface Props {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const StickyHeader: React.FC<Props> = (props: Props) => {
  const { title, className, children } = props;
  return (
    <div className={`StickyHeader ${className}`}>
      <h3 className="Title">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

StickyHeader.defaultProps = {
  className: '',
};

export default StickyHeader;
