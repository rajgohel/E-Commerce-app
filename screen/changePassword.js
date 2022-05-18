import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import { Header } from "native-base";
import service from '../service/service';
import alertService from '../service/alertService';

let pwdFlag = false;

export default class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
        pwdFlag = false;
    }

    /**
     * update password
     */
    updatePwd = () => {
        if (this.state.oldPassword && this.state.newPassword && !pwdFlag) {
            const obj = {
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword
            }
            service.updatePassword(obj)
                .then((response) => {
                    console.log('response from updatePwd====', response.data);
                    alertService.alerAndToast('Password updated successfully');
                    this.props.navigation.navigate('MyAccount');
                })
                .catch((err) => {
                    console.log('err from updatePwd====', err);
                    alertService.alerAndToast('Password not updated');
                })
        } else {
            alertService.alerAndToast('Enter all fields');
        }
    }

    /**
     * @param {*} confirmPassword
     * match password
     */
    matchPassword = (confirmPassword) => {
        this.setState({ confirmPassword: confirmPassword })
        if (this.state.newPassword === confirmPassword) {
            pwdFlag = false;
        } else {
            pwdFlag = true;
        }
    }

    render() {
        return (
            <>
                <Header style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => this.props.navigation.navigate('MyAccount')}>
                            <Image source={require('../assets/image/leftHeader.png')} style={{ height: 20, width: 30, marginLeft: 10, marginTop: 15 }}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Change Password</Text></View>
                </Header>
                <View style={{ padding: 25 }}>
                    <Text>Old Password</Text>
                    <TextInput
                        style={styles.txtInput}
                        onChangeText={(oldPassword) => this.setState({ oldPassword: oldPassword })}
                    />
                    <Text>New Password</Text>
                    <TextInput
                        style={styles.txtInput}
                        onChangeText={(newPassword) => this.setState({ newPassword: newPassword })}
                    />
                    <Text>Confirm Password</Text>
                    <TextInput
                        style={styles.txtInput}
                        onChangeText={(confirmPassword) => this.matchPassword(confirmPassword)}
                    />
                    {pwdFlag ?
                        <View><Text style={{ color: 'red' }}>password not match</Text></View>
                        :
                        null}
                    <TouchableOpacity
                        style={{ backgroundColor: 'purple', borderRadius: 10, padding: 10 }}
                        onPress={() => this.updatePwd()}
                    >
                        <Text style={{ color: '#fff', fontSize: 20, alignSelf: 'center' }}>Update Password</Text>
                    </TouchableOpacity>
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