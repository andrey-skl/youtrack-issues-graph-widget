import React, {Component} from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import Select from '@jetbrains/ring-ui/components/select/select';
import Panel from '@jetbrains/ring-ui/components/panel/panel';
import Button from '@jetbrains/ring-ui/components/button/button';

import styles from './app.css';

const COLOR_OPTIONS = [
  {key: 'black', label: 'Black'},
  {key: 'red', label: 'Red'},
  {key: 'blue', label: 'Blue'}
];

class Configuration {
  @observable selectedServer = null;
}

export default @observer class ConfigurationView extends Component {
  config = new Configuration();

  render() {
    return (
      <div className={styles.widget}>
        <Select
          data={COLOR_OPTIONS}
          onChange={this.changeColor}
          label="Select text color"
        />
        <Panel>
          <Button primary onClick={this.saveConfig}>{'Save'}</Button>
          <Button onClick={this.cancelConfig}>{'Cancel'}</Button>
        </Panel>
      </div>
    );
  }
}
