/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import Darwin from 'national-rail-darwin';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Spinner from './Spinner';
import TrainDepartureInfo from './TrainDepartureInfo';

import config from './config';

const rail = new Darwin(config.darwinApiKey);

class Departures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departureData: [],
      departures: [],
      error: false,
      loading: true,
      title: props.title,
      subtitle: props.subtitle,
      station: props.station,
      destination: props.destination
    };
  }

  loadData() {
    const temp = [];
    this.setState({ loading: true });

    rail.getDepartureBoard(this.state.station, {
      rows: 5,
      destination: this.state.destination
    }, (err, response) => {
      if (err) {
        this.setState({ error: true });
      } else {
        response.trainServices.map((departure, i) => {
          temp.push(<TrainDepartureInfo key={i} departure={departure} />);
        });

        this.setState({
          loading: false,
          departures: temp
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      error: false,
      title: nextProps.title,
      subtitle: nextProps.subtitle,
      station: nextProps.station,
      destination: nextProps.destination
    }, () => {
      this.loadData();
    });
  }

  componentDidMount() {
    this.loadData();
    this.timer = setInterval(() => {
      this.loadData();
    }, 120000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <Paper style={{ marginBottom: '1rem' }}>
        <List style={{ padding: 0 }}>
          <ListItem
            primaryText={this.state.title}
            secondaryText={this.state.subtitle}
            disabled={true}
          />
        {this.state.loading ? <Spinner error={this.state.error} /> : this.state.departures}
        </List>
      </Paper>
    );
  }
}

export default Departures;
