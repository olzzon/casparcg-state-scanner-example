import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//Apollo-Client Graphql implementation:
import ApolloClient from "apollo-client";
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from "graphql-tag";

//Constants:
const CCG_SERVER_IP = "localhost";

//Create GraphlQL queries 
//(usually placed in separate .js file)

const channelQuery = {
  query: gql`
    query {
      channels {
        layers {
          foreground {
            name
            path
            length
            loop
            paused
          }
          background {
            name
            path
            length
            loop
          }
        }
      }
    }`
};

const channelSubscribe = {
  query: gql`
    subscription {
      channels {
        layers {
          foreground {
            name
            path
            length
            loop
            paused
          }
          background {
            name
            path
            length
            loop
          }
        }
      }
    }`
};

const timeLeftSubscribe = {
  query: gql`
    subscription {
      timeLeft {
        timeLeft
      }
    }`
};
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ccgChannelsRendered: [],
      ccgTimeLeftRendered: []
    };
    this.renderChannels = this.renderChannels.bind(this);
    this.renderTimeLeft = this.renderTimeLeft.bind(this);
  }

  componentDidMount() {
    // Initialize GraphQL with Query and Subscription.
    // You can use WebsocketLink for both Query and Subscriptions

    const wsLink = new WebSocketLink({
      uri: "ws://" + CCG_SERVER_IP + ":5254/graphql",
      options: {
        reconnect: true
      }
    });

    this.ccgStateConnection = new ApolloClient({
        link: wsLink,
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'cache-and-network',
                errorPolicy: 'ignore',
            },
            query: {
                fetchPolicy: 'network-only',
                errorPolicy: 'all',
            },
            mutate: {
                errorPolicy: 'all'
            }
        }
    });

    //Initial Query state of CasparCG.
    //As subscription does not give a default state.
    this.ccgStateConnection.query(channelQuery)
    .then((response) => {
      this.setState({ ccgChannelsRendered: this.renderChannels(response.data.channels)});
    });

    //Subscribe to CasparCG-State changes:
    const _this2 = this; //reference for this. As subscribe creates new this

    this.ccgStateConnection.subscribe(channelSubscribe)
    .subscribe({
      next(response) {
        _this2.setState({ ccgChannelsRendered: _this2.renderChannels(response.data.channels)});
      },
      error(err) { console.error('Subscription error: ', err); },
    });

    //Subscribe timer countdown on CastarCG-State:
    this.ccgStateConnection.subscribe(timeLeftSubscribe)
    .subscribe({
      next(response) {
        _this2.setState({ccgTimeLeftRendered: _this2.renderTimeLeft(response.data.timeLeft)});
      },
      error(err) { console.error('Subscription error: ', err); },
    });

  }

  renderChannels(channels) {
      return(
        <div>
          Foreground:
          <br/>
          Name: {channels[0].layers[9].foreground.name}
          <br/>
          Length: {channels[0].layers[9].foreground.length}
        </div>
      )
  }

  renderTimeLeft(timeLeft) {
    return(
      <div>
        TimeLeft: {timeLeft[0].timeLeft}
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Channel 1:
          </p>
          <div>
            {this.state.ccgChannelsRendered}
            <br/>
            {this.state.ccgTimeLeftRendered}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
