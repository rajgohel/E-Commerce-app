import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import servise from '../service/service';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import AsyncStorage from '@react-native-community/async-storage';

class MenuDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryList: null,
            token: '',
            data: ''
        };
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.getToken()
            });
        this.categoryList();
        this.getToken();
    }

    componentDidMount() {
    }

    /**
     * category list
     */
    categoryList = () => {
        servise.getCategoryList()
            .then((response) => {
                // console.log('response of categoryList-=-=', response.data.data);
                this.setState({
                    categoryList: response.data.data
                })
                console.log('category List-=-=', this.state.categoryList);
            })
            .catch((err) => {
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

    /**
     * logout
     */
    logOut = async () => {
        if (this.state.token) {
            await AsyncStorage.setItem('token', '');
            await AsyncStorage.removeItem('pid');
            await AsyncStorage.removeItem('cartCount');
            this.getToken();
            this.props.navigation.navigate('Login');
        }
    }

    /**
     * 
     * @param {*} nav 
     * @param {*} text
     * drawer navigation link 
     */
    navLink(nav, text) {
        return (
            <>
                <TouchableOpacity
                    style={{ height: 40 }}
                    onPress={() => {
                        this.props.navigation.navigate(nav);
                    }}
                >
                    <Text style={styles.link}>{text}</Text>
                </TouchableOpacity>

            </>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scroller}>
                    <View style={styles.bottomLinks}>
                        <View style={{ flex: 2, flexDirection: "row", fontSize: 16 }}>
                            {this.navLink("Home", "HOME")}
                        </View>
                        <View style={{ flex: 2, flexDirection: "row", fontSize: 16 }}>
                            {this.navLink("WishList", "WISHLIST")}
                        </View>
                        {this.state.categoryList && this.state.categoryList.length
                            ? this.state.categoryList.map((data, index) => {
                                return (
                                    <View key={index}>
                                        {/* <View style={{ flex: 10 }}>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CategoryDetail', { categoryId: data.categoryId })}>
                                                <Text style={styles.link}>{data.name}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flex: 8 }}> */}
                                        <Collapse>
                                            <CollapseHeader>
                                                <View style={{ flexDirection: "row" }}>
                                                    {/* {this.navLink("Product", "Product")} */}
                                                    <Text style={[styles.link, { textTransform: 'uppercase', fontFamily: 'Roboto Condensed' }]}>{data.name}</Text>
                                                    {data.children && data.children.length ?
                                                        <Image source={require('../assets/image/downArrow.png')} style={{ height: 30, width: 30, marginTop: 5, marginRight: 20 }} ></Image>
                                                        :
                                                        null}
                                                </View>
                                            </CollapseHeader>
                                            <CollapseBody>
                                                {data.children && data.children.length
                                                    ? data.children.map((list, index) => {
                                                        return (
                                                            <View key={index}>
                                                                <Text style={{ paddingLeft: 20, fontSize: 15, textTransform: 'uppercase', fontFamily: 'Roboto Condensed' }}>{list.name}</Text>
                                                                {
                                                                    list.children && list.children.length
                                                                        ? list.children.map((sublist, i) => {
                                                                            return (
                                                                                <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('CategoryDetail', { categoryId: sublist.categoryId })}>
                                                                                    <Text style={{ paddingLeft: 20, fontSize: 14, textTransform: 'uppercase', fontFamily: 'Roboto Condensed' }}>{sublist.name}</Text>
                                                                                </TouchableOpacity>
                                                                            )
                                                                        })
                                                                        : null
                                                                }
                                                            </View>
                                                        )
                                                    })
                                                    : null
                                                }
                                            </CollapseBody>
                                        </Collapse>
                                    </View>
                                    // </View>
                                )
                            })
                            : null
                        }
                        {this.state.token && this.state.token.length ?
                            <View style={{ flex: 2, flexDirection: "row" }}>
                                {/* {this.navLink("WishList", "Wish List")} */}
                                <TouchableOpacity
                                    style={{ height: 50 }}
                                    onPress={() => this.logOut()}
                                >
                                    <Text style={[styles.link, {fontFamily: 'Roboto Condensed'}]}>LOGOUT</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            null}
                        <View style={{ flex: 2, flexDirection: "row", fontFamily: 'Roboto Condensed', fontSize: 16 }}>
                            {this.navLink("ContactUs", "CONTACT US")}
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#ccc"
    },
    scroller: {
        flex: 1
    },
    profile: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#4b415a"
    },
    profileText: {
        flex: 3,
        flexDirection: "column",
        justifyContent: "center"
    },
    name: {
        fontSize: 20,
        paddingBottom: 5,
        color: "white",
        textAlign: "left"
    },
    imgView: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20
    },
    img: {
        height: Platform.OS === "android" ? 70 : 70,
        width: Platform.OS === "android" ? 70 : 70,
        borderRadius: Platform.OS === "android" ? 50 : 35
    },
    topLinks: {
        height: 120,
        backgroundColor: "#ccc"
    },

    link: {
        flex: 1,
        fontSize: 16,
        padding: 6,
        paddingLeft: 14,
        margin: 5,
        textAlign: "left",
        color: "#000"
    },

    version: {
        flex: 1,
        textAlign: "right",
        marginRight: 20,
        color: "gray"
    },
    bottomLinks: {
        flex: 1,
        backgroundColor: "#ccc",
        paddingTop: 10,
        color: "#000"
    },
    description: {
        flex: 1,
        marginLeft: 20,
        fontSize: 16
    },
    btnlogout: {
        backgroundColor: "#181123",
        color: "white",
        flexDirection: "row"
    }
})

export default MenuDrawer;