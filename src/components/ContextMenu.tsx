import * as React from 'react';
import { Item, ItemParams, Menu, Submenu } from 'react-contexify';
import * as IoIosIcons from 'react-icons/io';
import RootStore from '../back-end/store/RootStore';
import { StoreContext } from '../utils/StoreContext';

export const MENU_ID = 1;
class ContextMenu extends React.PureComponent {
  // eslint-disable-next-line class-methods-use-this
  handleQueueClick({ props }: ItemParams<any, any>) {
    const { musicId, context } = props;
    const { queueStore } = context as RootStore;
    queueStore.addPriorityQueue(musicId);
  }

  render() {
    return (
      <Menu id={MENU_ID} animation="slide" theme="dark">
        <Item onClick={this.handleQueueClick}>Add to Queue</Item>
        <Submenu
          label="Add to Playlist"
          arrow={<IoIosIcons.IoIosArrowForward className="Icon" />}
        >
          <Item>
            New Playlist
            <IoIosIcons.IoIosAdd className="Icon" />
          </Item>
        </Submenu>
      </Menu>
    );
  }
}
ContextMenu.contextType = StoreContext;

export default ContextMenu;
