import {RootStack} from '../containers/NavigationContainer'
import {NavigationActions} from 'react-navigation'

const initialState = RootStack.router.getStateForAction(NavigationActions.init())

export default (state = initialState, action) => {
  let newState = RootStack.router.getStateForAction(action, state)
  if(action.params && action.params.replace){
    newState.routes.splice(newState.index -1,1)
    newState.index--
  }

  newState.routes.forEach((route,i) => {
    if(!route.params) route.params = {}
    if(i===newState.params) route.params.active = true
    else route.params.active = false
  })
  return newState
}
