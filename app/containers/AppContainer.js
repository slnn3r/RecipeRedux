import React, {Component} from 'react'

import {connect} from 'react-redux'
import {ActionCreators} from '../actions'
import {bindActionCreators} from 'redux'

import NavigationContainer from './NavigationContainer'

import { StackNavigator } from 'react-navigation';


   // smart component class
   class AppContainer extends Component{

     constructor(props) {
        super(props);
      }

      render(){
        return <NavigationContainer {...this.props}/>
      }

   }

   function mapStateToProps(state){
     return {navigation: state.navigationReducer};
   }

   function mapDispatchToProps(dispatch){
     return bindActionCreators(ActionCreators, dispatch);
   }

   export default connect(mapStateToProps,mapDispatchToProps)(AppContainer);
