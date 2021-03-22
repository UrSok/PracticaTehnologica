import React from 'react';
import ReactPlayer from 'react-player';
import * as BsIcons from 'react-icons/bs';
import IconButton from './IconButton';

interface Props {
  message?: string;
}

interface State {
  playing: boolean;
}

export default class MusicPlayer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      playing: false,
    };
  }

  handlePlayPause = () => {
    this.setState(({ playing }) => ({
      playing: !playing,
    }));
  };

  render() {
    const { playing } = this.state;
    return (
      <>
        <ReactPlayer url="a.mp3" playing={playing} width="0" height="0" />
        <div className="MusicPlayerBar">
          <IconButton
            icon={<BsIcons.BsSkipBackwardFill />}
            onClick={this.handlePlayPause}
          />
          <IconButton
            icon={
              playing ? (
                <BsIcons.BsPauseFill size="3em" />
              ) : (
                <BsIcons.BsPlayFill size="3em" />
              )
            }
            className="PlayPauseButton"
            onClick={this.handlePlayPause}
          />
          <IconButton
            icon={<BsIcons.BsSkipForwardFill />}
            onClick={this.handlePlayPause}
          />
        </div>
      </>
    );
  }
}
