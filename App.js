import React, { Component } from 'react';
import Routes from './screen/route';
import NavigationService from './service/navigation.service';

export default class App extends Component {
  render() {
    return (
      <Routes
      ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }} />
    );
  }
};