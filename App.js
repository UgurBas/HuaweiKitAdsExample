import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HMSAds, { HMSNative } from "@hmscore/react-native-hms-ads";

const windowWidth = Dimensions.get('window').width;

export default class App extends Component {
  state = {
    page: 1,
    posts: [],
    loading: true
  };

  componentDidMount() {
    this.getPosts();
    HMSAds.init()
      .then((res) => {
        console.warn("HMS init, result: " + res, res);
      })
      .catch((err) => alert(err))
  }

  getPosts = async () => {
    this.setState({
      loading: true,
    });
    const { results: posts } = await fetch(`https://randomuser.me/api/?results=10&page=${this.state.page}`).then(res => res.json());
    const users = [...this.state.posts, ...posts];

    this.setState({
      posts: users,
      loading: false
    });
  };

  loadMore = () => {
    this.setState({
      page: this.state.page + 1,
    }, () => {
      this.getPosts();
    });
  };

  renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("./instaText.png")}
            resizeMode="contain"
            style={styles.headerImg}
          />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Feather name='plus-square' style={styles.iconSize} />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign name='hearto' style={styles.iconSize} />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign name='message1' style={styles.iconSize} />
          </TouchableOpacity>
        </View>
      </View>
    )
  };

  renderFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity>
          <MaterialCommunityIcons name='home-variant' style={styles.iconSize} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name='search' style={styles.iconSize} />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons name='movie-play-outline' style={styles.iconSize} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name='shopping-bag' style={styles.iconSize} />
        </TouchableOpacity>
      </View>
    )
  };

  renderFlatlistFooter = () => {
    if (!this.state.loading) return null;
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" />
      </View>
    )
  };

render() {
    return (
      <>
        {this.renderHeader()}
        <FlatList
          ListFooterComponent={this.renderFlatlistFooter}
          renderItem={this.renderPostsItem}
          keyExtractor={item => item.login.uuid}
          data={this.state.posts}

          onEndReached={this.loadMore}
          onEndReachedThreshold={0.5}
        />
        {this.renderFooter()}
      </>
    );
  }

  renderPostsItem = ({ item, index }) => {
    let itemBottom = <View style={styles.itemDivider} />;
    if (index > 0 && ((index + 1) % 3) == 0)
      itemBottom = <Native adsType={(index % 2) == 0 ? HMSAds.NativeMediaTypes.IMAGE_LARGE : HMSAds.NativeMediaTypes.VIDEO} />

    return (
      <>
        <View style={styles.item}>
          <View style={styles.itemUser}>
            <Image
              style={styles.avatar}
              source={{ uri: item.picture.thumbnail }} />
            <Text style={styles.name}>{item.name.first.toLowerCase()}{item.name.last.toLowerCase()}</Text>
          </View>
          <View>
            <Image
              source={{ uri: "https://picsum.photos/500/500?v=" + index }}
              style={{ width: windowWidth, height: windowWidth }}
            />
          </View>
          <View style={styles.itemBottom}>
            <View style={styles.itemActions}>
              <View style={styles.itemActionsLeft}>
                <TouchableOpacity>
                  <AntDesign name='hearto' style={styles.iconSize} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Octicons name='comment' style={styles.iconSize} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Feather name='send' style={styles.iconSize} />
                </TouchableOpacity>
              </View>
              <View style={styles.itemActionsRight}>
                <TouchableOpacity>
                  <Feather name='bookmark' style={styles.iconSize} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.itemLike}>
              <TouchableOpacity>
                <Text style={styles.itemLikeTextBold}>{item.login.username}</Text>
              </TouchableOpacity>
              <Text style={styles.itemMargin}>ve</Text>
              <TouchableOpacity style={styles.itemMargin}>
                <Text style={styles.itemLikeTextBold}>diğerleri</Text>
              </TouchableOpacity>
              <Text style={styles.itemMargin}>beğendi.</Text>
            </View>
            <View style={styles.itemText}>
              <Text style={styles.itemTextUser}>{item.name.first.toLowerCase()}{item.name.last.toLowerCase()}</Text>
              <Text style={styles.itemMargin}>Gönderiyle ilgili acıklama</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.itemCommentText}>6 yorumun tümünü gör</Text>
            </TouchableOpacity>
            <Text style={styles.itemTimeText}>10 saat önce</Text>
          </View>
        </View>
        {itemBottom}
      </>
    )
  };
}

class Native extends React.Component {
  constructor(props) {
    super(props);
    
    let type = HMSAds.NativeMediaTypes.IMAGE_LARGE;
    if (props.adsType)
      type = props.adsType;
    let nativeAdIds = {};
    nativeAdIds[HMSAds.NativeMediaTypes.VIDEO] = "testy63txaom86";
    nativeAdIds[HMSAds.NativeMediaTypes.IMAGE_SMALL] = "testb65czjivt9";
    nativeAdIds[HMSAds.NativeMediaTypes.IMAGE_LARGE] = "testu7m3hc4gvm";
    this.state = {
      displayForm: {
        mediaType: type,
        adId: nativeAdIds[type],
      },
    };
  }

  render() {
    return (
      <HMSNative 
        style={{height:322}}
        displayForm={this.state.displayForm}
      />
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginHorizontal: 10
  },
  name: {
    fontSize: 14,
    fontWeight: '700'
  },
  activityIndicator: {
    paddingVertical: 20
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 0.2,
    paddingVertical: 10,
    borderColor: '#c4c4c4',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  iconSize: {
    fontSize: 25
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 0.2,
    borderColor: '#c4c4c4',
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  headerLeft: {
    flex: 2
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerImg: {
    height: 50,
    width: 100,
    borderWidth: 1
  },
  item: {
    marginVertical: 10
  },
  itemDivider: {
    height: 20
  },
  itemUser: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center'
  },
  itemBottom: {
    marginHorizontal: 10
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  itemActionsLeft: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between'
  },
  itemActionsRight: {
    flex: 2,
    alignItems: 'flex-end'
  },
  itemLike: {
    flexDirection: 'row'
  },
  itemLikeTextBold: {
    fontWeight: 'bold'
  },
  itemMargin: {
    marginLeft: 3
  },
  itemText: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 4
  },
  itemTextUser: {
    fontWeight: 'bold'
  },
  itemCommentText: {
    color: '#737270'
  },
  itemTimeText: {
    color: '#737270',
    fontSize: 10,
    marginTop: 2
  }
});