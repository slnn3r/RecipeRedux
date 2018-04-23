# **React Native Recipe Apps Architecture**

React Native Recipe Apps uses the Redux Architecture, [Redux is not that different from Flux. Overall it has same architecture, but Redux is able to cut some complexity corners by using functional composition where Flux uses callback registration.](https://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux) In short, with the help of Redux, we are able to achieve better controls over the state of our JavaScript application, enable better management of data which allow the debugging become easier and also allow us to have better control on deciding how the application functions and what representation to be shown.

## **Redux Architecture**

If you are not familar with Redux Architecture, you would see a lot of new character with their own  unique role. Unlike, the common architecture such as Model-View-Control (MVC), Redux works differently with its own unique way. The main character of Redux include Components, Actions and Reducers.

![RN][Redux]

**(Figure 1: The figure above illustrate the basic Redux structure)**

## **Components**

Components are responsible for display the views, there are the JavaScript components or JavaScript classes within the project. Components are categorized into Root, Smart and Dump Component.

### 1. Root component

In this project, there is a root component (`../App.js`) which is the highest level of component in the component hierarchy. It mainly responsible to ensure all of the Redux character in the project to able to work together. Within a root component, it defines Store and View Layer Binding.

Code Snippet of the Root component:

    ...
    // The Store
    function configureStore(initialState){
      const enhancer = compose(
        applyMiddleware(
          thunkMiddleware,
          loggerMiddleware,
        ),
      );
      return createStore(reducer, initialState,enhancer);
    }

    // The Store
    const store = configureStore({});

    ...
    const App = () => (
      // The View Layer Binding
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );

#### 1.1 Store

The store responsible to telling the application what reducer to use upon request, and brings together the view layer binding and the views. Any changes of state within the application will be made by a store.

#### 1.2 View Layer Binding

The view layer binding help to create connection among the store and the views which ensure that all of the views (smart and dump components) are able to connect to the store. View layer binding of the application is made possible with the Provider and Connect.

##### 1.2.1 Provider

Provider is only defined once in the Root Component. It wrapped around the component tree so that it easy for the root component’s children to connect to the store using `connect()` function.

Code Snippet of Provider:

    const App = () => (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );

##### 1.2.2 Connect

Connect is defined in both Smart and Dump Components. If a component wants to get state updates, it wraps itself using `connect()` function. Then the `connect()` function will set up all the wiring for it.

Code Snippet of Connect:

    // Connect function in Smart Component
    export default connect(mapStateToProps,mapDispatchToProps)(AppContainer);

---
    // Connect function in Dump Component
    export default connect((state) => {
      return {APIResponse: state.APIResponse}
    },mapDispatchToProps)(CreateRecipe);




### 2. Smart components

In this project, the `../containers/AppContainer.js` is the Smart Compoents. It is responsible of the Actions in the application. Whenever a dump component have trigger an action, it will pass a function through `props`. Then, the dumb component can just treat that as a callback.

### 3. Dumb components

In this project, all the javescript files in the `components` folder are the dump components. Dump components responsible to define the user interface which the user would see and interact with on the screen and define actions to be taken upon request.

## **Action creator**

In this project, the `recipes.js` in the `actions` folder is the action creator that describe the function implementation of the action that would triggered by user. Whenever the application want to change its state, it will shoot off an action. The application call the action creator knowing basically what action it want to send, and then the action creator formats the action in a way that the rest of the system can understand.

## **Reducers**

When the store needs to know how an action changes the state, it will ask the reducers. Reducer does not work independently. In this project, there are root reducer and sub-reducer that work together to respond the new state to the store.

### 1. Root Reducer

In this project, `index.js` in the `reducers` folder is the root reducer. It responsible to slices the state up based on the state object’s keys. It passes each slice of state to the reducer that knows how to handle it.

### 2. Sub-Reducer

In this project, `recipe.js` in the `reducers` folder is the sub-reducer. It does not change the state that has been passed in to them. Instead, they make a copy and make all their changes on the copy. Then, the sub-reducers pass their copies back to the root reducer, which pastes the copies together to form the updated state object. Lastly, the root reducer sends the new state object back to the store, and the store makes it the new official state.

## **Server**

Server of the application is the source of data. In this project, the server is using a webhosting service (000Webhost - PHPMySQL Database) to create, retrieve, update and delete of the Recipe data.

**Redux Flow Example of React Native Recipe Apps:**

1. In the main screen `(../components/home.js)` when the application load. The application will trigger an action to retrieve Recipe data from database and display it on the screen.

        ...
        this.props.getRecipesByType(this.state.type1).then((res) => {
              this.setState({searching: false, type: this.state.type1})
        });

2. So The upon the action request from the view `(../components/home.js)`. The action creator `(../actions/recipe.js)` formats it and returns back to the view.

        ...
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

3. The action is dispatched automatically to store as `bindActionCreators()` function was setup in the dump components `(../components/home.js)`.

        ...
        function mapDispatchToProps(dispatch){
          return bindActionCreators(ActionCreators, dispatch);
        }

        export default connect((state) => {
          return {searchedRecipes: state.searchedRecipes,}
        },mapDispatchToProps)(Home);



4. Now, the store in the root component (`../App.js`) receives the action from the dump components. Then, it sends the current state tree and the action to the root reducer .

5. The root reducer (`../reducers/index.js`) cuts apart the state tree into slices. Then it passes each slice to the sub-reducer (`../reducers/recipe.js`) that knows how to handle it.

        export default combineReducers(Object.assign(
          // pass the slide to the sub-reducer defined below
          recipesReducer,
        ));



6. The sub-reducer copies the slice and makes changes to the copy. It returns the copy of the slice to the root reducer.

        export const searchedRecipes = createReducer({}, {

         [types.SET_SEARCHED_RECIPES](state =[], action) {
           let newState = {}

           action.recipes.forEach((recipe) => {
             newState[recipe.RecipeID] = recipe;
           });

           // returns the copy of the slice to the root reducer
           return newState;
         },
        });

7. Once all of the sub-reducers have returned their slice copies, the root reducer pastes all of them together to form the whole updated state tree, which it returns to the store. The store replaces the old state tree with the new one.

8. Now, the store tells the view layer binding that there’s new state and send over the new state to it.

9. The view layer binding triggers a rerender toward the main screen (../components/home.js).

10. Now, the Recipe Data is displayed on the screen.

**Highlights:**

##### **Thinking in Redux**

###### **1. Actions = Controller**

Think of the actions as the controller. Whenever the application want something to happen such as load some data, the application will have to dispatch an action.

###### **2. Reducer = Model**
Reducer is a little bit similar like Model. The reducers will be in charge of holding the current state of your application such as information loaded from the api. It will also be the part that decides what to do when an action is called. While in Model-View-Controller (MVC) you might have a model with the `setName()` function, with Redux you would have a reducer handle an action to set the name in the state.

###### **3. Components = Views**

Components display the information that they get from the state. In this project, you can see there are Smart and Dump components. The Dump components just for the presentational purpose and the Smart component handle all of the actions and state changes.

[Redux]: https://cdn-images-1.medium.com/max/2000/1*M9d5RTuCdIQUhJuuJY10sw.png
