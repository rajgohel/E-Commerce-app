import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, BackHandler, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import service from '../service/service';
import { SliderBox } from 'react-native-image-slider-box';
import { config } from '../config';
import HTML from 'react-native-render-html';
import alertService from '../service/alertService';
import { Header } from "native-base";
import AsyncStorage from '@react-native-community/async-storage';
const _ = require('lodash');
import CardView from 'react-native-cardview';
import MenuButton from "../component/menuButton";
import Swiper from 'react-native-swiper'

export default class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      productDetail: '',
      relatedProductDetail: '',
      wishListDetail: '',
      empty: '',
      token: '',
      cartCount: '',
      wishListCount: '',
      name: '',
      qty: 1
    };
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.getProduct();
        this.getRelatedProduct();
        this.getWishList();
        this.getToken();
        this.profile();
        this.props.navigation.closeDrawer();
      });
  }
  componentDidMount() {
    console.log("id=============", this.props.navigation.state.params.productId);
    this.getProduct();
    this.getWishList();
    this.getRelatedProduct();
    this.getToken();
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.backEvent);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  /**
   * back event
   */
  backEvent = () => {
    this.setState({ images: [], productDetail: '', relatedProductDetail: '' })
  }

  /**
     * get token value
     */
  getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log('value of token in menu drawer-=-=', token);
    this.setState({ token: token });
  }

  /**
   * get product from wishlist
   */
  getWishList = () => {
    service.getWishListData()
      .then(async (response) => {
        console.log('response from wishlist in product screen-=-=', response.data.data);
        this.setState({
          wishListDetail: response.data.data,
          wishListCount: response.data.data.length
        })
        console.log('wishlist detail in product page=====', this.state.wishListDetail);
        this.checkWishList();
        let cartCount = await AsyncStorage.getItem('cartCount');
        this.setState({
          cartCount: cartCount
        })
        console.log('cart count in product page=====', cartCount);
      })
      .catch((err) => {
        console.log('err from wishlist in product screen-=-=', err);
      })
  }

  /**
   * check wishlist for icon
   */
  checkWishList = () => {
    let id = this.props.navigation.state.params.productId;
    console.log('wishlist detail in product page checkWishList method=====', this.state.wishListDetail);
    this.state.wishListDetail.map((data) => {
      console.log('data in checkWishList=====', data.productId);
      console.log('id of product=====', id);
      if (data.productId == id) {
        this.state.productDetail.isLike = true;
        console.log("islikeed key true=========>", this.state.productDetail.isLike);
        this.setState({ empty: 'b' })
      }
    })
  }

  /**
   * @param {*} product id
   * add product to wishlist
   */
  addToWishList = (productId) => {
    console.log('productId in addToWishList-=-=', productId);
    const obj = {
      productId: productId
    }
    service.addProductToWishlist(obj)
      .then((response) => {
        console.log('response from wishList-=-=', response.data);
        alertService.alerAndToast('Product added to wishlist');
        this.state.productDetail.isLike = true;
        this.setState({
          productDetail: this.state.productDetail
        })
        this.getWishList();
      })
      .catch((err) => {
        console.log('error from wishList-=-=', err);
        alertService.alerAndToast('Product already added in wishlist');
      })
  }

  /**
   * get product detail
   */
  getProduct = () => {
    service.getProductData(this.props.navigation.state.params.productId)
      .then((response) => {
        console.log('response of getProduct-=-=', response.data.data);
        this.setState({
          productDetail: response.data.data,
          images: []
        })
        this.state.productDetail['isLike'] = false;
        console.log('this.state.productDetail-=-=', this.state.productDetail);
        this.state.productDetail.map((data) => {
          data.productImage.map((productImg) => {
            this.setState({
              images: [...this.state.images, config.baseMediaUrl + productImg.containerName + productImg.image],
              qty: 1
            })
          })
        })
      })
      .catch((err) => {
        console.log('error of getProduct-=-=', err);
      })
  }

  /**
   * View related product
   */
  getRelatedView = (productId) => {
    this.setState({
      images: []
    })
    service.getProductData(productId)
      .then((response) => {
        console.log('response of related Product view-=-=', response.data.data);
        this.setState({
          productDetail: response.data.data
        })
        console.log('this.state.productDetail-=-=', this.state.productDetail);
        this.state.productDetail.map((data) => {
          data.productImage.map((productImg) => {
            this.setState({
              images: [...this.state.images, config.baseMediaUrl + productImg.containerName + productImg.image]
            })
          })
        })
      })
      .catch((err) => {
        console.log('error of related Product view-=-=', err);
      });

    service.getRelatedProductData(productId)
      .then((response) => {
        console.log('response of get related product-=-=', response.data.data);
        this.setState({
          relatedProductDetail: response.data.data
        })
      })
      .catch((err) => {
        console.log('error of related product-=-=', err);
      })
  }

  /**
   * get related product
   */
  getRelatedProduct = () => {
    service.getRelatedProductData(this.props.navigation.state.params.productId)
      .then((response) => {
        console.log('response of get related product-=-=', response.data.data);
        this.setState({
          relatedProductDetail: response.data.data
        })
      })
      .catch((err) => {
        console.log('error of related product-=-=', err);
      })
  }

  /**
   * @param {JSON} productId
   * add to cart
   */
  addToCart = async (productId) => {
    console.log('productId in event-=-=', productId);
    const value = await AsyncStorage.getItem('pid');
    const arr = [];
    console.log('value=====', value);
    arr.push(value);
    arr.push(productId);
    // await AsyncStorage.removeItem('qtyObj');
    const valueSec = await AsyncStorage.getItem('qtyObj');
    const secondArr = [];
    secondArr.push(valueSec);
    secondArr.push(productId + ':' + this.state.qty);
    const val = _.filter(secondArr);
    await AsyncStorage.setItem('qtyObj', val.toString());
    console.log('secondArr in product=====', secondArr);
    console.log('qtyObj=====', await AsyncStorage.getItem('qtyObj'));
    const strVal = arr.toString();
    console.log('strVal=====', strVal);
    const arrVal = strVal.split(',');
    console.log('arrVal=====', _.uniq(arrVal));
    const filter = _.filter(_.uniq(arrVal), _.size);
    console.log('filter=====', filter);
    await AsyncStorage.setItem('pid', arr.toString());
    await AsyncStorage.setItem('cartCount', filter.length.toString());
    console.log('filter array for cart count======', filter.length.toString());
    console.log('updated arr-=-=', arr);
    let cartCount = await AsyncStorage.getItem('cartCount');
    this.setState({
      cartCount: cartCount
    })
    console.log('cart count in product page in product method=====', cartCount);
    if (value != null) {
      if (value.indexOf(productId) == -1) {
        alertService.alerAndToast('Product added in Cart');
      } else {
        alertService.alerAndToast('Product already added in Cart');
      }
    } else {
      alertService.alerAndToast('Product added in Cart');
    }
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
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => { this.props.navigation.navigate('Home'); this.setState({ images: [], productDetail: '' }) }}>
              <Image source={require('../assets/image/leftHeader.png')} style={{ height: 20, width: 30, marginLeft: 10 }}></Image>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 4 }}><Text style={{ fontSize: 20, padding: 10 }}>Product</Text></View>
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
          {/* <SliderBox
            images={this.state.images}
            parentWidth={this.state.width}
          // paginationBoxVerticalPadding={200}
          // circleLoop
          /> */}
          {this.state.productDetail ?
            this.state.productDetail.map((data, index) => {
              return (
                <Swiper key={index} style={styles.wrapper} dotColor={'white'} activeDotColor={'lightgray'}>
                  {data.productImage.map((productImg, index) => {
                    return (
                      <View key={index}>
                        <Image style={{
                          height: 210, resizeMode: 'contain'
                        }} source={{ uri: config.baseMediaUrl + productImg.containerName + productImg.image }} />
                      </View>
                    )
                  })
                  }
                </Swiper>
              )
            })
            :
            null}
          {this.state.productDetail && this.state.productDetail.length ?
            this.state.productDetail.map((data, index) => {
              return (
                <View key={index} style={{ padding: 10 }}>
                  <View style={{ backgroundColor: 'lightgray', padding: 10 }}>
                    <View>
                      <Text style={{ fontSize: 20 }}>{data.name}</Text>
                      <Text>Price: {data.price} $</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      {this.state.productDetail.isLike
                        ?
                        <TouchableOpacity
                          style={[styles.wishListBtn, { backgroundColor: 'red' }]}
                          onPress={() => this.addToWishList(data.productId)}>
                          < Image source={require('../assets/image/bfav.png')} style={{ height: 20, width: 20 }} ></Image>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                          style={styles.wishListBtn}
                          onPress={() => this.addToWishList(data.productId)}>
                          < Image source={require('../assets/image/bfav.png')} style={{ height: 20, width: 20 }} ></Image>
                        </TouchableOpacity>
                      }
                    </View>
                    <View style={{ marginTop: 5 }}>
                      <TouchableOpacity style={styles.cartBtn}
                        onPress={() => this.addToCart(data.productId)}
                      >
                        <Text style={{ color: '#fff' }}>
                          <Image source={require('../assets/image/cartW.png')} style={{ height: 20, width: 20, marginTop: 5 }} ></Image>
                          Add to cart
                          </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ alignSelf: 'center', marginLeft: -17 }}>
                      <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ marginTop: 5 }}>Qty: </Text>
                        <TouchableOpacity
                          style={[styles.buttonContainer, styles.loginButton, { marginLeft: 5 }]}
                          onPress={() => {
                            if (this.state.qty > 1) {
                              this.setState({
                                qty: this.state.qty - 1
                              })
                            }
                          }}
                        ><Text style={styles.counterBtn}>-</Text></TouchableOpacity>
                        <Text style={{ fontSize: 20, marginLeft: 5, marginRight: 5 }}>{this.state.qty}</Text>
                        <TouchableOpacity
                          style={[styles.buttonContainer, styles.loginButton]}
                          onPress={() => {
                            this.setState({
                              qty: this.state.qty + 1
                            })
                          }}
                        ><Text style={styles.counterBtn}>+</Text></TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 20, marginBottom: 10 }}>Description</Text>
                    <HTML html={data.description} />
                  </View>
                </View>
              )
            }) :
            <ActivityIndicator size="large" color="blue" ></ActivityIndicator>
          }
          {this.state.relatedProductDetail ?
            this.state.relatedProductDetail.map((data, index) => {
              return (
                <View key={index}>
                  <Text style={{ padding: 10, fontSize: 20 }}>Related Product</Text>
                  <View style={{ padding: 20, flexDirection: 'row' }}>
                    {/* <TouchableOpacity onPress={() => { this.getRelatedView(data.productId) }}> */}
                    <CardView
                      cardElevation={2}
                      cardMaxElevation={2}
                      cornerRadius={5}
                      style={{ padding: 20 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image style={{ height: 100, width: 100, resizeMode: 'contain' }} source={{ uri: config.baseMediaUrl + data.productImage.containerName + data.productImage.image }}></Image>
                        <View style={{ marginLeft: 20, flexDirection: 'column' }}>
                          <Text style={{ width: 160 }}>{data.name}</Text>
                          <Text>{data.price} $</Text>
                        </View>
                      </View>
                    </CardView>
                    {/* </TouchableOpacity> */}
                  </View>
                </View>
              )
            })
            : null}
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
  wishListBtn: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  cartBtn: {
    backgroundColor: 'gray',
    alignItems: 'center',
    borderRadius: 10,
    padding: 5
  },
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
  wrapper: {
    height: 230
  }
});