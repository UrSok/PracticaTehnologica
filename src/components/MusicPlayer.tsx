/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React from 'react';
import ReactPlayer from 'react-player';
import * as BsIcons from 'react-icons/bs';
import * as MdIcons from 'react-icons/md';
import * as BiIcons from 'react-icons/bi';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import { Observer } from 'mobx-react-lite';
import IconButton from './IconButton';
import noAlbumArt from '../../assets/no-album-art.png';
import { PathData } from '../constants/RoutesInfo';
import Navigation from '../utils/Navigation';
import { ButtonsClassNames } from '../constants/ClassNames';
import { StoreContext } from '../utils/StoreContext';
import RootStore from '../back-end/store/RootStore';
import { Repeat } from '../back-end/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

interface State {
  seeking: boolean;
}

const SliderWithTooltip = createSliderWithTooltip(Slider);
// eslint-disable-next-line @typescript-eslint/ban-types
export default class MusicPlayer extends React.PureComponent<Props, State> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      seeking: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref = (player: any) => {
    const { playerStore } = this.context as RootStore;
    playerStore.setReactPlayer(player);
  };

  handleStartSeeking = () => {
    this.setState({ seeking: true });
  };

  handleSeekChange = (value: number) => {
    const { playerStore } = this.context as RootStore;
    playerStore.player.setProgress(value);
  };

  handleEndSeeking = (value: number) => {
    const { playerStore } = this.context as RootStore;
    this.setState({
      seeking: false,
    });
    playerStore.player.seekTo(value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleProgress = (state: any) => {
    const { seeking } = this.state;
    const { playerStore } = this.context as RootStore;
    if (!seeking) playerStore.player.setProgress(state.played);
  };

  handlePlayPause = () => {
    const { playerStore } = this.context as RootStore;
    playerStore.player.togglePlaying();
  };

  handleQueueVisibility = () => {
    if (!Navigation.currentLocationIs(PathData.Queue)) {
      Navigation.push(PathData.Queue);
    } else {
      Navigation.goBack();
    }
  };

  /* Volume Handlers */
  handleVolumeChange = (volume: number) => {
    const { playerStore } = this.context as RootStore;
    playerStore.player.setVolume(volume);
  };

  handleVolumeChangeEnded = (volume: number) => {
    const { playerStore } = this.context as RootStore;
    playerStore.player.setVolumeAndSave(volume);
  };

  render() {
    const { playerStore } = this.context as RootStore;
    return (
      <Observer>
        {() => (
          <>
            {playerStore.player.currentPlayingMusic && (
              <ReactPlayer
                style={{ display: 'none' }}
                ref={this.ref}
                url={playerStore.player.currentPlayingMusic.src}
                playing={playerStore.player.playing}
                volume={playerStore.player.volume}
                muted={playerStore.player.muted}
                onProgress={this.handleProgress}
                onEnded={() => {
                  playerStore.player.nextSong();
                }}
              />
            )}
            <div className="MusicPlayerBar">
              <SliderWithTooltip
                min={0}
                max={0.9999999}
                step={0.000001}
                value={playerStore.player.played}
                disabled={!playerStore.player.currentPlayingMusic}
                className="ProgressBar"
                tipFormatter={() => `${playerStore.player.timeString}`}
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
                    onClick={() => {
                      playerStore.player.prevSong();
                    }}
                  />
                  <IconButton
                    icon={
                      playerStore.player.playing ? (
                        <BsIcons.BsPauseFill
                          className={ButtonsClassNames.Icon}
                        />
                      ) : (
                        <BsIcons.BsPlayFill
                          className={ButtonsClassNames.Icon}
                        />
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
                    onClick={() => {
                      playerStore.player.nextSong(true);
                    }}
                  />
                  <IconButton
                    icon={
                      <BiIcons.BiShuffle className={ButtonsClassNames.Icon} />
                    }
                    onClick={() => {
                      playerStore.player.toggleShuffle();
                    }}
                    className={playerStore.player.shuffle ? 'Enabled' : ''}
                  />
                  <IconButton
                    icon={
                      <BsIcons.BsArrowRepeat
                        className={ButtonsClassNames.Icon}
                      />
                    }
                    onClick={() => {
                      playerStore.player.toggleRepeat();
                    }}
                    className={`${
                      playerStore.player.repeat > 0 ? 'Enabled' : ''
                    }${
                      playerStore.player.repeat === Repeat.Track
                        ? ' RepeatTrackEnabled'
                        : ''
                    }`}
                  />
                </div>
                <div className="MusicInfo">
                  {playerStore.player.currentPlayingMusic && (
                    <>
                      <img
                        src={
                          playerStore.player.currentPlayingMusic.albumArt !==
                          undefined
                            ? playerStore.player.currentPlayingMusic.albumArt
                            : noAlbumArt
                        }
                        alt="album-art"
                        className="AlbumArt"
                      />
                      <div className="TextContainer">
                        <div className="Title">
                          {playerStore.player.currentPlayingMusic.title}
                        </div>
                        <div className="ArtistAlbum">
                          {
                            playerStore.player.currentPlayingMusic
                              .artistsAlbumString
                          }
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="RightControls">
                  <IconButton
                    icon={
                      <MdIcons.MdQueueMusic
                        className={ButtonsClassNames.Icon}
                      />
                    }
                    onClick={this.handleQueueVisibility}
                  />
                  <div className="VolumeBarContainer">
                    <IconButton
                      icon={
                        // eslint-disable-next-line no-nested-ternary
                        playerStore.player.volume === 0 ||
                        playerStore.player.muted ? (
                          <BsIcons.BsVolumeMute
                            className={ButtonsClassNames.Icon}
                          />
                        ) : playerStore.player.volume < 0.51 ? (
                          <BsIcons.BsVolumeDown
                            className={ButtonsClassNames.Icon}
                          />
                        ) : (
                          <BsIcons.BsVolumeUp
                            className={ButtonsClassNames.Icon}
                          />
                        )
                      }
                      onClick={() => {
                        playerStore.player.toggleMute();
                      }}
                    />
                    <SliderWithTooltip
                      min={0}
                      max={1}
                      step={0.01}
                      className="VolumeBar"
                      value={
                        playerStore.player.muted ? 0 : playerStore.player.volume
                      }
                      tipFormatter={(volume: number) =>
                        `${Math.trunc(volume * 100)}%`
                      }
                      onChange={this.handleVolumeChange}
                      onAfterChange={this.handleVolumeChangeEnded}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Observer>
    );
  }
}

MusicPlayer.contextType = StoreContext;
