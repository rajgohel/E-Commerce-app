import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Text, Image, ScrollView, ActivityIndicator, TextInput } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { SliderBox } from 'react-native-image-slider-box';
import service from '../service/service';
import { Container, Header, DeckSwiper, Card, CardItem, Left, Button, Body, Icon, Thumbnail, List, ListItem, Separator } from 'native-base';
import { config } from '../config';
// import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import MenuButton from "../component/menuButton";
import AsyncStorage from '@react-native-community/async-storage';
import Swiper from 'react-native-swiper'

const cards = [];
const cardsSec = [{
    text: 'Card One',
    name: 'LOREM IPSUM DOLOR SIT AMET',
    image: require('../assets/image/product_2.jpg'),
    price: '314'
},
{
    text: 'Card One',
    name: 'LOREM IPSUM DOLOR SIT AMET',
    image: require('../assets/image/product_3.jpg'),
    price: '379'
},
{
    text: 'Card One',
    name: 'LOREM IPSUM DOLOR SIT AMET',
    image: require('../assets/image/product_4.jpg'),
    price: '107'
}];
const cardsThird = [{
    image: require('../assets/image/blog_1.jpg'),
},
{
    image: require('../assets/image/blog_2.jpg'),
}];

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            bannerImage: null,
            featureProduct: null,
            width: '',
            token: '',
            name: '',
            cartCount: '',
            wishListCount: ''
        };
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.featureProduct();
                this.getToken();
                this.profile();
                this.getWishList();
            });
        this.profile();
        this.getBannerImage();
        this.featureProduct();
        this.getToken();
        this.getWishList();
    }

    /**
   * get product from wishlist
   */
    getWishList = () => {
        service.getWishListData()
            .then(async (response) => {
                console.log('response from wishlist page-=-=', response.data.data);
                this.setState({
                    wishListCount: response.data.data.length
                })
                console.log('wishlist count in home page=====', this.state.wishListCount);
            })
            .catch((err) => {
                console.log('err from wishlist-=-=', err);
            })
    }

    /**
     * banner images
     */
    getBannerImage = () => {
        service.bannerImage()
            .then(response => {
                console.log('response-=-=', response.data.data);
                this.setState({
                    bannerImage: response.data.data
                })
                console.log('this.state.bannerImage', this.state.bannerImage);
                this.state.bannerImage.map((data) => {
                    this.setState({
                        images: [...this.state.images, config.baseMediaUrl + data.imagePath + data.image]
                    })
                })
                console.log('this.state.images-=-=', this.state.images);
            })
            .catch(err => {
                console.log('err-=-=', err);
            })
    }

    /**
     * feature product list
     */
    featureProduct = () => {
        service.getFeatureProduct()
            .then(async response => {
                console.log('response of feature products-=-=', response.data.data);
                this.setState({
                    featureProduct: response.data.data
                })
                this.state.featureProduct.map((data) => {
                    const obj = {
                        text: 'Card One',
                        name: data.name,
                        image: config.baseMediaUrl + data.Images.containerName + data.Images.image,
                        pid: data.productId,
                        price: data.price
                    }
                    cards.push(obj);
                    //console.log('cards-=-=', cards);
                })
                let cartCount = await AsyncStorage.getItem('cartCount');
                this.setState({
                    cartCount: cartCount
                })
                console.log('cart count in home page=====', cartCount);
            })
            .catch(err => {
                console.log('err-=-=', err);
            })
    }

    /**
     * get token value
     */
    getToken = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log('value of token in menu drawer-=-=', token);
        this.setState({ token: token });
    }

    onLayout = e => {
        this.setState({
            width: e.nativeEvent.layout.width
        });
    };

    /**
     * 
     * @param {*} item
     * get product   
     */
    renderitem(item) {
        console.log("index=============", item);
        this.props.navigation.navigate('Product', { productId: item.pid })
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
                    await AsyncStorage.setItem('customerId', response.data.data.id);
                    console.log('customerId in home page=====', await AsyncStorage.getItem('customerId'));
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
                <View style={{ padding: 10, flexDirection: 'row' }}>
                    <MenuButton navigation={this.props.navigation} />
                    <View style={{ flex: 4 }}>
                        <Text style={{ color: '#00306a', fontSize: 25, marginLeft: 10, fontFamily: 'Roboto Condensed', fontWeight: 'bold' }}>CMERCE</Text>
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
                    {this.state.bannerImage ?
                        <Swiper style={styles.wrapper} dotColor={'white'} activeDotColor={'lightgray'}>
                            {this.state.bannerImage.map((data, index) => {
                                return (
                                    <View key={index}>
                                        <Image style={{
                                            height: 210, resizeMode: 'stretch'
                                        }} source={{ uri: config.baseMediaUrl + data.imagePath + data.image }} />
                                    </View>
                                )
                            })}
                        </Swiper> :
                        <ActivityIndicator size="large" color="blue" ></ActivityIndicator>}
                    <Container style={{ padding: 10 }}>
                        <View style={{ flexDirection: 'row', padding: 15 }}>
                            <View style={{ flex: 5 }}>
                                <Text style={{ color: '#00306a', fontSize: 25, fontFamily: 'Roboto Condensed', fontWeight: 'bold' }}>NEW PRODUCTS</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={{ backgroundColor: '#00306a', borderRadius: 40, padding: 5 }} iconLeft onPress={() => this._deckSwiper._root.swipeLeft()}>
                                    <Image source={require('../assets/image/left.png')} style={{ height: 30, width: 30 }} ></Image>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity style={{ backgroundColor: '#00306a', borderRadius: 40, marginLeft: 5, padding: 5 }} iconRight onPress={() => this._deckSwiper._root.swipeRight()}>
                                    {/* <Icon name="arrow-forward" /> */}
                                    <Image source={require('../assets/image/right.png')} style={{ height: 30, width: 30 }} ></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            {
                                cards && cards.length
                                    ? <DeckSwiper
                                        ref={(c) => this._deckSwiper = c}
                                        dataSource={cards}
                                        renderItem={(item, index) =>
                                            <>
                                                <TouchableOpacity onPress={() => this.renderitem(item)}>
                                                    <Card style={{ elevation: 3 }}>
                                                        <CardItem cardBody>
                                                            <Image style={{ height: 300, flex: 1, resizeMode: 'contain' }} source={{ uri: item.image }} />
                                                        </CardItem>
                                                        <CardItem>
                                                            <View style={{ flexDirection: 'column' }}>
                                                                <Text>{item.name}</Text>
                                                                <Text>$ {item.price}</Text>
                                                            </View>
                                                        </CardItem>
                                                    </Card>
                                                </TouchableOpacity>
                                            </>
                                        }
                                    />
                                    : <ActivityIndicator size="large" color="blue" />
                            }
                        </View>
                    </Container>
                    <View style={{ flexDirection: 'row', padding: 10, marginTop: -190 }}>
                        <View style={{ flex: 5 }}>
                            <Image source={require('../assets/image/image_box_1.png')}></Image>
                        </View>
                        <View style={{ flex: 3 }}>
                            <View>
                                <Text style={{ lineHeight: 25, fontSize: 15 }}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry
                            </Text>
                            </View>
                            <View style={{ backgroundColor: 'yellow', padding: 5 }}>
                                <Text style={{ textTransform: 'uppercase', alignSelf: 'center' }}>View all</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <View style={{ flex: 3 }}>
                            <View>
                                <Text style={{ lineHeight: 25, fontSize: 15 }}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry
                            </Text>
                            </View>
                            <View style={{ backgroundColor: 'yellow', padding: 5 }}>
                                <Text style={{ textTransform: 'uppercase', alignSelf: 'center' }}>View all</Text>
                            </View>
                        </View>
                        <View style={{ flex: 5 }}>
                            <Image source={require('../assets/image/image_box_2.png')} style={{ height: 155, width: 210 }}></Image>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <View style={{ flex: 5 }}>
                            <Image source={require('../assets/image/image_box_3.png')}></Image>
                        </View>
                        <View style={{ flex: 3 }}>
                            <View>
                                <Text style={{ lineHeight: 25, fontSize: 15 }}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry
                            </Text>
                            </View>
                            <View style={{ backgroundColor: 'yellow', padding: 5 }}>
                                <Text style={{ textTransform: 'uppercase', alignSelf: 'center' }}>View all</Text>
                            </View>
                        </View>
                    </View>
                    <Container style={{ padding: 10, height: 500 }}>
                        <View style={{ flexDirection: 'row', padding: 15 }}>
                            <View style={{ flex: 5 }}>
                                <Text style={{ color: '#00306a', fontSize: 25, fontFamily: 'Roboto Condensed', fontWeight: 'bold' }}>BEST SELLER</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={{ padding: 5 }} iconLeft onPress={() => this.deckSwiper._root.swipeLeft()}>
                                    <Image source={require('../assets/image/leftL.png')} style={{ height: 30, width: 30 }} ></Image>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity style={{ marginLeft: 5, padding: 5 }} iconRight onPress={() => this.deckSwiper._root.swipeRight()}>
                                    {/* <Icon name="arrow-forward" /> */}
                                    <Image source={require('../assets/image/rightG.png')} style={{ height: 30, width: 30 }} ></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            {
                                cardsSec && cardsSec.length
                                    ? <DeckSwiper
                                        ref={(c) => this.deckSwiper = c}
                                        dataSource={cardsSec}
                                        renderItem={(item, index) =>
                                            <>
                                                <Card style={{ elevation: 3 }}>
                                                    <CardItem cardBody>
                                                        <Image style={{ height: 300, flex: 1 }} source={item.image} />
                                                    </CardItem>
                                                    <CardItem>
                                                        <View style={{ flexDirection: 'column' }}>
                                                            <Text style={{ color: 'gray' }}>WOMEN SHOES</Text>
                                                            <Text>{item.name}</Text>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Image source={require('../assets/image/starB.png')} style={{ height: 15, width: 15 }}></Image>
                                                                <Image source={require('../assets/image/starB.png')} style={{ height: 15, width: 15 }}></Image>
                                                                <Image source={require('../assets/image/starB.png')} style={{ height: 15, width: 15 }}></Image>
                                                                <Image source={require('../assets/image/starB.png')} style={{ height: 15, width: 15 }}></Image>
                                                                <Image source={require('../assets/image/star.png')} style={{ height: 15, width: 15 }}></Image>
                                                            </View>
                                                            <Text>$ {item.price}</Text>
                                                        </View>
                                                    </CardItem>
                                                </Card>
                                            </>
                                        }
                                    />
                                    : <ActivityIndicator size="large" color="blue" />
                            }
                        </View>
                    </Container>
                    <View style={{ backgroundColor: 'lightgray', padding: 10 }}>
                        <View style={{ padding: 10, backgroundColor: '#fff' }}>
                            <Text style={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: 25 }}>testimonial</Text>
                        </View>
                        <Swiper style={[styles.wrapper, { backgroundColor: '#fff' }]}>
                            <View style={styles.slide1}>
                                <Text style={[styles.text, { lineHeight: 25 }]}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            </Text>
                            </View>
                            <View style={styles.slide2}>
                                <Text style={[styles.text, { lineHeight: 25 }]}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            </Text>
                            </View>
                            <View style={styles.slide3}>
                                <Text style={[styles.text, { lineHeight: 25 }]}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            </Text>
                            </View>
                        </Swiper>
                    </View>
                    <Container style={{ padding: 10, height: 520 }}>
                        <View style={{ flexDirection: 'row', padding: 15 }}>
                            <View style={{ flex: 5 }}>
                                <Text style={{ color: '#00306a', fontSize: 25, fontFamily: 'Roboto Condensed', fontWeight: 'bold' }}>OUR BLOG</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={{ padding: 5 }} iconLeft onPress={() => this.deckSwiperT._root.swipeLeft()}>
                                    <Image source={require('../assets/image/leftL.png')} style={{ height: 30, width: 30 }} ></Image>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity style={{ marginLeft: 5, padding: 5 }} iconRight onPress={() => this.deckSwiperT._root.swipeRight()}>
                                    {/* <Icon name="arrow-forward" /> */}
                                    <Image source={require('../assets/image/rightG.png')} style={{ height: 30, width: 30 }} ></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            {
                                cardsThird && cardsThird.length
                                    ? <DeckSwiper
                                        ref={(c) => this.deckSwiperT = c}
                                        dataSource={cardsThird}
                                        renderItem={(item, index) =>
                                            <>
                                                <Card style={{ elevation: 3 }}>
                                                    <CardItem cardBody>
                                                        <Image style={{ height: 300, flex: 1 }} source={item.image} />
                                                    </CardItem>
                                                    <CardItem>
                                                        <View style={{ flexDirection: 'column' }}>
                                                            <Text style={{ fontWeight: 'bold' }}>NEW BRANDS ARRIVALS</Text>
                                                            <Text style={{ color: 'gray', marginBottom: 10 }}>Lorem ipsum dolor sit amet, cons adipiscing elite, sed do eiusmod</Text>
                                                            <View style={{ borderTopColor: 'gray', borderTopWidth: 1 }}>
                                                                <Text style={{ marginTop: 10, textTransform: 'uppercase', fontSize: 15, color: 'gray' }}>read more</Text>
                                                            </View>
                                                        </View>
                                                    </CardItem>
                                                </Card>
                                            </>
                                        }
                                    />
                                    : <ActivityIndicator size="large" color="blue" />
                            }
                        </View>
                    </Container>
                    <View style={{ backgroundColor: '#00306a', alignItems: 'center', padding: 20 }}>
                        <Image source={require('../assets/image/box1.png')} style={{ height: 40, width: 40, marginBottom: 10 }}></Image>
                        <Text style={{ textTransform: 'uppercase', fontSize: 20, fontWeight: 'bold', color: '#fff' }}>free worldwide delivery</Text>
                        <Text style={{ color: '#fff' }}>Lorem Ipsum Dolor Sit Amet</Text>
                        <Image source={require('../assets/image/back1.png')} style={{ height: 40, width: 40, marginTop: 15, marginBottom: 10 }}></Image>
                        <Text style={{ textTransform: 'uppercase', fontSize: 20, fontWeight: 'bold', color: '#fff' }}>money back guarantee</Text>
                        <Text style={{ color: '#fff' }}>Lorem Ipsum Dolor Sit Amet</Text>
                        <Image source={require('../assets/image/call1.png')} style={{ height: 40, width: 40, marginTop: 15, marginBottom: 10 }}></Image>
                        <Text style={{ textTransform: 'uppercase', fontSize: 20, fontWeight: 'bold', color: '#fff' }}>24/7 customer support</Text>
                        <Text style={{ color: '#fff' }}>Lorem Ipsum Dolor Sit Amet</Text>
                    </View>
                    <View style={{ backgroundColor: '#f3f4f6', alignItems: 'center', padding: 20 }}>
                        <Text style={{ textTransform: 'uppercase', fontWeight: 'bold', fontFamily: 'Roboto Condensed' }}>subscribe to newsletter</Text>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <View style={{ backgroundColor: '#fff', paddingRight: 50, paddingLeft: 50 }}>
                                <TextInput
                                    placeholder={'ENTER EMAIL'} />
                            </View>
                            <View style={{ backgroundColor: '#ffc700', justifyContent: 'center', paddingRight: 30, paddingLeft: 30 }}>
                                <Text style={{ textTransform: 'uppercase' }}>subscribe</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView >
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
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    wrapper: {
        height: 230
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: -40
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: -40
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: -40
    },
    text: {
        color: '#000',
        fontSize: 15,
    }
});

