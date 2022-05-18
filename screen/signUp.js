import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import service from '../service/service';
import alertService from '../service/alertService';
import { Header } from "native-base";

let emailFlag = false;
let phoneFlag = false;

export default class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            confirmPassword: '',
            emailId: '',
            phoneNumber: ''
        };
        emailFlag = false;
        phoneFlag = false;
    }

    componentDidMount() {
    }

    /**
     * @param {JSON} state data
     * sign up 
     */
    signUp = (stateData) => {
        if (this.state.name && this.state.password, this.state.confirmPassword, this.state.emailId, this.state.phoneNumber && !emailFlag && !phoneFlag) {
            service.signUpData(stateData)
                .then((response) => {
                    console.log('response from signup-=-=', response.data.data);
                    this.setState({ name: '', emailId: '', password: '', confirmPassword: '', phoneNumber: '' });
                    this.props.navigation.navigate('Login');
                })
                .catch((err) => {
                    console.log('error in signup-=-=', err);
                })
        } else {
            alertService.alerAndToast('Enter all fields');
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


    /**
     * check mobile
     */
    checkeMobile = (phoneNumber) => {
        this.setState({ phoneNumber: phoneNumber })
        let re = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
        if (!(re.test(phoneNumber))) {
            phoneFlag = true;
        } else {
            phoneFlag = false;
            this.setState({ phoneNumber: phoneNumber })
        }
    }

    render() {
        return (
            <>
                <Header style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => this.props.navigation.navigate('Login')}>
                            <Image source={require('../assets/image/leftHeader.png')} style={{ height: 20, width: 30, marginLeft: 10, marginTop: 15 }}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Signup</Text></View>
                </Header>
                <View style={{ padding: 10 }}>
                    <TextInput
                        style={[styles.input, styles.generalFont]}
                        onChangeText={(name) => this.setState({ name: name })}
                        placeholder={'Name'}
                        value={this.state.name}
                    />
                    <TextInput
                        style={[styles.input, styles.generalFont]}
                        onChangeText={(password) => this.setState({ password: password })}
                        placeholder={'Password'}
                        secureTextEntry={true}
                        value={this.state.password}
                    />
                    <TextInput
                        style={[styles.input, styles.generalFont]}
                        onChangeText={(confirmPassword) => this.setState({ confirmPassword: confirmPassword })}
                        placeholder={'Confirm Password'}
                        secureTextEntry={true}
                        value={this.state.confirmPassword}
                    />
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
                        onChangeText={(phoneNumber) => this.checkeMobile(phoneNumber)}
                        placeholder={'Phone Number'}
                        keyboardType='numeric'
                        value={this.state.phoneNumber}
                    />
                    {phoneFlag ?
                        <View><Text style={{ color: 'red' }}>Phone not valid</Text></View>
                        :
                        null}
                    <View style={styles.inputContainer}>
                        <TouchableOpacity
                            style={[styles.buttonContainer, styles.loginButton, { marginLeft: 10 }]}
                            onPress={() => this.signUp(this.state)}
                        >
                            <Text style={styles.signUpText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
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