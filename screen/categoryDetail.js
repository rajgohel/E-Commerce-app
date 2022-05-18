import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import service from '../service/service';
import { Header } from "native-base";
import CardView from 'react-native-cardview';
import { config } from '../config';

export default class CategoryDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryDetail: ''
        };
    }

    componentDidMount() {
        this.getCategoryDetail();
    }

    /**
     * get order detail
     */
    getCategoryDetail = () => {
        let categoryId = this.props.navigation.state.params.categoryId;
        console.log('orderId in order detail page=====', categoryId);
        service.getCategoryDetailData(categoryId)
            .then((response) => {
                console.log('response from get category detail=====', response.data.data.productList);
                this.setState({
                    categoryDetail: response.data.data.productList
                })
            })
            .catch((err) => {
                console.log('err from get category detail=====', err);
            })
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
                    <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Category Detail</Text></View>
                </Header>
                <ScrollView>
                    {this.state.categoryDetail && this.state.categoryDetail.length ?
                        this.state.categoryDetail.map((data, index) => {
                            return (
                                <View key={index} style={{ padding: 20, flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Product', { productId: data.productId })}>
                                        <CardView
                                            cardElevation={2}
                                            cardMaxElevation={2}
                                            cornerRadius={5}
                                            style={{ padding: 20 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Image style={{ height: 100, width: 100, resizeMode: 'contain' }} source={{ uri: config.baseMediaUrl + data.Images.containerName + data.Images.image }}></Image>
                                                <View style={{ marginLeft: 20, flexDirection: 'column' }}>
                                                    <Text style={{ width: 160 }}>{data.name}</Text>
                                                    <Text>{data.price} $</Text>
                                                </View>
                                            </View>
                                        </CardView>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                        : <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ fontSize: 30 }}>Sorry</Text>
                            <Text style={{ color: 'gray', fontSize: 15 }}>No Items found</Text>
                        </View>}
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