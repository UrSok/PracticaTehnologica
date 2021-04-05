import React from 'react';
import AudioSourcesSettings from '../components/settings/AudioSourcesSettings';
import PageTitle from '../components/PageTitle';

class Settings extends React.Component {
  constructor() {
    super({});
  }

  render() {
    return (
      <div className="Settings">
        <PageTitle PageName="Settings" />
        <AudioSourcesSettings />
      </div>
    );
  }
}

export default Settings;
