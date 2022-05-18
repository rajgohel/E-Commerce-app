import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import service from '../service/service';
import { Header } from "native-base";

let isEmpty = false;

export default class OrderHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderHistory: ''
        };
    }

    componentDidMount() {
        this.getOrderHistory();
    }

    /**
     * get order history
     */
    getOrderHistory = () => {
        isEmpty = false;
        service.getOrderHistoryData()
            .then((response) => {
                console.log('response from get order=====', response.data.data);
                this.setState({
                    orderHistory: response.data.data
                })
                console.log('order history length=====', this.state.orderHistory.length);
                if (this.state.orderHistory.length == 0) {
                    isEmpty = true;
                }
            })
            .catch((err) => {
                console.log('err from get order=====', err);
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
                    <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Order History</Text></View>
                </Header>
                <View style={{ padding: 20 }}>
                    <ScrollView>
                        {this.state.orderHistory ?
                            this.state.orderHistory.map((data, index) => {
                                return (
                                    <TouchableOpacity key={index} style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginBottom: 10, padding: 10 }}
                                        onPress={() => this.props.navigation.navigate('OrderDetail', { orderId: data.orderId })}>
                                        <View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text>Order ID  </Text>
                                                <Text>{data.OrderId}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text>Date  </Text>
                                                <Text>{data.createdDate}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text>Status  </Text>
                                                <Text>{data.orderStatus.name}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text>Total  </Text>
                                                <Text>{data.total}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                            : <ActivityIndicator size="large" color="blue" />}
                        {isEmpty ?
                            <Text style={{ alignSelf: 'center', fontSize: 20, marginTop: 20 }}>No orders</Text>
                            : null}
                    </ScrollView>
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
    }
});