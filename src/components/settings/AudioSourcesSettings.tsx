/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
import { remote, shell } from 'electron';
import React from 'react';
import Switch from 'react-switch';
import * as IoIcons from 'react-icons/io5';
import Button from '../Button';
import LibraryManager from '../../managers/LibraryMananger';
import SettingsSection from './SettingsSection';
import { Library, LibraryNoPath } from '../../data-access/models/Library';
import AudioSourcesClassName from '../../constants/ClassNames';
import IconButton from '../IconButton';

interface State {
  libraries: Library[];
}

class AudioSourcesSettings extends React.Component<{}, State> {
  libraryManager: LibraryManager;

  constructor() {
    super({});
    this.libraryManager = LibraryManager.instance;
    this.state = {
      libraries: [],
    };
  }

  componentDidMount() {
    this.updateLibraryState();
  }

  handleOnAddSource = async () => {
    const result = remote.dialog.showOpenDialogSync({
      properties: ['openDirectory'],
    });
    if (result) {
      await LibraryManager.instance.addPath(result[0]);
      this.updateLibraryState();
    }
  };

  handleChange = (checked: any, _: any, stringId: any) => {
    const { libraries } = this.state;
    const libraryToChange: LibraryNoPath = {
      id: stringId as number,
      active: checked,
    };
    LibraryManager.instance.activateDeactivateLibrary(libraryToChange);
    this.updateLibraryState();
    /* const index = libraries.findIndex((x) => x.id === libraryToChange.id);
        libraries[index].active = checked;
        this.setState({
        libraries,
      }); */
  };

  handleOnPathClick = (path: string) => {
    shell.openPath(path);
  };

  updateLibraryState() {
    this.libraryManager.getAll().then((result) => {
      this.setState(
        {
          libraries: result,
        },
        () => console.log(this.state)
      );
    });
  }

  render() {
    const { libraries: library } = this.state;
    return (
      <SettingsSection title="Audio files sources">
        <div className={AudioSourcesClassName.main}>
          {library.map((item) => {
            return (
              <div key={item.id} className={AudioSourcesClassName.item}>
                <div className={AudioSourcesClassName.pathControls}>
                  <IconButton
                    icon={<IoIcons.IoFolderOpenSharp className="icon" />}
                    onClick={() => {
                      this.handleOnPathClick(item.path);
                    }}
                  />
                  <span className={AudioSourcesClassName.path}>
                    {item.path}
                  </span>
                </div>
                <Switch
                  className={AudioSourcesClassName.switch}
                  id={`${item.id}`}
                  onChange={this.handleChange}
                  checked={item.active}
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
          <Button
            className="AddSourceButton"
            text="Add Source"
            onClick={this.handleOnAddSource}
          />
        </div>
      </SettingsSection>
    );
  }
}

export default AudioSourcesSettings;
