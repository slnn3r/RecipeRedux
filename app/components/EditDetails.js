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
  ScrollView,
} from 'react-native'

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {NavigationActions} from 'react-navigation';

import {ActionCreators} from '../actions'

const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'Home'})
    ] });


class EditDetails extends Component {

  constructor(props){
    super(props);

    this.state = {
      RecipeID : this.props.navigation.state.params.RecipeID,
      RecipeName : this.props.navigation.state.params.RecipeName,
      RecipeIngredient : this.props.navigation.state.params.RecipeIngredient,
      RecipeStep : this.props.navigation.state.params.RecipeStep,
      RecipeType : this.props.navigation.state.params.RecipeType,
      deleting: false,
      updating: false,
    }
  }

  static navigationOptions = ({navigation}) => ({
    title: 'Edit Recipe Details',
  });


  inputValidation(){
    if(this.state.RecipeName == ''){
      ToastAndroid.showWithGravity("Recipe Name cannot be empty", ToastAndroid.SHORT,ToastAndroid.BOTTOM);
      return false;

    }else if(this.state.RecipeIngredient == ''){
      ToastAndroid.showWithGravity("Ingredient cannot be empty", ToastAndroid.SHORT,ToastAndroid.BOTTOM);
      return false;
    }else if(this.state.RecipeStep == ''){
      ToastAndroid.showWithGravity("Step cannot be empty", ToastAndroid.SHORT,ToastAndroid.BOTTOM);
      return false;
    }
    return true;
  }

  submitDelete(){

    Alert.alert(
          'Delete Recipe', 'Confirm Delete the Recipe?',

            [{text: 'Confirm', onPress:()=>{this.props.deleteRecipe(this.state.RecipeID).then((res) => {

              this.setState({deleting: true});

              if(this.props.APIResponse == 1){
                ToastAndroid.showWithGravity("Recipe have Deleted.", ToastAndroid.SHORT,ToastAndroid.BOTTOM);
                this.props.navigation.dispatch(resetAction);
              }else{
                Alert.alert("Recipe Delete Failed, Please Check the Internet Connection.");
              }
            });}
            },
            {text: 'Cancel'}],
          {cancellable: true}
    );
  }

  submitEdit(){

    if(this.inputValidation()){

      Alert.alert(
          'Edit Recipe', 'Confirm Edit the Recipe?',
            [{text: 'Confirm',

              onPress:()=>{

                  this.setState({updating: true});

                  this.props.editRecipe(this.state.RecipeID,this.state.RecipeName,this.state.RecipeIngredient,this.state.RecipeStep,this.state.RecipeType).then((res) => {
                    if(this.props.APIResponse == 1){
                      ToastAndroid.showWithGravity("Recipe have Updated.", ToastAndroid.SHORT,ToastAndroid.BOTTOM);
                      this.props.navigation.dispatch(resetAction);
                    }else{
                      Alert.alert("Recipe Edit Failed, Please Check the Internet Connection.");
                    }
                  });

            }

            },
            {text: 'Cancel'}],
          {cancellable: true}
      );

    }
  }

  render(){
    return(
      <View style={styles.scene}>

        {
          !this.state.updating && !this.state.deleting ? <KeyboardAwareScrollView>
                      <Text style={styles.title}>Name: </Text>
                      <TextInput returnKeyType='done'
                        style={styles.textInput}
                        value={this.state.RecipeName}
                        placeholder="Recipe Name"
                        maxLength = {40}
                        onChangeText={(RecipeName)=> this.setState({RecipeName})}/>

                      <Text style={styles.title}>Type: </Text>
                      <Picker style={{alignItems:'center'}} menu={'dropdown'} selectedValue={this.state.RecipeType}
                        onValueChange={(itemValue, itemIndex) => this.setState({RecipeType: itemValue})}>
                        <Picker.Item label="Vegetarian" value="Vegetarian"/>
                        <Picker.Item label="Fast Food" value="`Fast Food`"/>
                        <Picker.Item label="Healthy" value="Healthy"/>
                        <Picker.Item label="No-Cook" value="No-Cook"/>
                        <Picker.Item label="Make Ahead" value="Make Ahead"/></Picker>



                      <Text style={styles.title}>Ingredient: </Text>
                      <TextInput
                        returnKeyType='done'
                        style={styles.textInput}
                        value={this.state.RecipeIngredient}
                        placeholder="Enter Ingredient(s)"
                        onChangeText={(RecipeIngredient)=> this.setState({RecipeIngredient})}
                      />


                      <Text style={styles.title}>Step(s): </Text>
                      <TextInput
                        value={this.state.RecipeStep}
                        style={{height:250}}
                        placeholder="Enter Steps(s)"
                        onChangeText={(RecipeStep)=> this.setState({RecipeStep})}
                        multiline = {true} numberOflines = {3}
                      />

                      <View style={styles.viewBottom}>
                        <Button style={styles.button} title='Submit Edit' onPress={() => this.submitEdit()}  />
                        <Button style={styles.button} title='Delete Recipe' color='red' onPress={() => this.submitDelete()}  />
                      </View>

          </KeyboardAwareScrollView> : null

        }


        {
            this.state.updating ? <View><Text style={{textAlign:'center',fontSize:27, lineHeight: 92,}}>Editing Recipes...</Text>
                                        <Text style={{textAlign:'center',fontSize:15}}>(Please ensure you are Online)</Text>
                                        <Text></Text>
                                        <Text style={{textAlign:'center',fontSize:15}}>Note: If System Stuck in this Screen, Please Click Back Button and Try Again.</Text>
                                      </View> : null
        }

        {
            this.state.deleting ? <View><Text style={{textAlign:'center',fontSize:27, lineHeight: 92,}}>Deleting Recipes...</Text>
                                        <Text style={{textAlign:'center',fontSize:15}}>(Please ensure you are Online)</Text>
                                        <Text></Text>
                                        <Text style={{textAlign:'center',fontSize:15}}>Note: If System Stuck in this Screen, Please Click Back Button and Try Again.</Text>
                                      </View> : null
        }


      </View>
    );
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
    position: 'absolute',
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

// Redux thingy to link dump component to action, etc
function mapDispatchToProps(dispatch){
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect((state) => {
  return {APIResponse: state.APIResponse}
},mapDispatchToProps)(EditDetails);
