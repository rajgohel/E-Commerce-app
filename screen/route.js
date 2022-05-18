import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import Home from './home';
import DrawerNavigator from '../navigation/drawerNavigator';
import Login from './login';
import SignUp from './signUp';
import Cart from './cart';
import ForgotPassword from './forgotPassword';
import Search from './search';
import MyAccount from './myAccount';
import ChangePassword from './changePassword';
import Product from './product';
import WishList from './wishList';
import CheckOut from './checkOut';
import Address from './address';
import AddAddress from './addAddress';
import EditAddress from './editAddress';
import OrderHistory from './orderHistory';
import OrderDetail from './orderDetail';
import CategoryDetail from './categoryDetail';
import OrderPlaced from './orderPlaced';
import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { StatusBar, View } from 'react-native';

/**
 * Signout Route
 */
const SignOutStack = createStackNavigator({

    DrawerNavigator: {
        screen: DrawerNavigator,
        navigationOptions: {
            header: null
        }
    },

    Home: {
        screen: Home,
        navigationOptions: {
            header: null
        }
    },

    Login: {
        screen: Login,
        navigationOptions: {
            header: null
        }
    },

    SignUp: {
        screen: SignUp,
        navigationOptions: {
            header: null
        }
    },

    Cart: {
        screen: Cart,
        navigationOptions: {
            header: null
        }
    },

    ForgotPassword: {
        screen: ForgotPassword,
        navigationOptions: {
            header: null
        }
    },

    Search: {
        screen: Search,
        navigationOptions: {
            header: null
        }
    },

    Product: {
        screen: Product,
        navigationOptions: {
            header: null
        }
    },

    CategoryDetail: {
        screen: CategoryDetail,
        navigationOptions: {
            header: null
        }
    }
});

/**
 * SignIn route
 */
const SignInStack = createStackNavigator({

    DrawerNavigator: {
        screen: DrawerNavigator,
        navigationOptions: {
            header: null
        }
    },

    Home: {
        screen: Home,
        navigationOptions: {
            header: null
        }
    },

    MyAccount: {
        screen: MyAccount,
        navigationOptions: {
            header: null
        }
    },

    ChangePassword: {
        screen: ChangePassword,
        navigationOptions: {
            header: null
        }
    },

    WishList: {
        screen: WishList,
        navigationOptions: {
            header: null
        }
    },

    ForgotPassword: {
        screen: ForgotPassword,
        navigationOptions: {
            header: null
        }
    },

    CheckOut: {
        screen: CheckOut,
        navigationOptions: {
            header: null
        }
    },

    Address: {
        screen: Address,
        navigationOptions: {
            header: null
        }
    },

    AddAddress: {
        screen: AddAddress,
        navigationOptions: {
            header: null
        }
    },

    EditAddress: {
        screen: EditAddress,
        navigationOptions: {
            header: null
        }
    },

    OrderHistory: {
        screen: OrderHistory,
        navigationOptions: {
            header: null
        }
    },

    OrderDetail: {
        screen: OrderDetail,
        navigationOptions: {
            header: null
        }
    },

    CategoryDetail: {
        screen: CategoryDetail,
        navigationOptions: {
            header: null
        }
    },

    OrderPlaced: {
        screen: OrderPlaced,
        navigationOptions: {
            header: null
        }
    },

    Cart: {
        screen: Cart,
        navigationOptions: {
            header: null
        }
    }
});

class AuthLoadingScreen extends React.Component {
    constructor() {
        super();
        this._bootstrapAsync();
    }
    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const curruntUser = await AsyncStorage.getItem('token');

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(curruntUser ? 'SignIn' : 'signOut');
    };
    render() {
        return (
            <View>
                {/* <ActivityIndicator size="large" color="#ef6858" /> */}
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

const Routes = createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        signOut: SignOutStack,
        SignIn: SignInStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
));

export default Routes;