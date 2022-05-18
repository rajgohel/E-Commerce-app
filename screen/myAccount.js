import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Platform, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import service from '../service/service';
import { Header } from "native-base";
import alertService from '../service/alertService';

let emailFlag = false;
let phoneFlag = false;

export default class MyAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            email: '',
            phoneNumber: ''
        };
        this.getProfile();
        emailFlag = false;
        phoneFlag = false;
    }

    /** 
     * get user profile
     */
    getProfile = () => {
        service.getProfileData()
            .then((response) => {
                console.log('response from get profile-=-=', response.data.data);
                this.setState({
                    firstName: response.data.data.firstName,
                    email: response.data.data.email,
                    phoneNumber: response.data.data.mobileNumber
                })
            })
            .catch((err) => {
                console.log('err from get profile-=-=', err);
            })
    }

    /**
     * update user profile
     */
    updateProfile = () => {
        if (this.state.firstName && this.state.email && this.state.phoneNumber && !emailFlag && !phoneFlag) {
            const obj = {
                firstName: this.state.firstName,
                emailId: this.state.email,
                phoneNumber: this.state.phoneNumber
            }
            console.log('obj in myAccount-=-=', obj);
            service.updateProfileData(obj)
                .then((response) => {
                    console.log('response from get profile-=-=', response.data.data);
                    alertService.alerAndToast('Profile updated successfully');
                })
                .catch((err) => {
                    console.log('err from get profile-=-=', err);
                    alertService.alerAndToast('Profile not updated');
                })
        } else {
            alertService.alerAndToast('Enter all fields');
        }
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
                    <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>My Account</Text></View>
                </Header>
                {this.state.firstName ?
                    <>
                        <View style={{ padding: 25 }}>
                            <ScrollView>
                                <Text>Name</Text>
                                <TextInput
                                    style={styles.txtInput}
                                    onChangeText={(firstName) => this.setState({ firstName: firstName })}
                                >{this.state.firstName}</TextInput>
                                <Text>Email</Text>
                                <TextInput
                                    style={styles.txtInput}
                                    onChangeText={(email) => this.checkeMail(email)}
                                >{this.state.email}</TextInput>
                                {emailFlag ?
                                    <View><Text style={{ color: 'red' }}>Email not valid</Text></View>
                                    :
                                    null}
                                <Text>Phone Number</Text>
                                <TextInput
                                    style={styles.txtInput}
                                    keyboardType='numeric'
                                    onChangeText={(phoneNumber) => this.checkeMobile(phoneNumber)}
                                >{this.state.phoneNumber}</TextInput>
                                {phoneFlag ?
                                    <View><Text style={{ color: 'red' }}>Phone not valid</Text></View>
                                    :
                                    null}
                                <TouchableOpacity
                                    style={{ backgroundColor: 'purple', borderRadius: 10, padding: 10 }}
                                    onPress={() => this.updateProfile()}
                                >
                                    <Text style={{ color: '#fff', fontSize: 20, alignSelf: 'center' }}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ChangePassword')}>
                                    <Text style={{ fontSize: 17, color: 'purple', alignSelf: 'center', marginTop: 10 }}>Change Password</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Address')}>
                                    <Text style={{ fontSize: 17, color: 'purple', alignSelf: 'center', marginTop: 10 }}>Address</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('OrderHistory')}>
                                    <Text style={{ fontSize: 17, color: 'purple', alignSelf: 'center', marginTop: 10 }}>Order History</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </>
                    :
                    <ActivityIndicator size="large" color="blue" ></ActivityIndicator>
                }
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