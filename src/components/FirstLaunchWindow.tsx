import { remote, shell } from 'electron';
import { Scrollbars } from 'rc-scrollbars';
import React from 'react';
import * as IoIcons from 'react-icons/io5';
import RootStore from '../back-end/store/RootStore';
import {
  AppClassNames,
  AudioSourcesClassNames,
  ButtonsClassNames,
  FirstLaunchWindowClassNames,
} from '../constants/ClassNames';
import { StoreContext } from '../utils/StoreContext';
import Button from './Button';
import IconButton from './IconButton';
import Section from './Section';
import { Library } from '../back-end/models';

interface State {
  localPath?: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default class FirstLaunchWindow extends React.PureComponent<{}, State> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(props: any) {
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

  handleOnConfirmSettings = () => {
    const { localPath } = this.state;
    const { libraryStore, userDataStore } = this.context as RootStore;
    if (localPath) {
      const library = new Library(libraryStore);
      library.path = localPath;
      libraryStore.addLibrary(library);
      userDataStore.userData?.toggleFirstLaunch();
      library.scanPath();
    }
  };

  render() {
    const { localPath } = this.state;
    return (
      <div className={FirstLaunchWindowClassNames.Main}>
        <div className={AppClassNames.MainContent}>
          <Scrollbars autoHide>
            <div className={AppClassNames.Content}>
              <h1 className="Headers H1">Welcome!</h1>
              <h2 className="Headers">Thank you for chosing us.</h2>
              <h3 className="Headers">Please setup bla bla bla</h3>
              <hr className="Line" />
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

FirstLaunchWindow.contextType = StoreContext;
