/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React from 'react';
import ReactPlayer from 'react-player';
import * as BsIcons from 'react-icons/bs';
import * as MdIcons from 'react-icons/md';
import * as BiIcons from 'react-icons/bi';
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
  volume: number;
  volumeBeforeMute: number;
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
      durationSeconds: 0,
      seeking: false,
      volume: 0.5,
      volumeBeforeMute: 0,
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
    this.setState({
      playing: true,
      src: MusicManager.currentlyPlayingMusic.src,
    });
  };

  hadlePrevSong = () => {
    this.musicManager.prevSong();
    this.setState(() => ({
      playing: true,
      src: MusicManager.currentlyPlayingMusic.src,
    }));
  };

  handleVolumeChange = (volume: number) => {
    this.setState({ volume });
  };

  handleMuteUnmute = () => {
    const { volume, volumeBeforeMute } = this.state;
    if (volumeBeforeMute === 0) {
      this.setState({
        volumeBeforeMute: volume,
        volume: 0,
      });
    } else {
      this.setState({
        volumeBeforeMute: 0,
        volume: volumeBeforeMute,
      });
    }
  };

  render() {
    const { src, playing, played, durationSeconds, volume } = this.state;
    return (
      <>
        <ReactPlayer
          ref={this.ref}
          url={src}
          playing={playing}
          volume={volume}
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
          <div className="ControlsAndMusicInfo">
            <div className="LeftControls">
              <IconButton
                icon={<BsIcons.BsFillSkipStartFill className="icon" />}
                onClick={this.hadlePrevSong}
              />
              <IconButton
                icon={
                  playing ? (
                    <BsIcons.BsPauseFill className="icon" />
                  ) : (
                    <BsIcons.BsPlayFill className="icon" />
                  )
                }
                className="PlayPauseButton"
                onClick={this.handlePlayPause}
              />
              <IconButton
                icon={<BsIcons.BsFillSkipEndFill className="icon" />}
                onClick={this.hadleNextSong}
              />
              <IconButton
                icon={<BiIcons.BiShuffle className="icon" />}
                onClick={this.handlePlayPause}
              />
              <IconButton
                icon={<BsIcons.BsArrowRepeat className="icon" />}
                onClick={this.handlePlayPause}
              />
            </div>
            <div className="RightControls">
              <IconButton
                icon={<MdIcons.MdQueueMusic className="icon" />}
                onClick={this.handlePlayPause}
              />
              <div className="VolumeBarContainer">
                <IconButton
                  icon={
                    // eslint-disable-next-line no-nested-ternary
                    volume === 0 ? (
                      <BsIcons.BsVolumeMute className="icon" />
                    ) : volume < 0.51 ? (
                      <BsIcons.BsVolumeDown className="icon" />
                    ) : (
                      <BsIcons.BsVolumeUp className="icon" />
                    )
                  }
                  onClick={this.handleMuteUnmute}
                />
                <SliderWithTooltip
                  min={0}
                  max={1}
                  step={0.01}
                  className="VolumeBar"
                  value={volume}
                  tipFormatter={() => `${Math.trunc(volume * 100)}%`}
                  onChange={this.handleVolumeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
