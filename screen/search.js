import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import service from '../service/service';
import { Header } from "native-base";
import { config } from '../config';

export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            searchDetail: '',
            showLoader: false
        };
    }

    showLoader = () => { this.setState({ showLoader: true }); };
    hideLoader = () => { this.setState({ showLoader: false }); };

    // componentWillMount() {
    //     this.hideLoader();
    // }

    /**
     * @param {*} keyword
     * search product
     */
    searchProduct = (keyword) => {
        this.showLoader();
        // console.log("keyword======>", keyword)
        if (keyword) {
            this.setState({ keyword: keyword });
            service.searchProductData(keyword)
                .then((response) => {
                    console.log('response from search product-=-=', response.data.data);
                    this.setState({
                        searchDetail: response.data.data,
                        showLoader: false
                    })
                    // this.hideLoader();
                    // console.log('this.state.searchDetail====================>', this.state.searchDetail)
                })
                .catch((err) => {
                    console.log('err from search product-=-=', err);
                })
        } else {
            this.setState({ searchDetail: '', keyword: '' })
        }
    }

    render() {
        console.log("this.state.key", this.state.keyword)
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
                    <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Search</Text></View>
                </Header>
                <View style={{ padding: 10, backgroundColor: 'lightblue' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 5 }}>
                        <TextInput
                            placeholder={'search for products'}
                            style={[styles.input, styles.generalFont]}
                            onChangeText={(keyword) => this.searchProduct(keyword)}
                            autoFocus={true}
                        />
                    </View>
                </View>
                <ScrollView>
                    {this.state.searchDetail ?
                        this.state.searchDetail.productList.map((data, index) => {
                            console.log('data in search-=-=', data)
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => this.props.navigation.navigate('Product', { productId: data.productId })}
                                >
                                    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
                                        <Image style={{ height: 50, width: 50, resizeMode: 'contain' }} source={{ uri: config.baseMediaUrl + data.Images.containerName + data.Images.image }} />
                                        <Text style={{ color: 'gray', fontSize: 15 }}>{data.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                        : this.state.keyword.length != 0 ?
                            <ActivityIndicator size="large" color="blue" animating={this.state.showLoader} ></ActivityIndicator>
                            : null}
                </ScrollView>
            </>
        );
    }
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        borderBottomColor: '#800080',
        marginHorizontal: 5
    },
    generalFont: {
        fontSize: 20,
    },
    header: {
        backgroundColor: "#ffffff",
        height: 50,
        // borderBottomColor: Platform.OS == 'ios' ? null : '#000',
        // borderBottomWidth: Platform.OS == 'ios' ? null : 1,
        marginTop: Platform.OS == 'ios' ? 20 : null
    }
});