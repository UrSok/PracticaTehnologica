import { remote, shell } from 'electron';
import { Scrollbars } from 'rc-scrollbars';
import React from 'react';
import * as IoIcons from 'react-icons/io5';
import LibraryManager from '../back-end/managers/LibraryMananger';
import {
  AppClassNames,
  AudioSourcesClassNames,
  ButtonsClassNames,
  FirstLaunchWindowClassNames,
} from '../constants/ClassNames';
import Button from './Button';
import IconButton from './IconButton';
import Section from './Section';

interface Props {
  onResult: () => void;
}

interface State {
  localPath?: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default class FirstLaunchWindow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      localPath: undefined,
    };
  }

  handleOnChangeSource = () => {
    const result = remote.dialog.showOpenDialogSync({
      properties: ['openDirectory'],
    });
    if (result) {
      this.setState({
        localPath: result[0],
      });
    }
  };

  handleOnPathClick = (path: string) => {
    shell.openPath(path);
  };

  handleOnConfirmSettings = async () => {
    const { localPath } = this.state;
    const { onResult } = this.props;
    if (localPath) {
      LibraryManager.instance.addPath(localPath);
      console.log('localpath');
      onResult();
    }
  };

  render() {
    const { localPath } = this.state;
    return (
      <div className={FirstLaunchWindowClassNames.Main}>
        <div className={AppClassNames.MainContent}>
          <Scrollbars autoHide>
            <div className={AppClassNames.Content}>
              <h1>Welcome!</h1>
              <h2>Thank you for chosing us.</h2>
              <h3>Please setup bla bla bla</h3>
              <Section
                title="Add your first music source"
                className={FirstLaunchWindowClassNames.FirstSection}
              >
                {localPath ? (
                  <div className={AudioSourcesClassNames.Item}>
                    <IconButton
                      className={AudioSourcesClassNames.OpenPathButton}
                      icon={
                        <IoIcons.IoFolderOpenSharp
                          className={ButtonsClassNames.Icon}
                        />
                      }
                      onClick={() => {
                        this.handleOnPathClick(localPath);
                      }}
                    />
                    <span className={AudioSourcesClassNames.Path}>
                      {localPath}
                    </span>
                  </div>
                ) : null}
                <Button
                  className={AudioSourcesClassNames.AddSourceButton}
                  text={localPath ? 'Change source' : 'Add source'}
                  onClick={this.handleOnChangeSource}
                />
              </Section>
            </div>
          </Scrollbars>
          <Button
            className={FirstLaunchWindowClassNames.ConfirmButton}
            text="Confirm"
            onClick={this.handleOnConfirmSettings}
          />
        </div>
      </div>
    );
  }
}
