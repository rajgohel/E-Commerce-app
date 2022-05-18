import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
const _ = require('lodash');
import service from '../service/service';
import { Header } from "native-base";

export default class OrderPlaced extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.backEvent);
    }

    /**
     * back event
     */
    backEvent = () => {
        this.props.navigation.navigate('Home');
    }

    render() {
        return (
            <>
                <Header style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => { this.props.navigation.navigate('Home') }}>
                            <Image source={require('../assets/image/leftHeader.png')} style={{ height: 20, width: 30, marginLeft: 10 }}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Order placed</Text></View>
                </Header>
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                    <Text style={{ fontSize: 25 }}>Successfully order placed</Text>
                </View>
                <View style={{ padding: 20 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                        <View style={{ alignItems: 'center', marginTop: 20, backgroundColor: '#00306a', padding: 10 }}>
                            <Text style={{ fontSize: 20, color: '#fff' }}>Continue Shopping</Text>
                        </View>
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
        marginBottom: 5,
        marginTop: Platform.OS == 'ios' ? 20 : null
    },
    iconButton: {
        height: 50,
        width: 50,
        top: Platform.OS === 'ios' ? null : 20
    }
});