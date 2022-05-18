import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import service from '../service/service';
import AsyncStorage from '@react-native-community/async-storage';
import alertService from '../service/alertService';
import { Header } from "native-base";

let emailFlag = false;

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      emailId: '',
      password: '',
    };
    emailFlag = false;
  }

  componentDidMount() {
  }

  /**
   * user login
   * @params {JSON} emailId and password
   */
  login = async (stateData) => {
    console.log('state data-=-=', stateData);
    if (this.state.emailId && this.state.password && !emailFlag) {
      service.loginData(stateData)
        .then(async response => {
          console.log('response of login-=-=', response.data.data);
          this.setState({ emailId: '', password: '' });
          await AsyncStorage.setItem('token', response.data.data.token)
          // const value = await AsyncStorage.getItem('token')
          // console.log('value of token-=-=', value);
          this.props.navigation.navigate('Home');
        })
        .catch(err => {
          console.log('err-=-=', err);
          alertService.alerAndToast('Error in log in');
        })
    } else {
      alertService.alerAndToast('Enter email id and password first');
    }
  }

  /**
     * check email
     */
  checkeMail = (emailId) => {
    this.setState({ emailId: emailId })
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!(re.test(emailId))) {
      emailFlag = true;
    } else {
      emailFlag = false;
      this.setState({ emailId: emailId })
    }
  }

  render() {
    console.log('emailid and password-=-=', this.state.emailId, this.state.password);
    return (
      <>
        <Header style={styles.header}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => this.props.navigation.navigate('Home')}>
              <Image source={require('../assets/image/leftHeader.png')} style={{ height: 20, width: 30, marginLeft: 10, marginTop: 15 }}></Image>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Login</Text></View>
        </Header>
        <View style={{ padding: 10 }}>
          <TextInput
            style={[styles.input, styles.generalFont]}
            onChangeText={(emailId) => this.checkeMail(emailId)}
            placeholder={'Email id'}
            value={this.state.emailId}
          />
          {emailFlag ?
            <View><Text style={{ color: 'red', padding: 10 }}>Email not valid</Text></View>
            :
            null}
          <TextInput
            style={[styles.input, styles.generalFont]}
            onChangeText={(password) => this.setState({ password: password })}
            placeholder={'Password'}
            secureTextEntry={true}
            value={this.state.password}
          />
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={[styles.buttonContainer, styles.loginButton]}
              onPress={() => this.login(this.state)}
            >
              <Text style={styles.signUpText}>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonContainer, styles.loginButton, { marginLeft: 10 }]}
              onPress={() => this.props.navigation.navigate('SignUp')}
            >
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}><Text style={{ marginTop: 10, fontSize: 20 }}>Forgot Password ?</Text></TouchableOpacity>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderBottomColor: '#800080',
    marginHorizontal: 5,
  },
  generalFont: {
    fontSize: 20,
  },
  inputContainer: {
    width: 250,
    height: 45,
    flexDirection: 'row'
  },
  buttonContainer: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    borderRadius: 30
  },
  loginButton: {
    backgroundColor: "#372e5f"
  },
  signUpText: {
    color: "white",
    textTransform: 'uppercase'
  },
  header: {
    backgroundColor: "#ffffff",
    height: 50,
    // borderBottomColor: Platform.OS == 'ios' ? null : '#000',
    // borderBottomWidth: Platform.OS == 'ios' ? null : 1,
    marginTop: Platform.OS == 'ios' ? 20 : null
  }
});