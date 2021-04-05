import React from 'react';
import { SettingsSectionClassNames } from '../../constants/ClassNames';

interface Props {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<Props> = (props: Props) => {
  const { title, className, children } = props;
  return (
    <div className={`${SettingsSectionClassNames.Main} ${className}`}>
      <div className={SettingsSectionClassNames.Title}>{title}</div>
      <div className={SettingsSectionClassNames.Options}>{children}</div>
    </div>
  );
};

SettingsSection.defaultProps = {
  className: '',
};

export default SettingsSection;
