import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import service from '../service/service';
import alertService from '../service/alertService';
import { Header } from "native-base";

let emailFlag = false;

export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailId: ''
        };
        emailFlag = false;
    }

    /**
     * forgot password
     */
    forgotPwd = () => {
        if(this.state.emailId && !emailFlag){
            const obj = {
                emailId: this.state.emailId
            }
            console.log('obj in forgotpassword-=-=', obj);
            service.forgotPaswd(obj)
                .then((response) => {
                    console.log('response from forgot password-=-=', response.data.data);
                    this.setState({
                        emailId: ''
                    });
                    alertService.alerAndToast('New password sent to your Email');
                    this.props.navigation.navigate('Login');
                })
                .catch((err) => {
                    console.log('err from forgot password-=-=', err);
                    alertService.alerAndToast('Email not register');
                })
        } else {
            alertService.alerAndToast('Enter EmailId');
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
                    <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Forgot Password</Text></View>
                </Header>
                <View style={{ padding: 10 }}>
                    <TextInput
                        style={[styles.input, styles.generalFont]}
                        onChangeText={(emailId) => this.checkeMail(emailId)}
                        placeholder={'Enter registered email id'}
                        value={this.state.emailId}
                    />
                    {emailFlag ?
                        <View><Text style={{ color: 'red', padding: 10 }}>Email not valid</Text></View>
                        :
                        null}
                    <View style={styles.inputContainer}>
                        <TouchableOpacity
                            style={[styles.buttonContainer, styles.forgotBtn]}
                            onPress={() => this.props.navigation.navigate('Login')}
                        >
                            <Text style={styles.forgotTxt}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.buttonContainer, styles.forgotBtn, { marginLeft: 10 }]}
                            onPress={() => this.forgotPwd()}
                        >
                            <Text style={styles.forgotTxt}>Send Password</Text>
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
    forgotBtn: {
        backgroundColor: "#372e5f"
    },
    forgotTxt: {
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