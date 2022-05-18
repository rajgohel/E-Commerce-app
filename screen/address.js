import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import service from '../service/service';
import AsyncStorage from '@react-native-community/async-storage';
import alertService from '../service/alertService';
import { Header } from "native-base";

let id = '';

export default class Address extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address: ''
        };
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.getAddress();
            });
        this.getAddress();
    }

    /**
     * get address
     */
    getAddress = async () => {
        id = await AsyncStorage.getItem('customerId');
        if (id) {
            service.getAddressData(id)
                .then((response) => {
                    console.log('response from get address-=-=', response.data.data);
                    this.setState({
                        address: response.data.data
                    })
                })
                .catch((err) => {
                    console.log('err from get address-=-=', err);
                })
        } else {
            console.log('customer id not found');
        }
    }

    /**
     * delete address
     */
    deleteAdd = (addressId) => {
        service.deleteAddress(addressId)
            .then((response) => {
                console.log('response from delete address-=-=', response.data);
                alertService.alerAndToast('Address deleted successfully');
                this.getAddress();
            })
            .catch((err) => {
                console.log('err from delete address-=-=', err);
                alertService.alerAndToast('Address not deleted');
            })
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
                    <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Address</Text></View>
                </Header>
                <ScrollView>
                    <View style={{ padding: 10 }}>
                        <TouchableOpacity
                            style={{ backgroundColor: 'purple', borderRadius: 5, padding: 10 }}
                            onPress={() => this.props.navigation.navigate('AddAddress')}>
                            <Text style={{ fontSize: 17, color: '#fff', alignSelf: 'center' }}>Add Address</Text>
                        </TouchableOpacity>
                        {this.state.address && this.state.address.length ?
                            this.state.address.map((data, index) => {
                                return (
                                    <View key={index} style={{ borderWidth: 1, borderColor: 'gray', marginTop: 5, borderRadius: 5, padding: 10 }}>
                                        <View><Text style={{ fontSize: 20 }}>{data.address1}</Text></View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>{data.address2}, {data.city}, {data.state}, {data.postcode}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => this.deleteAdd(data.addressId)}>
                                                <Image source={require('../assets/image/delete.png')} style={{ height: 30, width: 30, marginTop: 5, marginLeft: 10 }}></Image>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('EditAddress', { address: data }) }}>
                                                <Image source={require('../assets/image/edit.png')} style={{ height: 30, width: 30, marginTop: 5, marginLeft: 10 }}></Image>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })
                            : null}
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
    }
});