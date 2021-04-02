import React, { constructor } from 'react';
import '../scss/_MainLibrary.scss';
import * as BsIcons from 'react-icons/bs';
import PageTitle from '../components/PageTitle';
import IconButton from '../components/IconButton';
import '../scss/_Variables.scss';
import Table from '../components/Table';
// import '../scss/_Buttons.scss';

<script src="https://www.kryogenix.org/code/browser/sorttable/sorttable.js" />;

const handleStartSeeking = () => {
  console.log('aight');
};

// const rows = React.useMemo(() =>
//  [
//    {
//       title: 'Shape Of My Heart',
//       artist: 'Sting',
//       album: 'TST',
//    },
//     {
//       title: 'Wind Of Change',
//       artist: 'Scorpions',
//       album: 'CW',
//     },
//   ],
//  []
// )

// const columns = React.useMemo(
//   () => [
//     {
//       Header: 'TITLE',
//       accesor: 'title'
//     },
//     {
//       Header: 'ARTIST',
//       accesor: 'artist'
//     },
//     {
//       Header: 'ALBUM',
//       accesor: 'album'
//     }
//     ],
//   []
//   )

// const {
//   getTableProps,
//   getTableBodyProps,
//   headerGroups,
//   rows,
//   prepareRow,
// } = useTable({ columns, rows })

const MainLibrary: React.FC = () => {
  return (
    <div>
      <div className="Home">
        <div
          style={{
            top: '30px',
            position: 'sticky',
            backgroundColor: '#44475a',
          }}
        >
          <PageTitle PageName="Main Library" />
        </div>

        <div id="input-container">
          <IconButton
            icon={<BsIcons.BsSearch className="icon" />}
            onClick={handleStartSeeking}
          />
          <input
            className="h-search"
            type="text"
            placeholder="Filter"
            value=""
            // onKeyUp={myFunction()}
          />
          {/* <table>
            <thead>
              <tr>
                {this.props.titles.map((title) => (
                  <th key={title}>{title}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {this.props.rows.map((row, i) =>
                <tr key={i}>
                  {row.map((col, j) =>
                    <td key={j}>{col}</td>
                  )}
                </tr>
              )}
            </tbody>
          </table> */}

          <table>
            <thead>
              <tr>
                <th>TITLE</th>
                <th>ARTIST</th>
                <th>ALBUM</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Shape Of My Heart</td>
                <td>
                  <a href="http">Sting</a>
                </td>
                <td>
                  <a href="http">TST</a>
                </td>
              </tr>
              <tr>
                <td>Shape Of My Heart</td>
                <td>
                  <a href="http">Sting</a>
                </td>
                <td>
                  <a href="http">TST</a>
                </td>
              </tr>
              <tr>
                <td>Shape Of My Heart</td>
                <td>
                  <a href="http">Sting</a>
                </td>
                <td>
                  <a href="http">TST</a>
                </td>
              </tr>
              <tr>
                <td>Wind Of Change</td>
                <td>
                  <a href="http">Scorpions</a>
                </td>
                <td>
                  <a href="http">CW</a>
                </td>
              </tr>
              <tr>
                <td>Wind Of Change</td>
                <td>
                  <a href="http">Scorpions</a>
                </td>
                <td>
                  <a href="http">CW</a>
                </td>
              </tr>
              <tr>
                <td>Wind Of Change</td>
                <td>
                  <a href="http">Scorpions</a>
                </td>
                <td>
                  <a href="http">CW</a>
                </td>
              </tr>
              <tr>
                <td>Wind Of Change</td>
                <td>
                  <a href="http">Scorpions</a>
                </td>
                <td>
                  <a href="http">CW</a>
                </td>
              </tr>
              <tr>
                <td>Wind Of Change</td>
                <td>
                  <a href="http">Scorpions</a>
                </td>
                <td>
                  <a href="http">CW</a>
                </td>
              </tr>
              <tr>
                <td>Wind Of Change</td>
                <td>
                  <a href="http">Scorpions</a>
                </td>
                <td>
                  <a href="http">CW</a>
                </td>
              </tr>
              <tr>
                <td>Wind Of Change</td>
                <td>
                  <a href="http">Scorpions</a>
                </td>
                <td>
                  <a href="http">CW</a>
                </td>
              </tr>
              <tr>
                <td>Wind Of Change</td>
                <td>
                  <a href="http">Scorpions</a>
                </td>
                <td>
                  <a href="http">CW</a>
                </td>
              </tr>
              <tr>
                <td>Wind Of Change</td>
                <td>
                  <a href="http">Scorpions</a>
                </td>
                <td>
                  <a href="http">CW</a>
                </td>
              </tr>
              <tr>
                <td>Wind Of Change</td>
                <td>
                  <a href="http">Scorpions</a>
                </td>
                <td>
                  <a href="http">CW</a>
                </td>
              </tr>
            </tbody>
          </table>
          <Table />
        </div>
      </div>
    </div>
  );
};

// function sort(this: any, colName: string) {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   this.items.sort((a: any, b: any) =>
//     // eslint-disable-next-line no-nested-ternary
//     a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0
//   );
// }

export default MainLibrary;
