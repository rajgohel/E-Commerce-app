import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import service from '../service/service';
import AsyncStorage from '@react-native-community/async-storage';
import alertService from '../service/alertService';
import { Header } from "native-base";

let postCodeFlag = false;

export default class Address extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            address1: '',
            address2: '',
            city: '',
            postcode: '',
            state: '',
        };
        postCodeFlag = false;
        console.log("props===>", props.navigation.state.params.address);
    }

    componentDidMount() {
        this.setState({
            id: this.props.navigation.state.params.address.addressId,
            address1: this.props.navigation.state.params.address.address1,
            address2: this.props.navigation.state.params.address.address2,
            city: this.props.navigation.state.params.address.city,
            postcode: this.props.navigation.state.params.address.postcode,
            state: this.props.navigation.state.params.address.state
        });
    }

    /**
     * update address
     */
    updateAddress = async () => {
        if (this.state.address1 && this.state.address2 && this.state.city && this.state.postcode && this.state.state && !postCodeFlag) {
            console.log('this.state in edit address', this.state);
            const obj = {
                addressId: this.state.id,
                customerId: await AsyncStorage.getItem('customerId'),
                address1: this.state.address1,
                address2: this.state.address2,
                city: this.state.city,
                postcode: this.state.postcode,
                state: this.state.state,
            }
            console.log('obj in edit address-=-=', obj);
            service.updateAddressData(obj)
                .then((response) => {
                    console.log('response from get profile-=-=', response.data);
                    alertService.alerAndToast('Address updated successfully');
                    this.props.navigation.navigate('Address');
                })
                .catch((err) => {
                    console.log('err from get profile-=-=', err);
                    alertService.alerAndToast('Address not updated');
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
                            onPress={() => this.props.navigation.navigate('Address')}>
                            <Image source={require('../assets/image/leftHeader.png')} style={{ height: 20, width: 30, marginLeft: 10, marginTop: 15 }}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Edit Address</Text></View>
                </Header>
                <ScrollView>
                    <View style={{ padding: 20 }}>
                        <Text>Address line 1</Text>
                        <TextInput
                            style={styles.txtInput}
                            onChangeText={(address1) => this.setState({ address1: address1 })}
                        >{this.state.address1}</TextInput>
                        <Text>Address line 2</Text>
                        <TextInput
                            style={styles.txtInput}
                            onChangeText={(address2) => this.setState({ address2: address2 })}
                        >{this.state.address2}</TextInput>
                        <Text>City</Text>
                        <TextInput
                            style={styles.txtInput}
                            onChangeText={(city) => this.setState({ city: city })}
                        >{this.state.city}</TextInput>
                        <Text>State</Text>
                        <TextInput
                            style={styles.txtInput}
                            onChangeText={(state) => this.setState({ state: state })}
                        >{this.state.state}</TextInput>
                        <Text>Postcode</Text>
                        <TextInput
                            style={styles.txtInput}
                            keyboardType='numeric'
                            onChangeText={(postcode) => this.checkPostCode(postcode)}
                        >{this.state.postcode}</TextInput>
                        {postCodeFlag ?
                            <View><Text style={{ color: 'red' }}>Pincode not valid</Text></View>
                            :
                            null}
                        <TouchableOpacity
                            style={{ backgroundColor: 'purple', borderRadius: 5, padding: 10 }}
                            onPress={() => this.updateAddress()}>
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