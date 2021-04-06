import React from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Scrollbars } from 'rc-scrollbars';
import * as Ioios from 'react-icons/io';
import { PathData, PagesData } from './constants/RoutesInfo';
import './App.global.scss';
import Home from './pages/Home';
import MusicPlayer from './components/MusicPlayer';
import RecentlyPlayed from './pages/RecentlyPlayed';
import MainLibrary from './pages/MainLibrary';
import Queue from './pages/Queue';
import Navigation from './utils/Navigation';
import IconButton from './components/IconButton';
import Settings from './pages/Settings';
import LibraryManager from './back-end/managers/LibraryMananger';
import { AppClassNames, ButtonsClassNames } from './constants/ClassNames';
import MusicManager from './back-end/managers/MusicManager';
import FirstLaunchWindow from './components/FirstLaunchWindow';

interface Props {
  history: any;
  location: any;
  match: any;
}
interface State {
  firstLaunch: boolean;
}
class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      firstLaunch: false,
    };
  }

  componentDidMount() {
    this.isFirstLaunch();
  }

  isFirstLaunch = async () => {
    // change later to use db settings for that
    const libraries = await LibraryManager.instance.getAll();
    if (libraries.length === 0) {
      this.setState({
        firstLaunch: true,
      });
    } else {
      this.setState({
        firstLaunch: false,
      });
    }
    const { firstLaunch } = this.state;
    if (!firstLaunch) {
      LibraryManager.instance.scanAllPaths();
    }
  };

  render() {
    const { history } = this.props;
    const { firstLaunch } = this.state;
    if (!Navigation.history) {
      Navigation.init(history);
      Navigation.replace(PathData.Home);
    }
    // console.log(history);
    return (
      <div className={AppClassNames.Main}>
        {firstLaunch ? (
          <FirstLaunchWindow onResult={this.isFirstLaunch} />
        ) : null}
        <ProSidebar>
          <Menu iconShape="round">
            {PagesData.map((item) => {
              const isActive = Navigation.currentLocationIs(item.path);
              return (
                <MenuItem
                  key={item.key}
                  active={isActive}
                  icon={isActive ? item.iconActive : item.icon}
                  onClick={() => Navigation.push(item.path)}
                />
              );
            })}
          </Menu>
        </ProSidebar>
        <div className={AppClassNames.MainContent}>
          <div className={AppClassNames.HeaderBar}>
            <IconButton
              icon={<Ioios.IoIosArrowBack className={ButtonsClassNames.Icon} />}
              onClick={() => Navigation.goBack()}
              disabled={Navigation.isFirstVisitedLocation()}
            />
            <IconButton
              icon={
                <Ioios.IoIosArrowForward className={ButtonsClassNames.Icon} />
              }
              onClick={() => Navigation.goForward()}
              disabled={Navigation.isLastVisitedLocation()}
            />
          </div>
          <Scrollbars autoHide>
            <div className={AppClassNames.Content}>
              <Switch>
                <Route path={PathData.Home} exact component={Home} />
                <Route
                  path={PathData.RecentlyPlayed}
                  component={RecentlyPlayed}
                />
                <Route path={PathData.MainLibrary} component={MainLibrary} />
                <Route path={PathData.Settings} component={Settings} />
                <Route path={PathData.Queue} component={Queue} />
              </Switch>
            </div>
          </Scrollbars>
          <MusicPlayer />
        </div>
      </div>
    );
  }
}

export default withRouter(App);
