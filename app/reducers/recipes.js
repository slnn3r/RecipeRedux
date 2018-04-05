// the sub-reducer

 import createReducer from '../lib/createReducer'
 import * as types from '../actions/types'

 // have some connection with ActionCreators setSearchedRecipe function
 // it create a new state then return it
  export const searchedRecipes = createReducer({}, {

    // check the types
   [types.SET_SEARCHED_RECIPES](state =[], action) {
     let newState = {}

     // call the actioncreator, inside the recipes state, store each recipe into the newstate
     action.recipes.forEach((recipe) => {
       newState[recipe.RecipeID] = recipe;
     });

     return newState;
   },
 });

 export const APIResponse = createReducer({}, {
   [types.GET_API_RESPONSE](state=[], action) {

     console.log("lalal");
     console.log(action.response);

     return action.response;


   }
 });
