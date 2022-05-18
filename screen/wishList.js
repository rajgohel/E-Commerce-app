import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import service from '../service/service';
import { config } from '../config';
import { Header } from "native-base";
import AsyncStorage from '@react-native-community/async-storage';
import alertService from '../service/alertService';
const _ = require('lodash');
import MenuButton from "../component/menuButton";

export default class WishList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wishListDetail: '',
      token: '',
      cartCount: '',
      name: ''
    };
    this.getWishList();
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.getWishList();
        this.getToken();
        this.profile();
      });
  }

  /**
   * get product from wishlist
   */
  getWishList = () => {
    service.getWishListData()
      .then(async (response) => {
        console.log('response from wishlist page-=-=', response.data.data);
        this.setState({
          wishListDetail: response.data.data
        })
        console.log('wishlist count');
        let cartCount = await AsyncStorage.getItem('cartCount');
        this.setState({
          cartCount: cartCount
        })
        console.log('cart count in wishlist page=====', cartCount);
      })
      .catch((err) => {
        console.log('err from wishlist page-=-=', err);
      })
  }

  /**
     * get token value
     */
  getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log('value of token in wishlist-=-=', token);
    this.setState({ token: token });
  }

  /**
   * @param {*} product id
   * delete product from wishlist
   */
  deleteProduct = (pid) => {
    service.deleteProductWishList(pid)
      .then((response) => {
        console.log('response from delete wish list-=-=', response.data.data);
        this.getWishList();
      })
      .catch((err) => {
        console.log('error from delete wish list-=-=', err);
      })
  }

  /**
   * @param {JSON} productId, _id
   * add to cart
   */
  addToCart = async (productId, id) => {
    console.log('productId in wishlist-=-=', productId);
    const value = await AsyncStorage.getItem('pid')
    const arr = [];
    arr.push(value);
    arr.push(productId);
    const strVal = arr.toString();
    console.log('strVal=====', strVal);
    const arrVal = strVal.split(',');
    console.log('arrVal=====', _.uniq(arrVal));
    const filter = _.filter(_.uniq(arrVal), _.size);
    console.log('filter=====', filter);
    await AsyncStorage.setItem('pid', arr.toString());
    await AsyncStorage.setItem('cartCount', filter.length.toString());
    const valueSec = await AsyncStorage.getItem('qtyObj');
    const secondArr = [];
    secondArr.push(valueSec);
    secondArr.push(productId + ':' + '1');
    const val = _.filter(secondArr);
    await AsyncStorage.setItem('qtyObj', val.toString());
    console.log('secondArr in wishlist=====', secondArr);
    console.log('qtyObj=====', await AsyncStorage.getItem('qtyObj'));
    console.log('filter array for cart count======', filter.length.toString());
    console.log('updated arr in wishlist-=-=', arr);
    alertService.alerAndToast('Product added in Cart');
    let cartCount = await AsyncStorage.getItem('cartCount');
    this.setState({
      cartCount: cartCount
    })
    console.log('cart count in wishlist page cart method=====', cartCount);
    this.deleteProduct(id);
  }

  /**
     * get profile
     */
  profile = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      service.getProfileData()
        .then(async (response) => {
          console.log('response in get profile home page-=-=', response.data.data);
          this.setState({
            name: response.data.data.firstName
          })
          console.log('state name-=-=', this.state.name);
        })
        .catch((err) => {
          console.log('err in get profile home page-=-=', err);
        })
    } else {
      console.log('No token found');
    }
  }

  render() {
    return (
      <>
        <Header style={styles.header}>
          <View style={{ flex: 2, flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => this.props.navigation.navigate('Home')}>
              <Image source={require('../assets/image/leftHeader.png')} style={{ height: 20, width: 30, marginLeft: 10 }}></Image>
            </TouchableOpacity>
            <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Wishlist</Text></View>
          </View>
        </Header>
        <View style={{ padding: 10, flexDirection: 'row' }}>
          <MenuButton navigation={this.props.navigation} />
          <View style={{ flex: 4 }}>
            <Text style={{ color: '#00306a', fontSize: 25, marginLeft: 10 }}>CMERCE</Text>
          </View>
          <View style={{ flex: 3, flexDirection: 'row' }}>
            {/* <Image source={require('../assets/image/viewMore.png')} style={{ height: 30, width: 30, marginTop: 5, marginLeft: 10 }} ></Image> */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Search')}>
              <Image source={require('../assets/image/search.png')} style={{ height: 30, width: 30, marginTop: 5, marginLeft: 10 }}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Cart')}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/image/cart.png')} style={{ height: 30, width: 30, marginTop: 5, marginLeft: 10 }} ></Image>
                {this.state.token ?
                  <View style={{ backgroundColor: '#ffc700', borderRadius: 50, height: 20, width: 20 }}>
                    <Text style={{ alignSelf: 'center' }}>{this.state.cartCount ? this.state.cartCount : 0}</Text>
                  </View> :
                  null}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          {this.state.wishListDetail && this.state.wishListDetail.length ?
            this.state.wishListDetail.map((data, index) => {
              return (
                <View key={index} style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 2, padding: 10 }}>
                    <Image style={{ height: 50, width: 50, resizeMode: 'contain' }} source={{ uri: config.baseMediaUrl + data.productImage.containerName + data.productImage.image }} />
                  </View>
                  <View style={{ flex: 8, padding: 10 }}>
                    <View style={{ flexDirection: 'column' }}>
                      <Text>{data.product.name}</Text>
                      <Text>{data.product.price} $</Text>
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.deleteProduct(data._id)}>
                          <Image source={require('../assets/image/delete.png')} style={{ height: 30, width: 30, marginTop: 5, marginLeft: 10 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cartBtn}
                          onPress={() => this.addToCart(data.productId, data._id)}
                        >
                          <Text style={{ color: '#fff' }}>
                            <Image source={require('../assets/image/cartW.png')} style={{ height: 20, width: 20 }} ></Image>
                            Add to cart
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })
            :
            <>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 30 }}>No items yet</Text>
                <Text style={{ fontSize: 15, color: 'gray', marginTop: 20 }}>Simply browse and tap on the heart icon</Text>
              </View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}
                style={{ padding: 20 }}>
                <View style={{ alignItems: 'center', backgroundColor: '#00306a', padding: 10 }}>
                  <Text style={{ color: '#fff', fontSize: 20 }}>Continue Shopping</Text>
                </View>
              </TouchableOpacity>
            </>}
        </ScrollView>
        <View style={{ height: 50, backgroundColor: '#00306a', padding: 5, flexDirection: 'row' }}>
          <View style={{ flex: 2 }}></View>
          <View style={{ flex: 4, flexDirection: 'row' }}>
            {this.state.token ?
              <>
                <Image source={require('../assets/image/user.png')} style={{ height: 30, width: 30, marginTop: 5 }} ></Image>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('MyAccount')}>
                  <Text style={{ color: '#fff', marginTop: 10, marginLeft: 4 }}>MY ACCOUNT</Text>
                </TouchableOpacity>
              </>
              : null}
          </View>
          <View style={{ flex: 4 }}>
            {!this.state.name && !this.state.name.length ?
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                <Text style={{ color: '#fff', marginTop: 10 }}>LOGIN/REGISTER</Text>
              </TouchableOpacity> :
              <Text style={{ color: '#fff', marginTop: 10, textTransform: 'uppercase' }}>welcome {this.state.name}</Text>}
          </View>
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
  iconButton: {
    height: 50,
    width: 50,
    top: Platform.OS === 'ios' ? null : 20
  },
  cartBtn: {
    backgroundColor: 'gray',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10
  }
});