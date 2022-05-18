import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
const _ = require('lodash');
import service from '../service/service';
import { Header } from "native-base";
import { config } from '../config';
import MenuButton from "../component/menuButton";
import Spinner from 'react-native-loading-spinner-overlay';

let finalArr = [];
let priceArr = [];
let total = 0;
let productDetail = [];
let isEmpty = false;

export default class Cart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cartItem: '',
      demo: '',
      token: '',
      name: '',
      wishListCount: '',
      spinner: false,
      qtyArrObj: ''
    }
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.getToken();
        this.profile();
        this.getWishList();
        this.getItem();
      });
    // this.getItem();
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.backEvent);
  }

  /**
   * back event
   */
  backEvent = () => {
    priceArr = [];
  }

  /**
   * get product
   */
  getItem = async () => {
    productDetail = [];
    isEmpty = false;
    this.setState({
      cartItem: '',
      spinner: !this.state.spinner
    })
    console.log('get item call============');
    const value = await AsyncStorage.getItem('pid');
    await AsyncStorage.setItem('cartCount', finalArr.length.toString());
    console.log('value of value-=-=', value);
    if (value != null) {
      isEmpty = false;
      const val = _.uniq(value.split(','));
      console.log('value of val-=-=', val);
      const filter = _.filter(val, _.size);
      console.log('value of filter-=-=', filter, priceArr);
      finalArr = filter;
      let finalArrLength = finalArr.length;
      console.log('cart count in get item=====', finalArrLength);
      await AsyncStorage.setItem('cartCount', finalArrLength.toString());
      const valueSec = await AsyncStorage.getItem('qtyObj');
      const qtyArr = valueSec.split(',');
      console.log('qtyArr=====', qtyArr);
      this.setState({
        qtyArrObj: qtyArr
      })
      finalArr.map((id) => {
        console.log('id-=-=', id);
        service.getProductData(id)
          .then(async (response) => {
            console.log('respone from cart-=-=', response.data.data);
            this.state.qtyArrObj.map((data) => {
              if (data.split(':')[0] == id) {
                response.data.data[0]['qty'] = data.split(':')[1];
              }
            })
            console.log('priceArr initial-=-=', priceArr, response.data.data[0].price);
            let index = priceArr.indexOf(response.data.data[0].price);
            if (index === -1) {
              for (let i = 1; i <= response.data.data[0]['qty']; i++) {
                priceArr.push(response.data.data[0].price);
              }
            }
            console.log('price array-=-=', priceArr);
            this.setState({
              cartItem: [...this.state.cartItem, ...response.data.data],
              spinner: false
            })
            const obj = {
              productId: response.data.data[0].productId,
              quantity: response.data.data[0].qty,
              price: response.data.data[0].price,
              name: response.data.data[0].name
            }
            productDetail.push(obj);
            console.log('productDetail array-=-=', productDetail);
            console.log('cartItem-=-=', this.state.cartItem);
          })
          .catch((err) => {
            console.log('err from cart-=-=', err);
          })
      })
    } else {
      isEmpty = true;
    }
    this.setState({
      spinner: false
    })
  }

  /**
   * @param {*} productId, price
   * delete product from cart
   */
  deleteFromCart = async (pid, price, i) => {
    priceArr.splice(_.findIndex(priceArr, price), 1);
    console.log("pricearr==========>", priceArr, i, finalArr[i]);
    const index = finalArr.indexOf(pid);
    if (index !== -1) {
      finalArr.splice(index, 1);
    }
    console.log('finalArr-=-=', finalArr);
    console.log('product detail in befor delete product=====', productDetail);
    let filtred = productDetail.filter((el) => {
      return el.productId != pid
    })
    console.log('filtred array=====', _.uniq(filtred));
    let filter = _.uniq(filtred);
    productDetail = filter;
    console.log('product detail in after delete product=====', productDetail);
    await AsyncStorage.setItem('pid', finalArr.toString());
    priceArr = [];
    productDetail = [];
    this.getItem();
    this.setState({
      cartItem: '',
      spinner: false
    })
  }

  /**
   * @param {*} index
   * decrement qty
   */
  decrement = (id) => {
    console.log('index in decrement-=-=', id);
    console.log(this.state.cartItem[id].qty);
    if (this.state.cartItem[id].qty > 1) {
      this.state.cartItem[id].qty = this.state.cartItem[id].qty - 1;
      console.log("price=>", priceArr);
      const index = priceArr.indexOf(this.state.cartItem[id].price);
      productDetail[index].quantity = productDetail[index].quantity - 1;
      if (index !== -1) {
        priceArr.splice(index, 1);
      }
    }
    // console.log("price after if=>", priceArr);
    this.setState({
      demo: ''
    })
    // console.log(this.state.cartItem[index]);
    // console.log("after decrement=============", this.state.cartItem[index].qty);
  }

  /**
   * @param {*} index
   * increment qty
   */
  increment = (index) => {
    // console.log('index in increment-=-=', index, productDetail[index]);
    // console.log(this.state.cartItem[index]);
    this.state.cartItem[index].qty = +this.state.cartItem[index].qty + +1;
    // console.log(this.state.cartItem[index]);
    priceArr.push(this.state.cartItem[index].price);
    // console.log("product detail==========>",productDetail);
    productDetail[index].quantity = +productDetail[index].quantity + +1;
    // console.log("product detail==========>",productDetail);
    this.setState({
      demo: ''
    })
    console.log(this.state.cartItem[index]);
    console.log("after increment=============", this.state.cartItem[index].qty);
    console.log('productDetail array after increment-=-=', productDetail);
  }

  /**
     * get token value
     */
  getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log('value of token in cart-=-=', token);
    this.setState({ token: token });
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

  /**
   * get product from wishlist
   */
  getWishList = () => {
    service.getWishListData()
      .then(async (response) => {
        console.log('response from wishlist cart screen-=-=', response.data.data);
        this.setState({
          wishListCount: response.data.data.length
        })
        console.log('wishlist count in cart page=====', this.state.wishListCount);
      })
      .catch((err) => {
        console.log('err from wishlist-=-=', err);
      })
  }

  /**
   * total amount
   */
  totalFunc = () => {
    total = _.sum(priceArr);
    return total;
  }

  render() {
    return (
      <>
        <Header style={styles.header}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => { this.props.navigation.navigate('Home'), priceArr = [] }}>
              <Image source={require('../assets/image/leftHeader.png')} style={{ height: 20, width: 30, marginLeft: 10 }}></Image>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Shopping Cart</Text></View>
        </Header>
        <View style={{ padding: 10, flexDirection: 'row' }}>
          <MenuButton navigation={this.props.navigation} />
          <View style={{ flex: 7 }}>
            <Text style={{ color: '#00306a', fontSize: 25, marginLeft: 10 }}>CMERCE</Text>
          </View>
          <View style={{ flex: 2, flexDirection: 'row' }}>
            {/* <Image source={require('../assets/image/viewMore.png')} style={{ height: 30, width: 30, marginTop: 5, marginLeft: 10 }} ></Image> */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Search')}>
              <Image source={require('../assets/image/search.png')} style={{ height: 30, width: 30, marginTop: 5, marginLeft: 10 }}></Image>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View style={styles.container}>
            <Spinner
              visible={this.state.spinner}
              textContent={'Loading...'}
              textStyle={styles.spinnerTextStyle}
            />
          </View>
          <View style={{ padding: 20 }}>
            {this.state.cartItem.length ?
              this.state.cartItem.map((data, index) => {
                return (
                  <View key={index} style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2, padding: 10 }}>
                      <Image style={{ height: 50, width: 50, resizeMode: 'contain' }} source={{ uri: config.baseMediaUrl + data.productImage[0].containerName + data.productImage[0].image }} />
                    </View>
                    <View style={{ flex: 8, padding: 10 }}>
                      <View style={{ flexDirection: 'column' }}>
                        <Text>{data.name}</Text>
                        <Text>{data.price} $</Text>
                        <View style={{ height: 30, width: 30 }}>
                          <TouchableOpacity onPress={() => this.deleteFromCart(data.productId, data.price, index)}>
                            <Image source={require('../assets/image/delete.png')} style={{ height: 30, width: 30, marginTop: 5, marginLeft: 10 }}></Image>
                          </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                          <Text style={{ marginTop: 5 }}>Qty: </Text>
                          <TouchableOpacity
                            style={[styles.buttonContainer, styles.loginButton, { marginLeft: 5 }]}
                            onPress={() => this.decrement(index)}
                          ><Text style={styles.counterBtn}>-</Text></TouchableOpacity>
                          <Text style={{ fontSize: 20, backgroundColor: '#fff', marginLeft: 5, marginRight: 5 }}>{data.qty}</Text>
                          <TouchableOpacity
                            style={[styles.buttonContainer, styles.loginButton]}
                            onPress={() => this.increment(index)}
                          ><Text style={styles.counterBtn}>+</Text></TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              }) :
              null}
          </View>
          {this.state.cartItem.length ?
            <>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, padding: 20 }}>Total</Text>
                <Text style={{ fontSize: 20, padding: 20, right: 10, position: 'absolute' }}>{this.totalFunc()} $</Text>
              </View>
              <TouchableOpacity
                style={{ borderRadius: 5, backgroundColor: 'purple', margin: 20 }}
                onPress={() => {
                  this.props.navigation.navigate('CheckOut', {
                    productDetail: productDetail
                  })
                  productDetail = []
                }}>
                <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 15, padding: 10, textTransform: 'uppercase' }}>Place Order</Text>
              </TouchableOpacity>
            </> : null}
          {isEmpty ?
            <>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 30 }}>Your cart is empty!</Text>
                <Text style={{ fontSize: 15, color: 'gray', marginTop: 20 }}>Add items to it now</Text>
              </View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}
                style={{ padding: 20 }}>
                <View style={{ alignItems: 'center', backgroundColor: '#00306a', padding: 10 }}>
                  <Text style={{ color: '#fff', fontSize: 20 }}>Shop now</Text>
                </View>
              </TouchableOpacity>
            </> : null}
        </ScrollView>
        <View style={{ height: 50, backgroundColor: '#00306a', padding: 5, flexDirection: 'row' }}>
          <View style={{ flex: 2 }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('WishList')}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/image/fav-white.png')} style={{ height: 30, width: 30, marginTop: 5, marginLeft: 10 }} ></Image>
                {this.state.token ?
                  <View style={{ backgroundColor: '#ffc700', borderRadius: 50, height: 20, width: 20 }}>
                    <Text style={{ alignSelf: 'center' }}>{this.state.wishListCount ? this.state.wishListCount : 0}</Text>
                  </View> :
                  null}
              </View>
            </TouchableOpacity>
          </View>
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
    marginBottom: 5,
    marginTop: Platform.OS == 'ios' ? 20 : null
  },
  iconButton: {
    height: 50,
    width: 50,
    top: Platform.OS === 'ios' ? null : 20
  },
  buttonContainer: {
    borderRadius: 50,
    // height: 45,
    justifyContent: "center",
    alignItems: "center",
    width: 27,
    // borderRadius: 30
  },
  loginButton: {
    backgroundColor: "#4285f4"
  },
  counterBtn: {
    color: '#fff',
    fontSize: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});