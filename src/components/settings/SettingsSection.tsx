import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<Props> = (props: Props) => {
  const { title, children } = props;
  return (
    <div className="Section">
      <div className="SectionTitle">{title}</div>
      <div className="SectionSettings">{children}</div>
    </div>
  );
};

export default SettingsSection;
