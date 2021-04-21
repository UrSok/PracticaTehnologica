/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
import { remote, shell } from 'electron';
import React from 'react';
import Switch from 'react-switch';
import * as IoIcons from 'react-icons/io5';
import { Observer } from 'mobx-react';
import toast from 'react-hot-toast';
import Button from '../Button';
import Section from '../Section';
import {
  AudioSourcesClassNames,
  ButtonsClassNames,
} from '../../constants/ClassNames';
import IconButton from '../IconButton';
import { StoreContext } from '../../utils/StoreContext';
import RootStore from '../../back-end/store/RootStore';
import { Library, PlayingFromType } from '../../back-end/models';

class AudioSourcesSettings extends React.PureComponent {
  handleOnAddSource = async () => {
    const { libraryStore, playerStore } = this.context as RootStore;
    const result = remote.dialog.showOpenDialogSync({
      properties: ['openDirectory'],
    });
    if (result) {
      const library = new Library(libraryStore);
      // eslint-disable-next-line prefer-destructuring
      library.path = result[0];
      const libraryDoesntExists = libraryStore.addLibraryIfDoesntExist(library);
      if (libraryDoesntExists) {
        toast.promise(library.scanPath(), {
          loading: 'Scanning path',
          success: 'Scanning has finished',
          error: 'Error while scanning',
        });
        if (playerStore.player.playingFromType === PlayingFromType.MainLibrary)
          playerStore.player.setPlayingFromType(PlayingFromType.None);
      }
    }
  };

  handleChange = (libraryId: number) => {
    const { libraryStore } = this.context as RootStore;
    // eslint-disable-next-line eqeqeq
    const library = libraryStore.libraries.find((x) => x.id == libraryId);
    library?.toggleActive();
    if (library?.active) {
      toast.promise(library.scanPath(), {
        loading: 'Scanning path',
        success: 'Scanning has finished',
        error: 'Error while scanning',
      });
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
                        onChange={() => {
                          this.handleChange(library.id);
                        }}
                        checked={library.active as boolean}
                        onColor="#850A0A"
                        onHandleColor="#ff0000"
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
