import React, {Component} from 'react'

import {View, Text,StyleSheet, Button,TouchableOpacity, Image, Alert, ScrollView} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {ActionCreators} from '../actions'

class ViewDetails extends Component {
  constructor(props){
    super(props);

    this.state = {
        RecipeID : this.props.navigation.state.params.recipe.RecipeID,
        RecipeName : this.props.navigation.state.params.recipe.RecipeName,
        RecipeIngredient : this.props.navigation.state.params.recipe.RecipeIngredient,
        RecipeStep : this.props.navigation.state.params.recipe.RecipeStep,
        RecipeType : this.props.navigation.state.params.recipe.RecipeType,
      };
  }

  static navigationOptions = ({navigation}) => ({
      title: "View Recipe Details",

  });

  editClick(){
      this.props.navigation.navigate("EditDetails",{RecipeID:this.state.RecipeID,RecipeName:this.state.RecipeName,RecipeIngredient:this.state.RecipeIngredient, RecipeStep: this.state.RecipeStep, RecipeType: this.state.RecipeType})
  }


  render(){
    return <View style={styles.scene}>

              <Text style={styles.title}>Recipe Name:</Text>
              <Text style={styles.detail}>{this.state.RecipeName}</Text>
              <Text></Text>
              <Text style={styles.title}>Category : </Text>
              <Text style={styles.detail}>{this.state.RecipeType}</Text>
              <Text></Text>
              <Text style={styles.title}>Ingredients : </Text>

              <ScrollView style={styles.scrollIngredient}>
                <Text style={styles.detail}>{this.state.RecipeIngredient}</Text>
              </ScrollView>

              <Text></Text>

              <Text style={styles.title}>Steps : </Text>

              <ScrollView>
              <Text style={styles.detail}>{this.state.RecipeStep}</Text>

              </ScrollView>

              <View style={styles.viewBottom}>

                <Button style={styles.editButton} title='Edit Recipe Details' onPress={() => this.editClick()}/>
              </View>

            </View>
  }
}

const styles = StyleSheet.create({
  scene:{
    flexDirection: 'column',
    margin:10,
    flex:1
  },
  scrollIngredient:{
    flex:0,
    height:70
  },
  title:{
  marginTop:10,
    fontSize: 15,
    color: 'black',
    textDecorationLine: 'underline',
    fontWeight: 'bold'
  },
  detail:{
  marginTop:10,
    fontSize: 20,
    backgroundColor:'whitesmoke'
  },
  editButton:{
    fontSize: 24,
    padding: 5,

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
  return {responseRecipe: state.responseRecipe}
},mapDispatchToProps)(ViewDetails);
