import React, {Component} from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import Select from '@jetbrains/ring-ui/components/select/select';
import Panel from '@jetbrains/ring-ui/components/panel/panel';
import Button from '@jetbrains/ring-ui/components/button/button';

import styles from './app.css';

class Configuration {
  @observable selectedServer = null;
  @observable servers = null;

  async loadServers(dashboardApi) {
    this.servers = (await dashboardApi.loadServices('YouTrack')).
      filter(s => !!s.homeUrl);
    return this.servers;
  }

  selectServer = item => {
    this.selectServer = item.server;
  }
}

@observer
class ConfigurationView extends Component {
  async componentDidMount() {
    const servers = await this.store.loadServers(this.props.dashboardApi);
    this.store.selectServer = servers[0];
  }

  @observable store = new Configuration();

  render() {
    const {store} = this;

    return (
      <div className={styles.widget}>
        <Select
          data={store.servers?.map(server => ({server, key: server.id, label: server.name, description: server.homeUrl}))}
          loading={!store.servers}
          onSelect={store.selectServer}
          size={Select.Size.FULL}
          label="Select YouTrack server"
        />
        <Panel>
          <Button primary onClick={this.saveConfig}>{'Save'}</Button>
          <Button onClick={this.cancelConfig}>{'Cancel'}</Button>
        </Panel>
      </div>
    );
  }
}

export default ConfigurationView;
