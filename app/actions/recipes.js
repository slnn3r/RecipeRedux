// the sub-ActionCreators

import * as types from './types'
import Api from '../lib/Api'

export function getRecipesByType(type){

  return (dispatch, getState) => {

    const params = {RecipeType: type}

    return Api.post(`/getRecipeRN.php`,params).then(resp => {

      dispatch(setSearchedRecipes({recipes: resp.recipe}));
    }).catch( (ex) => {
      console.log(ex);
    });
  }
}

export function setSearchedRecipes({recipes}){
  return {
    type: types.SET_SEARCHED_RECIPES,
    recipes,
  }
}

export function createRecipe(RecipeName, RecipeIngredient, RecipeStep, RecipeType){
  return (dispatch, getState) => {
    const params = {RecipeName: RecipeName, RecipeIngredient: RecipeIngredient, RecipeStep: RecipeStep, RecipeType: RecipeType}
    return Api.post(`/createRN.php`, params).then(resp => {

      dispatch(getAPIResponse({response: resp.status}));
    }).catch( (ex) => {
      console.log(ex);
    });
  }
}

export function editRecipe(RecipeID, RecipeName, RecipeIngredient, RecipeStep, RecipeType){
  return (dispatch, getState) => {
    const params = {RecipeID: RecipeID, RecipeName: RecipeName, RecipeIngredient: RecipeIngredient, RecipeStep: RecipeStep, RecipeType: RecipeType}
    return Api.post(`/updateRecipeRN.php`, params).then(resp => {

      dispatch(getAPIResponse({response: resp.status}));
    }).catch( (ex) => {
      console.log(ex);
    });
  }
}

export function deleteRecipe(RecipeID){
  return (dispatch, getState) => {
    const params = {RecipeID: RecipeID}
    return Api.post(`/deleteRecipeRN.php`, params).then(resp => {

      dispatch(getAPIResponse({response: resp.status}));
    }).catch( (ex) => {
      console.log(ex);
    });
  }
}

export function getAPIResponse({response}){
  return{
    type: types.GET_API_RESPONSE,
    response,
  }
}
