import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import service from '../service/service';
import AsyncStorage from '@react-native-community/async-storage';
import alertService from '../service/alertService';
import { Header, Card } from "native-base";

let emailFlag = false;
let phoneFlag = false;

export default class ContactUs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            phoneNumber: '',
            message: ''
        };
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.initialCall();
            });
    }

    /**
     * contact us
     */
    contactUs = () => {
        if (this.state.name && this.state.email && this.state.phoneNumber && this.state.message && !emailFlag && !phoneFlag) {
            service.contactUsData(this.state)
                .then((response) => {
                    this.setState({
                        name: '',
                        email: '',
                        phoneNumber: '',
                        message: ''
                    })
                    console.log('response from contact us=====', response.data);
                    alertService.alerAndToast('Your mail send to admin..!');
                    this.props.navigation.navigate('Home');
                })
                .catch((err) => {
                    console.log('err from contact us=====', err);
                    alertService.alerAndToast('Your mail is not send to admin..!');
                })
        } else {
            alertService.alerAndToast('Enter all fields');
        }
    }

    initialCall = () => {
        this.setState({
            name: '',
            email: '',
            phoneNumber: '',
            message: ''
        })
        emailFlag = false;
        phoneFlag = false;
    }

    /**
     * check email
     */
    checkeMail = (email) => {
        this.setState({ email: email })
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!(re.test(email))) {
            emailFlag = true;
        } else {
            emailFlag = false;
            this.setState({ email: email })
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
                            onPress={() => this.props.navigation.navigate('Home')}>
                            <Image source={require('../assets/image/leftHeader.png')} style={{ height: 20, width: 30, marginLeft: 10, marginTop: 15 }}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Contact Us</Text></View>
                </Header>
                <View style={{ padding: 20 }}>
                    <Text>Name</Text>
                    <TextInput
                        style={styles.txtInput}
                        onChangeText={(name) => this.setState({ name: name })}
                    />
                    <Text>Email</Text>
                    <TextInput
                        style={styles.txtInput}
                        onChangeText={(email) => this.checkeMail(email)}
                    />
                    {emailFlag ?
                        <View><Text style={{ color: 'red' }}>Email not valid</Text></View>
                        :
                        null}
                    <Text>Phone</Text>
                    <TextInput
                        style={styles.txtInput}
                        keyboardType='numeric'
                        onChangeText={(phoneNumber) => this.checkeMobile(phoneNumber)}
                    />
                    {phoneFlag ?
                        <View><Text style={{ color: 'red' }}>Phone not valid</Text></View>
                        :
                        null}
                    <Text>Message</Text>
                    <TextInput
                        style={styles.txtInput}
                        onChangeText={(message) => this.setState({ message: message })}
                    />
                    <TouchableOpacity
                        style={{ backgroundColor: 'purple', borderRadius: 5, padding: 10 }}
                        onPress={() => this.contactUs()}>
                        <Text style={{ fontSize: 17, color: '#fff', alignSelf: 'center', textTransform: 'uppercase' }}>Submit</Text>
                    </TouchableOpacity>
                    <Card style={{ padding: 10, marginTop: 25 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold' }}>ADDRESS</Text>
                            <Text>Lorem ipsum</Text>
                            <Text style={{ fontWeight: 'bold' }}>E-MAIL</Text>
                            <Text>example@gmail.com</Text>
                            <Text style={{ fontWeight: 'bold' }}>PHONE</Text>
                            <Text>1(800)233-2742</Text>
                        </View>
                    </Card>
                </View>
            </>
        );
    }
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#ffffff",
        height: 50,
        // borderBottomColor: Platform.OS == 'ios' ? null : '#000',
        // borderBottomWidth: Platform.OS == 'ios' ? null : 1,
        marginTop: Platform.OS == 'ios' ? 20 : null
    },
    txtInput: {
        fontSize: 20,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 10
    }
});