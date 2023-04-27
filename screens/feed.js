import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import StoryCard from "./StoryCard";

import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "react-native-paper";
import firebase from "firebase";

SplashScreen.preventAutoHideAsync();

let customFonts = {
  "Mario-Kart-DS": require("../assets/Mario-Kart-DS.ttf"),
};

let stories = require("./temp_stories.json");

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      stories: [],
      text: "",
    };
  }

  pesquisar = () => {
    let text = this.state.text;
    if (text === "") {
      this.fetchStories();
      console.log("mostrar tudo");
    } else {
      this.filterStories();
      console.log("filtrar pesquisa");
    }
  };

  filterStories = () => {
    firebase
      .database()
      .ref("/posts/")
      .on("value", (data) => {
        var post = data.val();
        console.log(post);
        for (var p in post) {
          if (post[p].title === a) {
            console.log(post[p]);
          }
        }
      });
  };

  fetchStories = () => {
    firebase
      .database()
      .ref("/posts/")
      .on(
        "value",
        (snapshot) => {
          let stories = [];
          if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach(function (key) {
              stories.push({
                key: key,
                value: snapshot.val()[key],
              });
            });
          }
          this.setState({ stories: stories });
          //this.props.setUpdateToFalse();
        },
        function (errorObject) {
          console.log("A leitura falhou: " + errorObject.code);
        }
      );
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
    this.fetchStories();
  }

  async fetchUser() {
    let theme;
    await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({
          light_theme: theme === "light" ? true : false,
        });
      });
  }

  renderItem = ({ item: story }) => {
    return <StoryCard story={story} navigation={this.props.navigation} />;
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      return (
        <View
          style={
            this.state.light_theme ? styles.containerClaro : styles.container
          }
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextClaro
                    : styles.appTitleText
                }
              >
                Resumos (☞ﾟヮﾟ)☞
              </Text>
            </View>
          </View>
          <View style={styles.textinputContainer}>
            <TextInput
              style={styles.textinput}
              onChangeText={(text) => this.setState({ text: text })}
              placeholder={"Pesquisar"}
              placeholderTextColor={"#FFFFFF"}
            />
            <TouchableOpacity
              style={styles.scanbutton}
              onPress={() => this.pesquisar()}
            >
              <Text style={styles.scanbuttonText}>🔍</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardContainer}>
            {!this.state.stories[0] ? (
              <View style={styles.noStories}>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.noStoriesTextLight
                      : styles.noStoriesText
                  }
                >
                  {" "}
                  Você não escreveu nenhum resumo ainda mané😐
                </Text>
              </View>
            ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.stories}
                renderItem={this.renderItem}
              />
            )}
          </View>
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c",
  },
  containerClaro: {
    flex: 1,
    backgroundColorClaro: "white",
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row",
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center",
  },

  textinputContainer: {
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#5653D4",
  },
  textinput: {
    width: "57%",
    height: 50,
    padding: 10,
    fontSize: 18,
    fontFamily: "Mario-Kart-DS",
    color: "#FFFFFF",
  },
  scanbutton: {
    width: 200,
    height: 50,
    backgroundColor: "#D4EBCA",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scanbuttonText: {
    fontSize: 24,
    color: "white",
    fontFamily: "Mario-Kart-DS",
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Mario-Kart-DS",
  },
  appTitleTextClaro: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Mario-Kart-DS",
  },
  cardContainer: {
    flex: 0.85,
  },
  noStories: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center",
  },
  noStoriesTextLight: {
    fontSize: RFValue(40),
    fontFamily: "Mario-Kart-DS",
  },
  noStoriesText: {
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "Mario-Kart-DS",
  },
});
