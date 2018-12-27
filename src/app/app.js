import DashboardAddons from 'hub-dashboard-addons';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import EmptyWidget, {EmptyWidgetFaces} from '@jetbrains/hub-widget-ui/dist/empty-widget';
import {observable} from 'mobx';

import 'file-loader?name=[name].[ext]!../../manifest.json'; // eslint-disable-line import/no-unresolved
import styles from './app.css';
import sayHello from './say-hello';
import Configuration from './configuration';

class Widget extends Component {
  static propTypes = {
    dashboardApi: PropTypes.object,
    registerWidgetApi: PropTypes.func
  };

  constructor(props) {
    super(props);
    const {registerWidgetApi, dashboardApi} = props;

    this.state = {
      isConfiguring: false,
      selectedColor: null
    };

    registerWidgetApi({
      onConfigure: () => this.setState({isConfiguring: true})
    });

    this.initialize(dashboardApi);
  }

  @observable title = ''; // MobX example

  initialize(dashboardApi) {
    dashboardApi.readConfig().then(config => {
      if (!config) {
        return;
      }
      this.setState({selectedColor: config.selectedColor});
    });
  }

  saveConfig = async () => {
    const {selectedColor} = this.state;
    await this.props.dashboardApi.storeConfig({selectedColor});
    this.setState({isConfiguring: false});
  };

  cancelConfig = async () => {
    this.setState({isConfiguring: false});
    await this.props.dashboardApi.exitConfigMode();
    this.initialize(this.props.dashboardApi);
  };

  changeColor = selectedColor => this.setState({selectedColor});

  render() {
    const {selectedColor, isConfiguring} = this.state;

    if (isConfiguring) {
      return (
        <Configuration
          onSave={this.saveConfig}
          onCancel={this.cancelConfig}
          dashboardApi={this.props.dashboardApi}
        />
      );
    }

    return (
      <div className={styles.widget}>
        {selectedColor
          ? <h1 style={{color: selectedColor.key}}>{sayHello()}</h1>
          : (
            <EmptyWidget
              face={EmptyWidgetFaces.JOY}
              message={'Select "Edit..." option in widget dropdown to configure text color'}
            />
          )}
      </div>
    );
  }
}

DashboardAddons.registerWidget((dashboardApi, registerWidgetApi) =>
  render(
    <Widget
      dashboardApi={dashboardApi}
      registerWidgetApi={registerWidgetApi}
    />,
    document.getElementById('app-container')
  )
);
