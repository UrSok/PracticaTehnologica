import React from 'react';
import AudioSourcesSettings from '../components/settings/AudioSourcesSettings';
import PageTitle from '../components/PageTitle';
import { PagesClassNames } from '../constants/ClassNames';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}
// eslint-disable-next-line @typescript-eslint/ban-types
class Settings extends React.PureComponent<Props, {}> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className={PagesClassNames.Settings}>
        <PageTitle PageName="Settings" />
        <AudioSourcesSettings />
      </div>
    );
  }
}

export default Settings;
