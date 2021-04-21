/* eslint-disable class-methods-use-this */
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
import log from 'electron-log';
import toast from 'react-hot-toast';
import IconButton from './IconButton';
import noAlbumArt from '../../assets/no-album-art.png';
import Navigation from '../utils/Navigation';
import { ButtonsClassNames } from '../constants/ClassNames';
import { StoreContext } from '../utils/StoreContext';
import RootStore from '../back-end/store/RootStore';
import { Repeat } from '../back-end/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

interface State {
  seeking: boolean;
  launch: boolean;
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
      launch: true,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref = async (player: any) => {
    const { playerStore } = this.context as RootStore;
    await playerStore.setReactPlayer(player);
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
    const result = playerStore.player.togglePlaying();
    if (!result) {
      toast.error('Queue is empty!');
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

  animate(back?: boolean) {
    const musicInfo = document.querySelector('.MusicInfoPlayerBar');
    musicInfo?.animate(
      [
        // keyframes
        { transform: `translateX(${back ? '-60px' : '60px'})`, opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 },
      ],
      {
        // timing options
        easing: 'ease',
        duration: 300,
        iterations: 1,
      }
    );
  }

  handleError(reason: any) {
    const { playerStore, queueStore } = this.context as RootStore;
    toast.error(`Couldn't play the current file.`);
    log.error(reason);
    if (queueStore.currentQueueEntryOrQueueEntryPriority)
      queueStore.removeQueueEntry(
        queueStore.currentQueueEntryOrQueueEntryPriority
      );
    if (queueStore.isQueueEmpty && queueStore.isPriorityQueueEmpty)
      playerStore.player.nextSong(true);
  }

  render() {
    const { playerStore } = this.context as RootStore;
    const { launch } = this.state;
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
                onError={this.handleError}
                onProgress={this.handleProgress}
                onEnded={() => {
                  playerStore.player.nextSong();
                }}
                onReady={() => {
                  if (launch) {
                    playerStore.player.seekToSavedProgress();
                    this.setState({ launch: false });
                  }
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
                      const result = playerStore.player.prevSong();
                      if (result) {
                        this.animate(true);
                      } else {
                        toast.error('Queue is empty!');
                      }
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
                      const result = playerStore.player.nextSong(true);
                      if (result) {
                        this.animate();
                      } else {
                        toast.error('Queue is empty!');
                      }
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
                <div className="MusicInfo MusicInfoPlayerBar">
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
                    onClick={Navigation.toggleQueuePage}
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
