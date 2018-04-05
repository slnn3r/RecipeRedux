import React, {Component} from 'react'

import {
  View,
  Text,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  Picker,
  TextInput,
  ToastAndroid,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {NavigationActions} from 'react-navigation';

import {ActionCreators} from '../actions'

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'


const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'Home'})
    ] });


class CreateRecipe extends Component {

  constructor(props){
    super(props);

    this.state = {RecipeType: 'Vegetarian', RecipeName: '', RecipeIngredient:'',RecipeStep:'', creating:false};
  }

  static navigationOptions = ({navigation}) => ({
    title: 'Create New Recipe',
  });

  inputValidation(){
    if(this.state.RecipeName == ''){
      ToastAndroid.showWithGravity("Please enter a Recipe Name.", ToastAndroid.SHORT,ToastAndroid.BOTTOM);
      return false;
    }else if(this.state.RecipeIngredient == ''){
      ToastAndroid.showWithGravity("Please enter the Ingredient.", ToastAndroid.SHORT,ToastAndroid.BOTTOM);
      return false;
    }else if(this.state.RecipeStep == ''){
      ToastAndroid.showWithGravity("Please enter the Step.", ToastAndroid.SHORT,ToastAndroid.BOTTOM);
      return false;
    }
    return true;
  }


  submitCreate(){
    if(this.inputValidation()){

      Alert.alert(
          'Create Recipe', 'Confirm Create the Recipe?',
            [{text: 'Confirm',

              onPress:()=>{
                  this.setState({creating: true});

                  this.props.createRecipe(this.state.RecipeName,this.state.RecipeIngredient,this.state.RecipeStep,this.state.RecipeType).then((res) => {

                    if(this.props.APIResponse==1){
                      ToastAndroid.showWithGravity("Recipe have Created.", ToastAndroid.SHORT,ToastAndroid.BOTTOM);
                      this.props.navigation.dispatch(resetAction);
                    }else{
                      Alert.alert("Recipe Create Failed, Please Check the Internet Connection.");
                    }
                  });

            }

            },
            {text: 'Cancel'}],
          {cancellable: true}
      );

    }
  }

  resetInput(){
    this.setState({RecipeType:'Vegetarian'})
    this.setState({RecipeName:''})
    this.setState({RecipeIngredient:''})
    this.setState({RecipeStep:''})
  }

  render(){
    return<View style={styles.scene}>

      {
        this.state.creating ? <View><Text style={{textAlign:'center',fontSize:27, lineHeight: 92,}}>Creating Recipes...</Text>
                                    <Text style={{textAlign:'center',fontSize:15}}>(Please ensure you are Online)</Text>
                                    <Text></Text>
                                    <Text style={{textAlign:'center',fontSize:15}}>Note: If System Stuck in this Screen, Please Click Back Button and Try Again.</Text>
                              </View> : <KeyboardAwareScrollView>

                                            <Text style={styles.title}>Name: </Text>
                                            <TextInput returnKeyType='done'
                                              style={styles.textInput}
                                              value={this.state.RecipeName}
                                              placeholder="eg. Boiled Water"
                                              maxLength = {40}
                                              onChangeText={(RecipeName)=> this.setState({RecipeName})}/>

                                            <Text style={styles.title}>Type: </Text>
                                            <Picker style={{alignItems:'center'}} menu={'dropdown'} selectedValue={this.state.RecipeType}
                                              onValueChange={(itemValue, itemIndex) => this.setState({RecipeType: itemValue})}>
                                              <Picker.Item label="Vegetarian" value="Vegetarian"/>
                                              <Picker.Item label="Fast Food" value="Fast Food"/>
                                              <Picker.Item label="Healthy" value="Healthy"/>
                                              <Picker.Item label="No-Cook" value="No-Cook"/>
                                              <Picker.Item label="Make Ahead" value="Make Ahead"/></Picker>



                                            <Text style={styles.title}>Ingredient: </Text>
                                            <TextInput
                                              returnKeyType='done'
                                              style={styles.textInput}
                                              value={this.state.RecipeIngredient}
                                              placeholder="eg. Water"
                                              onChangeText={(RecipeIngredient)=> this.setState({RecipeIngredient})}
                                            />


                                            <Text style={styles.title}>Step(s): </Text>
                                            <TextInput
                                              value={this.state.RecipeStep}
                                              style={{height:250}}
                                              placeholder="eg. 1) Pour the Water in a Kettle and boil it."
                                              onChangeText={(RecipeStep)=> this.setState({RecipeStep})}
                                              multiline = {true} numberOflines = {3}
                                            />

                                            <View style={styles.viewBottom}>
                                              <Button style={styles.button} title='Create Recipe' onPress={() => this.submitCreate()} />
                                              <Button style={styles.button} title='Reset' color='red' onPress={() => this.resetInput()} />
                                            </View>

                                        </KeyboardAwareScrollView>

      }

      </View>
  }
}


const styles = StyleSheet.create({
  scene:{
    margin:10,
    flex:1,
  },
  title:{
  marginTop:10,
    fontSize: 15,
    color: 'black',
    textDecorationLine: 'underline',
    fontWeight: 'bold'
  },
  button:{
    flexDirection: 'row',
    alignSelf: 'flex-end',
    position: 'relative',
    bottom: 0,
    margin:10
  },
  textInput: {
    height: 60,
    fontSize: 20,
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
  return {APIResponse: state.APIResponse}
},mapDispatchToProps)(CreateRecipe);
