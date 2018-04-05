import React, {Component} from 'react'

import {connect} from 'react-redux'

import {addNavigationHelpers, StackNavigator } from 'react-navigation';

import Home from '../components/Home'
import ViewDetails from '../components/ViewDetails'
import EditDetails from '../components/EditDetails'
import CreateRecipe from '../components/CreateRecipe'

export const RootStack = StackNavigator({Home: {screen: Home}, ViewDetails: {screen: ViewDetails}, EditDetails: {screen: EditDetails}, CreateRecipe: {screen: CreateRecipe}}, {initialRouteName: 'Home'});

class NavigationContainer extends Component{

  render(){

    return(

      <RootStack navigationState={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.navigation,
      })} />
    )

  }
}

const mapDispatchToProps =state => {
  return {navigationState: state.navigationReducer};
}

export default connect(mapDispatchToProps)(NavigationContainer);
