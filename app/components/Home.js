import React, {Component} from 'react'

import ReactNative from 'react-native'
const{
  Alert,
  ScrollView,
  View,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  Text,
  Image,
  Picker,
  TouchableOpacity,
  ToastAndroid,
  Button
} = ReactNative

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {ActionCreators} from '../actions'


class Home extends Component {

  constructor(props){
    super(props);
    this.state = {searching: false, type: 'Vegetarian', type1: 'Vegetarian'}
  }

  componentDidMount(){

      this.searchTypePressed();

  }

  componentDidUpdate(){

    if(this.state.type !== this.state.type1){
      this.searchTypePressed();
      this.setState({type: this.state.type1});
    }
  }

  static navigationOptions = ({navigation}) => {

    return {
      title: 'RecipeApp',
    }
  };


  searchTypePressed(){

      this.setState({searching: true})

      this.props.getRecipesByType(this.state.type1).then((res) => {
        this.setState({searching: false, type: this.state.type1})
      });

  }


  recipes(){
    return Object.keys(this.props.searchedRecipes).map(key => this.props.searchedRecipes[key])
  }

  viewRecipeDetails(recipe){
    this.props.navigation.navigate("ViewDetails",{recipe: recipe});
  }


  render(){

    return<View style={{flex:1}}>

            <Picker
              menu={'dropdown'}
              style={{color: 'black',backgroundColor: 'lightblue', marginLeft: 0, paddingLeft: 15  }}
              selectedValue={this.state.type1}
              onValueChange={(itemValue, itemIndex) => {this.setState({type1: itemValue})}}>

              <Picker.Item label="Select Category: Vegetarian" value="Vegetarian"/>
              <Picker.Item label="Select Category: Fast Food" value="Fast Food"/>
              <Picker.Item label="Select Category: Healthy" value="Healthy"/>
              <Picker.Item label="Select Category: No-Cook" value="No-Cook"/>
              <Picker.Item label="Select Category: Make Ahead" value="Make Ahead"/>
            </Picker>

            <View style={{flex:1, marginBottom:20}}>
              <ScrollView>

                {
                  !this.state.searching && this.recipes().map((recipe) => {
                    return (

                        <TouchableHighlight key={recipe.RecipeID}
                          style={styles.resultRow}
                          onPress={ () => {this.viewRecipeDetails(recipe)}}
                          >

                            <View style={{flexDirection: 'row', flex:1}}>


                            <Text style={styles.resultText} numberOfLines = {1} ellipsizeMode ={'tail'}> {recipe.RecipeName} </Text>


                            </View>
                        </TouchableHighlight>

                    );
                  })
                }


                {
                  this.state.searching ? <View><Text style={{textAlign:'center',fontSize:27, lineHeight: 92,}}>Loading Recipes...</Text>
                                <Text style={{textAlign:'center',fontSize:15}}>(Please ensure you are Online)</Text>
                              </View> : null
                }

              </ScrollView>




                          <View style={styles.viewBottom}>

                            <Button style={styles.editButton} title='Create a New Recipe' onPress={()=>this.props.navigation.navigate("CreateRecipe")} />
                          </View>

            </View>



          </View>
    }
  }

const styles = StyleSheet.create({
  scene:{
    flex:1,
    marginTop:20,
  },
  resultRow:{
    height: 25,
    margin: 10,
    backgroundColor:'whitesmoke'
  },
  resultText:{
    fontSize: 20,
    flex:0.75
  },
  viewBottom:{
    position: 'relative',
    bottom: 0,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignSelf:'center',
  }
});

function mapDispatchToProps(dispatch){
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {searchedRecipes: state.searchedRecipes,}
},mapDispatchToProps)(Home);
