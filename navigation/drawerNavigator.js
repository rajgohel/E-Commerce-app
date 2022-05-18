import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';

import Home from '../screen/home';
import WishList from '../screen/wishList';
import Product from '../screen/product';
import ContactUs from '../screen/contactUs';
import Cart from '../screen/cart';

import MenuDrawer from '../component/menuDrawer';

const WIDTH = Dimensions.get('window').width;

const DrawerConfig = {
    drawerWidth: WIDTH * 0.83,
    contentComponent: ({ navigation }) => {
        return (<MenuDrawer navigation={navigation} />)
    }
}

const DrawerNavigator = createDrawerNavigator(
    {
        Home: {
            screen: Home
        },
        WishList: {
            screen: WishList
        },
        Product: {
            screen: Product
        },
        ContactUs: {
            screen: ContactUs
        },
        Cart: {
            screen: Cart
        }
    },
    DrawerConfig
);

export default createAppContainer(DrawerNavigator);