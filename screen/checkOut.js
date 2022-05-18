import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput, Picker } from 'react-native';
import { Header } from 'native-base';
import service from '../service/service';
import alertService from '../service/alertService';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

let productDetailArr = null;
let emailFlag = false;
let phoneFlag = false;
let postCodeFlag = false;

export default class checkOut extends Component {
    constructor(props) {
        console.log("props===>", props.navigation.state.params.productDetail);
        productDetailArr = props.navigation.state.params.productDetail;
        super(props)
        this.state = {
            shippingFirstName: '',
            shippingLastName: '',
            emailId: '',
            phoneNumber: '',
            shippingAddress_1: '',
            shippingAddress_2: '',
            shippingCountry: '',
            shippingZone: '',
            shippingCity: '',
            shippingPostCode: '',
            shippingCountryData: '',
            shippingZoneData: '',
            spinner: false
        }
        this.getCountryList();
        this.getZoneList();
        this.getProfile();
        emailFlag = false;
        phoneFlag = false;
        postCodeFlag = false;
    }

    /** 
     * get user profile
     */
    getProfile = () => {
        service.getProfileData()
            .then((response) => {
                console.log('response from get profile in checkout screen-=-=', response.data.data);
                this.setState({
                    shippingFirstName: response.data.data.firstName,
                    emailId: response.data.data.email,
                    phoneNumber: response.data.data.mobileNumber
                })
            })
            .catch((err) => {
                console.log('err from get profile-=-=', err);
            })
    }

    /**
     * get country list
     */
    getCountryList = () => {
        service.getCountryListData()
            .then((response) => {
                console.log('response of get country list-=-=', response.data.data);
                this.setState({
                    shippingCountryData: response.data.data
                })
            })
            .catch((err) => {
                console.log('error of get country list-=-=', err);
            })
    }

    /**
     * get city list
     */
    getZoneList = () => {
        service.getZoneListData()
            .then((response) => {
                console.log('response of get zone list-=-=', response.data.data);
                this.setState({
                    shippingZoneData: response.data.data
                })
            })
            .catch((err) => {
                console.log('error of get zone list-=-=', err);
            })
    }

    /**
     * checkout
     */
    checkout = () => {
        if (this.state.shippingFirstName && this.state.shippingLastName && this.state.emailId && this.state.phoneNumber && this.state.shippingAddress_1 && this.state.shippingAddress_2 && this.state.shippingCountry && this.state.shippingZone && this.state.shippingCity && this.state.shippingPostCode && !emailFlag && !phoneFlag && !postCodeFlag) {
            this.setState({
                spinner: !this.state.spinner
            });
            const obj = {
                productDetails: productDetailArr,
                shippingFirstName: this.state.shippingFirstName,
                shippingLastName: this.state.shippingLastName,
                emailId: this.state.emailId,
                phoneNumber: this.state.phoneNumber,
                shippingAddress_1: this.state.shippingAddress_1,
                shippingAddress_2: this.state.shippingAddress_2,
                shippingCountry: this.state.shippingCountry,
                shippingZone: this.state.shippingZone,
                shippingCity: this.state.shippingCity,
                shippingPostCode: this.state.shippingPostCode,
            }
            console.log('obj in checkout======', obj);
            service.checkOutData(obj)
                .then(async (response) => {
                    console.log('response from checkout=====', response.data.data);
                    this.setState({
                        spinner: false
                    });
                    // await AsyncStorage.removeItem('qtyObj');
                    alertService.alerAndToast('Order placed successfully');
                    this.props.navigation.navigate('OrderPlaced');
                    await AsyncStorage.removeItem('pid');
                    await AsyncStorage.setItem('cartCount', '0');
                    const val = await AsyncStorage.getItem('cartCount');
                    console.log('cart count after checkout=====', val);
                })
                .catch((err) => {
                    console.log('err from checkout=====', err);
                    alertService.alerAndToast('Checkout not successfull');
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

    /**
     * check postcode
     */
    checkPostCode = (shippingPostCode) => {
        this.setState({ shippingPostCode: shippingPostCode })
        let re = /^[0-9]{6}$/;
        if (!(re.test(shippingPostCode))) {
            postCodeFlag = true;
        } else {
            postCodeFlag = false;
            this.setState({ shippingPostCode: shippingPostCode })
        }
    }

    render() {
        return (
            <>
                <Header style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => { this.props.navigation.navigate('Cart'), priceArr = [] }}>
                            <Image source={require('../assets/image/leftHeader.png')} style={{ height: 20, width: 30, marginLeft: 10 }}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Address Information</Text></View>
                </Header>
                <View style={styles.container}>
                    <Spinner
                        visible={this.state.spinner}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
                </View>
                <ScrollView>
                    <View style={{ padding: 20 }}>
                        <Text>First Name</Text>
                        <TextInput
                            value={this.state.shippingFirstName}
                            style={styles.txtInput}
                            onChangeText={(shippingFirstName) => this.setState({ shippingFirstName: shippingFirstName })}
                        />
                        <Text>Last Name</Text>
                        <TextInput
                            style={styles.txtInput}
                            onChangeText={(shippingLastName) => this.setState({ shippingLastName: shippingLastName })}
                        />
                        <Text>Email</Text>
                        <TextInput
                            value={this.state.emailId}
                            style={styles.txtInput}
                            onChangeText={(emailId) => this.checkeMail(emailId)}
                        />
                        {emailFlag ?
                            <View><Text style={{ color: 'red' }}>Email not valid</Text></View>
                            :
                            null}
                        <Text>Phone</Text>
                        <TextInput
                            value={this.state.phoneNumber}
                            style={styles.txtInput}
                            keyboardType='numeric'
                            onChangeText={(phoneNumber) => this.checkeMobile(phoneNumber)}
                        />
                        {phoneFlag ?
                            <View><Text style={{ color: 'red' }}>Phone not valid</Text></View>
                            :
                            null}
                        <Text>Address (street, apartment, unit, etc)</Text>
                        <TextInput
                            style={styles.txtInput}
                            onChangeText={(shippingAddress_1) => this.setState({ shippingAddress_1: shippingAddress_1 })}
                        />
                        <Text>Address Line 1</Text>
                        <TextInput
                            style={styles.txtInput}
                            onChangeText={(shippingAddress_2) => this.setState({ shippingAddress_2: shippingAddress_2 })}
                        />
                        <Text>Country</Text>
                        <Picker
                            selectedValue={this.state.shippingCountry}
                            style={{ height: 50 }}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ shippingCountry: itemValue })
                            }>
                            {this.state.shippingCountryData
                                ? this.state.shippingCountryData.map((data, index) => {
                                    // console.log('data=======', data)
                                    return (
                                        <Picker.Item key={index} label={data.name} value={data.countryId} />
                                    )
                                })
                                : null}
                        </Picker>
                        <Text>State</Text>
                        <Picker
                            selectedValue={this.state.shippingZone}
                            style={{ height: 50 }}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ shippingZone: itemValue })
                            }>
                            {this.state.shippingZoneData
                                ? this.state.shippingZoneData.map((data, index) => {
                                    // console.log('data=======', data)
                                    return (
                                        <Picker.Item key={index} label={data.name} value={data.zoneId} />
                                    )
                                })
                                : null}
                        </Picker>
                        <Text>City</Text>
                        <TextInput
                            style={styles.txtInput}
                            onChangeText={(shippingCity) => this.setState({ shippingCity: shippingCity })}
                        />
                        <Text>Pincode</Text>
                        <TextInput
                            style={styles.txtInput}
                            keyboardType='numeric'
                            onChangeText={(shippingPostCode) => this.checkPostCode(shippingPostCode)}
                        />
                        {postCodeFlag ?
                            <View><Text style={{ color: 'red' }}>Pincode not valid</Text></View>
                            :
                            null}
                    </View>
                </ScrollView>
                <TouchableOpacity style={{ alignItems: 'center', backgroundColor: 'purple', borderRadius: 5, padding: 10, margin: 10 }}
                    onPress={() => this.checkout()}>
                    <Text style={{ textTransform: 'uppercase', fontSize: 20, color: '#fff' }}>checkout</Text>
                </TouchableOpacity>
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
        marginBottom: 5,
        marginTop: Platform.OS == 'ios' ? 20 : null
    },
    iconButton: {
        height: 50,
        width: 50,
        top: Platform.OS === 'ios' ? null : 20
    },
    txtInput: {
        fontSize: 20,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 10
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    }
});