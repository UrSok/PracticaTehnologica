import { observable } from 'mobx';
import { Observer } from 'mobx-react';
import React from 'react';
import { Music } from '../back-end/models';

interface Props {
  musicList?: Music[];
}

// eslint-disable-next-line @typescript-eslint/ban-types
class Table extends React.Component<Props, {}> {
  // should check if there are any music and show nothing instead of table
  renderTableData() {
    const { musicList } = this.props;
    return musicList?.map((song) => {
      const { id, title, artists, album, addedString, durationString } = song;
      return (
        <tr key={id}>
          <td>{title}</td>
          <td>{artists?.join(',')}</td>
          <td>{album}</td>
          <td>{addedString}</td>
          <td>{durationString}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div className="Table">
        <table>
          <thead>
            <tr>
              <th>TITLE</th>
              <th>ARTIST</th>
              <th>ALBUM</th>
              <th>ADDED</th>
              <th>DURATION</th>
            </tr>
          </thead>
          <Observer>{() => <tbody>{this.renderTableData()}</tbody>}</Observer>
        </table>
      </div>
    );
  }
}

export default Table;
