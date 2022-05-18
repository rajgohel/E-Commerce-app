import React from "react";
import { StyleSheet, Platform, Image, TouchableOpacity } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";

export default class MenuButton extends React.Component {
  render() {
    return (
      //   <Icon
      //     name="reorder"
      //     color="black"
      //     size={25}
      //     style={styles.menuIcon}
      //     onPress={() => this.props.navigation.toggleDrawer()}
      //   />
      <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
        <Image source={require('../assets/image/viewMore.png')} style={{ height: 30, width: 30, marginTop: 5, marginLeft: 10 }} ></Image>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  menuIcon: {
    zIndex: 9,
    position: "absolute",
    top: Platform.OS === "android" ? 15 : 25,
    left: 20
  }
});
