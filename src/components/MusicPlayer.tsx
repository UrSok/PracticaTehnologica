/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React from 'react';
import ReactPlayer from 'react-player';
import * as BsIcons from 'react-icons/bs';
import * as MdIcons from 'react-icons/md';
import * as BiIcons from 'react-icons/bi';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import IconButton from './IconButton';
import MusicManager from '../back-end/managers/MusicManager';
import {
  MusicWithMetadata,
  NullMusicWithMetadata,
} from '../back-end/data-access/models/Music';
import noAlbumArt from '../../assets/no-album-art.png';
import { PathData } from '../constants/RoutesInfo';
import Navigation from '../utils/Navigation';
import { ButtonsClassNames } from '../constants/ClassNames';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

interface State {
  playing: boolean;
  src: string;
  played: number;
  durationSeconds: number;
  seeking: boolean;
  volume: number;
  volumeBeforeMute: number;
  title?: string;
  artists?: string;
  album?: string;
  albumArt?: string;
}

const SliderWithTooltip = createSliderWithTooltip(Slider);
// eslint-disable-next-line @typescript-eslint/ban-types
export default class MusicPlayer extends React.PureComponent<Props, State> {
  musicManager = MusicManager.instance;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      playing: false,
      src: '',
      played: 0,
      durationSeconds: 0,
      seeking: false,
      volume: 0.5,
      volumeBeforeMute: 0,
      title: '',
      artists: '',
      album: '',
      albumArt: '',
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
    const music = this.musicManager.currentlyPlayingMusic;
    this.setState(() => ({
      playing: true,
      src: music.src,
    }));
    this.showMetadata(music);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDuration = (duration: any) => {
    this.setState({ durationSeconds: duration });
  };

  showMetadata = (music: MusicWithMetadata) => {
    let artistsString: string;
    if (music.artists !== undefined) {
      artistsString = '';
      music.artists.forEach((artist, index) => {
        artistsString += `${artist}${
          music.artists!.length - 1 !== index ? ', ' : ''
        }`;
      });
    }
    this.setState(() => ({
      title: music.title,
      artists: artistsString,
      album: music.album,
      albumArt: music.albumArt !== undefined ? music.albumArt : noAlbumArt,
    }));
  };

  handlePlayPause = () => {
    const { playing } = this.state;
    if (
      !playing &&
      this.musicManager.currentlyPlayingMusic === NullMusicWithMetadata
    ) {
      this.musicManager.queueAll().then(() => {
        const music = this.musicManager.currentlyPlayingMusic;
        this.setState(() => ({
          src: music.src,
        }));
        this.showMetadata(music);
      });
    }
    this.setState(() => ({
      playing: !playing,
    }));
  };

  hadleNextSong = () => {
    this.musicManager.nextSong();
    const music = this.musicManager.currentlyPlayingMusic;
    this.setState({
      playing: true,
      src: music.src,
    });
    this.showMetadata(music);
  };

  hadlePrevSong = () => {
    this.musicManager.prevSong();
    const music = this.musicManager.currentlyPlayingMusic;
    this.setState(() => ({
      playing: true,
      src: music.src,
    }));
    this.showMetadata(music);
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

  handleQueueVisibility = () => {
    if (!Navigation.currentLocationIs(PathData.Queue)) {
      Navigation.push(PathData.Queue);
    } else {
      Navigation.goBack();
    }
  };

  // handleRepeat = () => {
  //   // while (true) {
  //   const { played } = this.state;
  //   const { durationSeconds } = this.state;
  //   if (played === durationSeconds) {
  //     const music = MusicManager.currentlyPlayingMusic;
  //     // this.musicManager.queue = music;
  //     this.setState(() => ({
  //       played: 0,
  //       playing: true,
  //       src: music.src,
  //     }));
  //     this.showMetadata(music);
  //   }
  //   // }
  // };

  // handleShuffle = () => {
  //   let position = MusicManager.currentlyPlayingPosition;
  //   position = this.shuffleArray(MusicManager.queue);
  //   const music = MusicManager.currentlyPlayingMusic;
  //   this.setState(() => ({
  //     playing: true,
  //     src: music.src,
  //   }));
  //   this.showMetadata(music);
  // };

  // shuffleArray = (array: MusicWithMetadata[]) => {
  //   let currentIndex = array.length;
  //   let temporaryValue;
  //   let randomIndex;
  //   // While there remain elements to shuffle...
  //   while (currentIndex !== 0) {
  //     // Pick a remaining element...
  //     randomIndex = Math.floor(Math.random() * currentIndex);
  //     currentIndex -= 1;
  //     // And swap it with the current element.
  //     temporaryValue = array[currentIndex];
  //     array[currentIndex] = array[randomIndex];
  //     array[randomIndex] = temporaryValue;
  //   }
  //   return randomIndex;
  // };

  render() {
    const { src, playing, played, durationSeconds, volume } = this.state;
    const { artists, title, album, albumArt } = this.state;
    return (
      <>
        <ReactPlayer
          style={{ display: 'none' }}
          ref={this.ref}
          url={src}
          playing={playing}
          volume={volume}
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
                icon={
                  <BsIcons.BsFillSkipStartFill
                    className={ButtonsClassNames.Icon}
                  />
                }
                onClick={this.hadlePrevSong}
              />
              <IconButton
                icon={
                  playing ? (
                    <BsIcons.BsPauseFill className={ButtonsClassNames.Icon} />
                  ) : (
                    <BsIcons.BsPlayFill className={ButtonsClassNames.Icon} />
                  )
                }
                className="PlayPauseButton"
                onClick={this.handlePlayPause}
              />
              <IconButton
                icon={
                  <BsIcons.BsFillSkipEndFill
                    className={ButtonsClassNames.Icon}
                  />
                }
                onClick={this.hadleNextSong}
              />
              <IconButton
                icon={<BiIcons.BiShuffle className={ButtonsClassNames.Icon} />}
                onClick={this.handlePlayPause}
              />
              <IconButton
                icon={
                  <BsIcons.BsArrowRepeat className={ButtonsClassNames.Icon} />
                }
                onClick={this.handlePlayPause}
              />
            </div>
            {this.musicManager.currentlyPlayingMusic !==
              NullMusicWithMetadata && (
              <div className="MusicInfo">
                <img src={albumArt} alt="album-art" className="AlbumArt" />
                <div className="TextContainer">
                  <div className="Title">{title}</div>
                  <div className="ArtistAlbum">
                    {artists !== undefined ? `${artists} — ` : ''}
                    {album}
                  </div>
                </div>
              </div>
            )}
            <div className="RightControls">
              <IconButton
                icon={
                  <MdIcons.MdQueueMusic className={ButtonsClassNames.Icon} />
                }
                onClick={this.handleQueueVisibility}
              />
              <div className="VolumeBarContainer">
                <IconButton
                  icon={
                    // eslint-disable-next-line no-nested-ternary
                    volume === 0 ? (
                      <BsIcons.BsVolumeMute
                        className={ButtonsClassNames.Icon}
                      />
                    ) : volume < 0.51 ? (
                      <BsIcons.BsVolumeDown
                        className={ButtonsClassNames.Icon}
                      />
                    ) : (
                      <BsIcons.BsVolumeUp className={ButtonsClassNames.Icon} />
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
