import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import service from '../service/service';
import AsyncStorage from '@react-native-community/async-storage';
import alertService from '../service/alertService';
import { Header } from "native-base";

let postCodeFlag = false;

export default class AddAddress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customerId: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            postcode: ''
        };
        postCodeFlag = false;
    }

    /**
     * save address
     */
    saveAddress = async () => {
        if (this.state.address1 && this.state.address2 && this.state.city && this.state.state && this.state.postcode && !postCodeFlag) {
            let id = await AsyncStorage.getItem('customerId');
            const obj = {
                customerId: id,
                address1: this.state.address1,
                address2: this.state.address2,
                city: this.state.city,
                state: this.state.state,
                postcode: this.state.postcode
            }
            console.log('add address obj=====', obj);
            service.saveAddressData(obj)
                .then((response) => {
                    console.log('response from add address-=-=', response.data.message);
                    alertService.alerAndToast('Save address successfully');
                    this.props.navigation.navigate('Address');
                })
                .catch((err) => {
                    console.log('err from save address-=-=', err);
                    alertService.alerAndToast('Address not saved');
                })
        } else {
            alertService.alerAndToast('Enter all fields');
        }
    }

    /**
     * check postcode
     */
    checkPostCode = (postcode) => {
        this.setState({ postcode: postcode })
        let re = /^[0-9]{6}$/;
        if (!(re.test(postcode))) {
            postCodeFlag = true;
        } else {
            postCodeFlag = false;
            this.setState({ postcode: postcode })
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
                    <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Add Address</Text></View>
                </Header>
                <ScrollView>
                    <View style={{ padding: 20 }}>
                        <Text>Address line 1</Text>
                        <TextInput
                            style={styles.txtInput}
                            onChangeText={(address1) => this.setState({ address1: address1 })}
                        />
                        <Text>Address line 2</Text>
                        <TextInput
                            style={styles.txtInput}
                            onChangeText={(address2) => this.setState({ address2: address2 })}
                        />
                        <Text>City</Text>
                        <TextInput
                            style={styles.txtInput}
                            onChangeText={(city) => this.setState({ city: city })}
                        />
                        <Text>State</Text>
                        <TextInput
                            style={styles.txtInput}
                            onChangeText={(state) => this.setState({ state: state })}
                        />
                        <Text>Postcode</Text>
                        <TextInput
                            style={styles.txtInput}
                            keyboardType='numeric'
                            onChangeText={(postcode) => this.checkPostCode(postcode)}
                        />
                        {postCodeFlag ?
                            <View><Text style={{ color: 'red' }}>Pincode not valid</Text></View>
                            :
                            null}
                        <TouchableOpacity
                            style={{ backgroundColor: 'purple', borderRadius: 5, padding: 10 }}
                            onPress={() => this.saveAddress()}>
                            <Text style={{ fontSize: 17, color: '#fff', alignSelf: 'center', textTransform: 'uppercase' }}>save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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