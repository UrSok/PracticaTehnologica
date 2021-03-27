/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React from 'react';
import ReactPlayer from 'react-player';
import * as BsIcons from 'react-icons/bs';
import * as MdIcons from 'react-icons/md';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import IconButton from './IconButton';
import MusicManager from '../managers/MusicManager';
import { NullMusic } from '../data-access/null-models/Music';

interface Props {
  message?: string;
}

interface State {
  playing: boolean;
  src: string;
  played: number;
  durationSeconds: number;
  seeking: boolean;
}
const SliderWithTooltip = createSliderWithTooltip(Slider);
export default class MusicPlayer extends React.Component<Props, State> {
  musicManager = new MusicManager();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      playing: false,
      src: MusicManager.currentlyPlayingMusic.src,
      played: 0,
      seeking: false,
      durationSeconds: 0,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref = (player: any) => {
    this.player = player;
  };

  getTimeString = (value: number): string => {
    const hours = Math.trunc(value / 3600);
    const minutes = Math.trunc((value % 3600) / 60);
    const seconds = Math.trunc((value % 3600) % 60);
    return `
      ${hours > 1 ? `${hours}:` : ''}${minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }
    `;
  };

  handleStartSeeking = () => {
    this.setState({ seeking: true });
  };

  handleSeekChange = (value: number) => {
    this.setState({
      played: value,
    });
  };

  handleEndSeeking = (value: number) => {
    this.setState({
      seeking: false,
      played: value,
    });
    this.player.seekTo(value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleProgress = (state: any) => {
    const { seeking } = this.state;
    if (!seeking) {
      this.setState(state);
    }
  };

  handleEnded = () => {
    // check the if the loop current or loop queue is on.
    this.musicManager.nextSong();
    this.setState(() => ({
      playing: true,
      src: MusicManager.currentlyPlayingMusic.src,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDuration = (duration: any) => {
    this.setState({ durationSeconds: duration });
  };

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

  getVolumeValue = () => {
    return (document.getElementById('volume-control') as HTMLInputElement)
      .value;
  };

  // setVolumeValue = (val: string) => {
  //   const slider = document.getElementById('volume-control');
  //   slider?.innerHTML = val;
  // };

  handleVolume = (volume: number) => {
    if (volume === 0) {
      return <BsIcons.BsVolumeMute />;
    }
    if (volume > 0 && volume < 51) {
      return <BsIcons.BsVolumeDown />;
    }
    return <BsIcons.BsVolumeUp />;
  };

  render() {
    const { src, playing, played, durationSeconds } = this.state;
    return (
      <>
        <ReactPlayer
          ref={this.ref}
          url={src}
          playing={playing}
          width="0"
          height="0"
          onDuration={this.handleDuration}
          onProgress={this.handleProgress}
          onEnded={this.handleEnded}
        />
        <div className="MusicPlayerBar">
          <SliderWithTooltip
            min={0}
            max={0.9999999}
            step={0.000001}
            value={played}
            className="ProgressBar"
            tipFormatter={() =>
              `${this.getTimeString(played * durationSeconds)}`
            }
            onBeforeChange={this.handleStartSeeking}
            onChange={this.handleSeekChange}
            onAfterChange={this.handleEndSeeking}
          />
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
          <IconButton
            icon={<MdIcons.MdQueueMusic size="1em" />}
            className="HoverIconButton"
            onClick={this.handlePlayPause}
          />
          <IconButton
            icon={this.handleVolume(+this.getVolumeValue)}
            className="HoverIconButton"
            onClick={this.handlePlayPause}
          />
        </div>
      </>
    );
  }
}
