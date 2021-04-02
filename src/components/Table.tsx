import React from 'react';

interface Props {
  message?: string;
}

interface State {
  playlist: [
    {
      id: number;
      title: string;
      artist: string;
      album: string;
    }
  ];
}

export default class Table extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      playlist: [
        {
          id: 1,
          title: 'Shape Of My Heart',
          artist: 'Sting',
          album: 'TST',
        },
        // {
        //   id: 2,
        //   title: 'Wind Of Change',
        //   artist: 'Scorpions',
        //   album: 'CW',
        // },
      ],
    };
  }

  renderTableData() {
    const { playlist } = this.state;
    return playlist.map(
      (
        song: { id: number; title: string; artist: string; album: string }
        // index: number
      ) => {
        const { id, title, artist, album } = song;
        return (
          <tr key={id}>
            <td>{title}</td>
            <td>{artist}</td>
            <td>{album}</td>
          </tr>
        );
      }
    );
  }

  // renderTableHeader() {
  //   const { playlist } = this.state;
  //   const header = Object.keys(playlist[0]);
  //   return header.map((key) => {
  //     return <th key={playlist.id}>{key.toUpperCase()}</th>;
  //   });
  // }

  render() {
    return (
      <div>
        <table id="playlist">
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
