import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import service from '../service/service';
import AsyncStorage from '@react-native-community/async-storage';
import alertService from '../service/alertService';
import { Header } from "native-base";
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';

let page1;
// .drawRectangle({
//     x: 25,
//     y: 25,
//     width: 150,
//     height: 150,
//     color: '#FF99CC',
// })
// .drawRectangle({
//     x: 75,
//     y: 75,
//     width: 50,
//     height: 50,
//     color: '#99FFCC',
// });


export default class OrderDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderDetail: ''
        };
    }

    componentDidMount() {
        this.getOrderDetail();
    }

    /**
     * generate pdf
     */
    generatePdf = async () => {
        const docsDir = await PDFLib.getDocumentsDirectory();
        // const pdfPath = `${docsDir}/sample.pdf`;
        const pdfPath = `/storage/emulated/0/sample.pdf`;

        PDFDocument
            .create(pdfPath)
            .addPages(page1)
            .write() // Returns a promise that resolves with the PDF's path
            .then(path => {
                console.log('PDF created at: ' + path);
                // Do stuff with your shiny new PDF!
            });
        alertService.alerAndToast('Invoice downloaded');
    }

    /**
     * get order detail
     */
    getOrderDetail = () => {
        let orderId = this.props.navigation.state.params.orderId;
        console.log('orderId in order detail page=====', orderId);
        service.getOrderDetailData(orderId)
            .then((response) => {
                console.log('response from get order detail=====', response.data.data);
                this.setState({
                    orderDetail: response.data.data
                })
            })
            .catch((err) => {
                console.log('err from get order detail=====', err);
            })
    }

    render() {
        return (
            <>
                <Header style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => this.props.navigation.navigate('OrderHistory')}>
                            <Image source={require('../assets/image/leftHeader.png')} style={{ height: 20, width: 30, marginLeft: 10, marginTop: 15 }}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Order Detail</Text></View>
                </Header>
                <ScrollView>
                    <View style={{ padding: 20 }}>
                        {this.state.orderDetail ?
                            this.state.orderDetail.map((data, index) => {
                                return (
                                    <View key={index}>
                                        <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 5 }}>
                                            <Text style={{ fontSize: 20 }}>Shipping Address</Text>
                                            <Text>{data.shippingFirstname}  {data.shippingLastname}</Text>
                                            <Text style={{ marginBottom: 5 }}>{data.shippingAddress1}, {data.shippingAddress2}</Text>
                                        </View>
                                        <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                                            <Text style={{ fontSize: 20 }}>Billing Address</Text>
                                            <Text>{data.shippingFirstname}  {data.shippingLastname}</Text>
                                            <Text style={{ marginBottom: 5 }}>{data.shippingAddress1}, {data.shippingAddress2}</Text>
                                        </View>
                                        {data.productList.map((sublist, index) => {
                                            page1 = PDFPage
                                                .create()
                                                .setMediaBox(200, 200)
                                                .drawText('Spurtcommerce', {
                                                    x: 60,
                                                    y: 185,
                                                    color: '#000000',
                                                    fontName: 'Times New Roman'
                                                })
                                                .drawText('Billing Address:', {
                                                    x: 5,
                                                    y: 170,
                                                    color: '#000000',
                                                    fontName: 'Times New Roman'
                                                })
                                                .drawText('' + data.shippingAddress1 + ', ' + data.shippingAddress2, {
                                                    x: 5,
                                                    y: 155,
                                                    color: '#000000',
                                                    fontName: 'Times New Roman'
                                                })
                                                .drawText('' + data.telephone, {
                                                    x: 5,
                                                    y: 140,
                                                    color: '#000000',
                                                    fontName: 'Times New Roman'
                                                })
                                                .drawText('Order Details:', {
                                                    x: 5,
                                                    y: 115,
                                                    color: '#000000',
                                                    fontName: 'Times New Roman'
                                                })
                                            return (
                                                <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('Product', { productId: sublist.productId })}>
                                                    <View style={{ marginTop: 20, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                                                        <Text style={{ fontSize: 20 }}>{sublist.name}</Text>
                                                        <Text style={{ fontSize: 17 }}>{sublist.total} $</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })}
                                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                            <Text style={{ fontSize: 20 }}>Total</Text>
                                            <Text style={{ fontSize: 20, marginLeft: 20 }}>{data.total} $</Text>
                                        </View>
                                        <TouchableOpacity style={{ alignItems: 'center', backgroundColor: 'purple', borderRadius: 5, padding: 10, margin: 10 }}
                                            onPress={() => this.generatePdf()}>
                                            <Text style={{ textTransform: 'uppercase', fontSize: 20, color: '#fff' }}>Invoice</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                            :
                            <ActivityIndicator size="large" color="blue" ></ActivityIndicator>
                        }
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