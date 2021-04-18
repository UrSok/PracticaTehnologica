/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
import { Observer } from 'mobx-react-lite';
import React from 'react';
import { QueueEntry, PlayingFromType, Repeat } from '../back-end/models';
import RootStore from '../back-end/store/RootStore';
import DataList from '../components/DataList';
import ScrollToTop from '../components/ScrollToTop';
import { PagesClassNames } from '../constants/ClassNames';
import { StoreContext } from '../utils/StoreContext';

class Queue extends React.Component {
  handleQueueEntryPlay = (musicId: number) => {
    const { queueStore, playerStore } = this.context as RootStore;
    queueStore.setPlayingByMusicId(musicId);
    playerStore.player.Play();
  };

  getCurrentlyPlaying = (): QueueEntry | undefined => {
    const { queueStore } = this.context as RootStore;
    const current = queueStore.currentQueueEntryOrQueueEntryPriority;
    return current;
  };

  getNextInQueueList = (): Array<QueueEntry> => {
    const { queueStore } = this.context as RootStore;
    const { priorityQueue } = queueStore;
    return priorityQueue;
  };

  getNextUpList = (): Array<QueueEntry> => {
    const { playerStore, queueStore } = this.context as RootStore;
    const result = new Array<QueueEntry>();
    const index = queueStore.currentQueueEntryIndex;

    if (index !== -1) {
      for (let i = index + 1; i < queueStore.queue.length; i++) {
        if (queueStore.queue[i]) {
          result.push(queueStore.queue[i]);
        }
      }
      if (playerStore.player.repeat != Repeat.All) return result;
      for (let i = 0; i < index; i++) {
        if (queueStore.queue[i]) {
          if (queueStore.queue[i]) result.push(queueStore.queue[i]);
        }
      }
    }
    return result;
  };

  priorityQueueExists = (): boolean => {
    const { queueStore } = this.context as RootStore;
    return !queueStore.isPriorityQueueEmpty;
  };

  render() {
    return (
      <div className={PagesClassNames.Queue} style={{ paddingTop: '30px' }}>
        <ScrollToTop />
        <div className="StickyHeader">
          <h1>Play Queue</h1>
        </div>

        <div className="SectionDivider">
          <span>Now Playing</span>
        </div>
        <Observer>
          {() => (
            <DataList
              data={this.getCurrentlyPlaying()}
              playingFromType={PlayingFromType.None}
              handleOnPlay={() => {}}
              filterHidden
              addedHidden
              showPlayingFrom
            />
          )}
        </Observer>

        {this.priorityQueueExists() && (
          <>
            <div className="SectionDivider">
              <span>Next In Queue</span>
            </div>
            <Observer>
              {() => (
                <DataList
                  data={this.getNextInQueueList()}
                  playingFromType={PlayingFromType.PriorityQueue}
                  handleOnPlay={() => {}}
                  filterHidden
                  addedHidden
                  showPlayingFrom
                />
              )}
            </Observer>
          </>
        )}

        <div className="SectionDivider">
          <span>Next Up</span>
        </div>
        <Observer>
          {() => (
            <DataList
              data={this.getNextUpList()}
              playingFromType={PlayingFromType.None}
              handleOnPlay={() => {}}
              filterHidden
              addedHidden
              showPlayingFrom
            />
          )}
        </Observer>
      </div>
    );
  }
}

Queue.contextType = StoreContext;

export default Queue;
