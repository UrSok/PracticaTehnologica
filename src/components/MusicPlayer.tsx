/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React from 'react';
import ReactPlayer from 'react-player';
import * as BsIcons from 'react-icons/bs';
import IconButton from './IconButton';
import MusicManager from '../managers/MusicManager';
import { NullMusic } from '../data-access/null-models/Music';

interface Props {
  message?: string;
}

interface State {
  playing: boolean;
  src: string;
}

export default class MusicPlayer extends React.Component<Props, State> {
  musicManager = new MusicManager();

  constructor(props: Props) {
    super(props);

    this.state = {
      playing: false,
      src: MusicManager.currentlyPlayingMusic.src,
    };
  }

  handlePlayPause = () => {
    if (MusicManager.currentlyPlayingMusic === NullMusic) {
      this.musicManager.queueAll().then(() => {
        this.setState({
          src: MusicManager.currentlyPlayingMusic.src,
        });
      });
    }
    this.setState(({ playing }) => ({
      playing: !playing,
    }));
  };

  hadleNextSong = () => {
    this.musicManager.nextSong();
    this.setState(() => ({
      playing: true,
      src: MusicManager.currentlyPlayingMusic.src,
    }));
  };

  hadlePrevSong = () => {
    this.musicManager.prevSong();
    this.setState(() => ({
      playing: true,
      src: MusicManager.currentlyPlayingMusic.src,
    }));
  };

  render() {
    const { playing } = this.state;
    const { src } = this.state;
    return (
      <>
        <ReactPlayer url={src} playing={playing} width="0" height="0" />
        <div className="MusicPlayerBar">
          <IconButton
            icon={<BsIcons.BsFillSkipStartFill size="1.5em" />}
            className="HoverIconButton"
            onClick={this.hadlePrevSong}
          />
          <IconButton
            icon={
              playing ? (
                <BsIcons.BsPauseFill size="3em" />
              ) : (
                <BsIcons.BsPlayFill size="3em" />
              )
            }
            className="HoverIconButton"
            onClick={this.handlePlayPause}
          />
          <IconButton
            icon={<BsIcons.BsFillSkipEndFill size="1.5em" />}
            className="HoverIconButton"
            onClick={this.hadleNextSong}
          />
          <IconButton
            icon={<BsIcons.BsShuffle size="1em" />}
            className="HoverIconButton"
            onClick={this.handlePlayPause}
          />
          <IconButton
            icon={<BsIcons.BsArrowRepeat size="1em" />}
            className="HoverIconButton"
            onClick={this.handlePlayPause}
          />
        </div>
      </>
    );
  }
}
