/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
import { observer } from 'mobx-react';
import React from 'react';
import { QueueEntry, Repeat, QueueEntryState } from '../back-end/models';
import RootStore from '../back-end/store/RootStore';
import Button from '../components/Button';
import DataList from '../components/DataList';
import ScrollToTop from '../components/ScrollToTop';
import StickyHeader from '../components/StickyHeader';
import { PagesClassNames } from '../constants/ClassNames';
import { StoreContext } from '../utils/StoreContext';

const Queue = observer(
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
        if (
          playerStore.player.repeat != Repeat.All &&
          playerStore.player.repeat != Repeat.Track
        )
          return result;
        for (let i = 0; i < index; i++) {
          if (queueStore.queue[i]) {
            if (queueStore.queue[i]) result.push(queueStore.queue[i]);
          }
        }
      }
      return result;
    };

    isPriorityQueueVisible = (): boolean => {
      const { queueStore } = this.context as RootStore;
      if (
        queueStore.priorityQueue.length === 1 &&
        queueStore.priorityQueue[0].state === QueueEntryState.Playing
      )
        return false;
      return !queueStore.isPriorityQueueEmpty;
    };

    render() {
      const currentlyPlaying = this.getCurrentlyPlaying();
      const priorityQueueList = this.getNextInQueueList();
      const nextUpList = this.getNextUpList();
      return (
        <>
          <StickyHeader title="Play Queue" className="StickyHeader" />

          <div className={PagesClassNames.Queue}>
            <ScrollToTop />
            <h1 className="InitialHeader">Play Queue</h1>

            <div className="SectionDivider">
              <span>Now Playing</span>
            </div>
            <DataList
              data={currentlyPlaying}
              filterHidden
              addedHidden
              showPlayingFrom
            />

            {this.isPriorityQueueVisible() && (
              <>
                <div className="SectionDivider SectionDividerWithButtons">
                  <span>Next In Queue</span>
                  <Button
                    className="ClearQueueButton"
                    text="Clear"
                    onClick={() => {
                      const { queueStore } = this.context as RootStore;
                      queueStore.clearPriorityQueue();
                    }}
                  />
                </div>
                <DataList
                  data={priorityQueueList}
                  priorityQueue
                  filterHidden
                  addedHidden
                  headerHidden
                  showPlayingFrom
                />
              </>
            )}
            {nextUpList.length > 0 && (
              <>
                <div className="SectionDivider">
                  <span>Next Up</span>
                </div>
                <DataList
                  data={this.getNextUpList()}
                  filterHidden
                  addedHidden
                  headerHidden
                  showPlayingFrom
                />
              </>
            )}
          </div>
        </>
      );
    }
  }
);

Queue.contextType = StoreContext;

export default Queue;
