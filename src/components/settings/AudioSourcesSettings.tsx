/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
import { remote, shell } from 'electron';
import React from 'react';
import Switch from 'react-switch';
import * as IoIcons from 'react-icons/io5';
import { Observer } from 'mobx-react';
import Button from '../Button';
import Section from '../Section';
import {
  AudioSourcesClassNames,
  ButtonsClassNames,
} from '../../constants/ClassNames';
import IconButton from '../IconButton';
import { StoreContext } from '../../utils/StoreContext';
import RootStore from '../../back-end/store/RootStore';
import { Library } from '../../back-end/models';

class AudioSourcesSettings extends React.PureComponent {
  handleOnAddSource = async () => {
    const { libraryStore } = this.context as RootStore;
    const result = remote.dialog.showOpenDialogSync({
      properties: ['openDirectory'],
    });
    if (result) {
      const library = new Library(libraryStore);
      // eslint-disable-next-line prefer-destructuring
      library.path = result[0];
      libraryStore.addLibraryIfDoesntExist(library);
      library.scanPath();
    }
  };

  handleChange = async (_check: boolean, _: any, stringId: any) => {
    const { libraryStore } = this.context as RootStore;
    const numericId = stringId as number;
    // eslint-disable-next-line eqeqeq
    const library = libraryStore.libraries.find((x) => x.id == numericId);
    library?.toggleActive();
    if (library?.active) {
      library.scanPath();
    }
  };

  handleOnPathClick = (path: string) => {
    shell.openPath(path);
  };

  render() {
    const { libraryStore } = this.context as RootStore;
    return (
      <Section title="Audio files sources">
        <div className={AudioSourcesClassNames.Main}>
          <Observer>
            {() => (
              <div>
                {libraryStore.libraries.map((library) => {
                  return (
                    <div
                      key={library.id}
                      className={AudioSourcesClassNames.Item}
                    >
                      <div className={AudioSourcesClassNames.PathControls}>
                        <IconButton
                          className={AudioSourcesClassNames.OpenPathButton}
                          icon={
                            <IoIcons.IoFolderOpenSharp
                              className={ButtonsClassNames.Icon}
                            />
                          }
                          onClick={() => {
                            this.handleOnPathClick(library.path);
                          }}
                        />
                        <span className={AudioSourcesClassNames.Path}>
                          {library.path}
                        </span>
                      </div>
                      <Switch
                        className={AudioSourcesClassNames.Switch}
                        id={`${library.id}`}
                        onChange={this.handleChange}
                        checked={library.active as boolean}
                        onColor="#966530"
                        onHandleColor="#ffb86c"
                        // offColor="#20201F"
                        offColor="#ADADAD"
                        handleDiameter={22}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        width={36}
                        height={18}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </Observer>
          <Button
            className={AudioSourcesClassNames.AddSourceButton}
            text="Add Source"
            onClick={this.handleOnAddSource}
          />
        </div>
      </Section>
    );
  }
}

AudioSourcesSettings.contextType = StoreContext;

export default AudioSourcesSettings;
