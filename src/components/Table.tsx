import React from 'react';
import { MusicWithMetadata } from '../data-access/models/Music';
import '../scss/_Table.scss';

interface Props {
  musicList: MusicWithMetadata[];
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default class Table extends React.Component<Props, {}> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: Props) {
    super(props);
  }

  renderTableData() {
    const { musicList } = this.props;
    return musicList.map((song) => {
      const { id, title, artists, album } = song;
      return (
        <tr key={id}>
          <td>{title}</td>
          <td>{artists}</td>
          <td>{album}</td>
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
            </tr>
          </thead>
          <tbody>{this.renderTableData()}</tbody>
        </table>
      </div>
    );
  }
}