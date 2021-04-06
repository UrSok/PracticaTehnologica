/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
import { remote, shell } from 'electron';
import React from 'react';
import Switch from 'react-switch';
import * as IoIcons from 'react-icons/io5';
import Button from '../Button';
import LibraryManager from '../../back-end/managers/LibraryMananger';
import Section from '../Section';
import {
  Library,
  LibraryNoPath,
} from '../../back-end/data-access/models/Library';
import {
  AudioSourcesClassNames,
  ButtonsClassNames,
} from '../../constants/ClassNames';
import IconButton from '../IconButton';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

interface State {
  libraries: Library[];
}

class AudioSourcesSettings extends React.Component<Props, State> {
  libraryManager: LibraryManager;

  constructor(props: Props) {
    super(props);
    this.libraryManager = LibraryManager.instance;
    this.state = {
      libraries: [],
    };
  }

  componentDidMount() {
    this.libraryManager.getAll().then((result) => {
      this.setState({
        libraries: result,
      });
    });
  }

  handleOnAddSource = async () => {
    const result = remote.dialog.showOpenDialogSync({
      properties: ['openDirectory'],
    });
    if (result) {
      const newPath = await this.libraryManager.addPath(result[0]);
      if (newPath.length > 0) {
        const library = await this.libraryManager.getByPath(newPath);
        const { libraries } = this.state;
        libraries.push(library);
        this.setState({
          libraries,
        });
        LibraryManager.instance.scanPath(library.path); // make async later
      }
    }
  };

  handleChange = async (checked: boolean, _: any, stringId: any) => {
    const numericId = stringId as number;
    const libraryToChange: LibraryNoPath = {
      id: numericId,
      active: checked,
    };
    const result = await this.libraryManager.activateDeactivateLibrary(
      libraryToChange
    );
    if (result) {
      const { libraries } = this.state;
      // eslint-disable-next-line eqeqeq
      const index = libraries.findIndex((x) => x.id == libraryToChange.id);
      libraries[index].active = checked;
      this.setState({
        libraries,
      });
      if (checked) {
        LibraryManager.instance.scanPath(libraries[index].path);
      }
    }
  };

  handleOnPathClick = (path: string) => {
    shell.openPath(path);
  };

  render() {
    const { libraries } = this.state;
    return (
      <Section title="Audio files sources">
        <div className={AudioSourcesClassNames.Main}>
          {libraries.map((library) => {
            return (
              <div key={library.id} className={AudioSourcesClassNames.Item}>
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

export default AudioSourcesSettings;
