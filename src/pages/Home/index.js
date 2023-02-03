import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';
import MyCarouser from '../../components/MyCarouser';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import 'intl';
import 'intl/locale-data/jsonp/en';
import LottieView from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';
import { MyGap } from '../../components';
import { Linking } from 'react-native';

export default function Home({ navigation }) {
  const [user, setUser] = useState({});
  const [kategori, setKategori] = useState([]);

  const [produk, setProduk] = useState([]);
  const [cart, setCart] = useState(0);
  const [token, setToken] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {

      const json = JSON.stringify(remoteMessage);
      const obj = JSON.parse(json);

      // console.log(obj);

      // alert(obj.notification.title)



      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'ditokoku', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        title: obj.notification.title, // (optional)
        message: obj.notification.body, // (required)
      });
    });

    getDataProduk();
    getDataKategori();

    if (isFocused) {
      __getDataUserInfo();
    }
    return unsubscribe;
  }, [isFocused]);


  const getDataProduk = () => {
    axios.post(urlAPI + '/1data_barang.php').then(res => {
      console.log('barang', res.data);

      setProduk(res.data);
    })
  }

  const getDataKategori = () => {
    axios.post(urlAPI + '/1data_kategori.php').then(res => {
      console.log('kategori', res.data);

      setKategori(res.data);
    })
  }



  const __getDataUserInfo = () => {

    axios.post(urlAPI + '/company.php').then(c => {
      console.log('comp', c.data);
      setComp(c.data);
    })

    getData('user').then(users => {
      console.log(users);
      setUser(users);
      axios.post(urlAPI + '/1_cart.php', {
        fid_user: users.id
      }).then(res => {
        console.log('cart', res.data);

        setCart(parseFloat(res.data))
      })
      getData('token').then(res => {
        console.log('data token,', res);
        setToken(res.token);
        axios
          .post(urlAPI + '/update_token.php', {
            id: users.id,
            token: res.token,
          })
          .then(res => {
            console.error('update token', res.data);
          });
      });
    });
  }

  const [comp, setComp] = useState({});

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ratio = 192 / 108;


  const __renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Pinjam', item);
      }}
      style={{
        backgroundColor: colors.background1,
        flex: 1,
        margin: 5,

      }}>
      <Image source={{
        uri: item.image
      }} style={{
        alignSelf: 'center',
        // resizeMode: 'contain',
        width: '100%',
        height: 200,

      }} />

      {item.diskon > 0 &&
        <Text
          style={{
            fontSize: windowWidth / 30,
            color: colors.textPrimary,
            textAlign: 'right',
            marginRight: 2,
            textDecorationLine: 'line-through',
            textDecorationStyle: 'solid',
            fontFamily: fonts.secondary[600],
          }}>
          Rp. {new Intl.NumberFormat().format(item.harga_dasar)}
        </Text>
      }
      {item.diskon > 0 && <Text
        style={{
          fontSize: windowWidth / 35,
          padding: 5,
          maxWidth: '40%',
          margin: 2,
          borderRadius: 5,
          textAlign: 'center',
          alignSelf: 'flex-end',
          color: colors.secondary,
          backgroundColor: colors.primary,
          fontFamily: fonts.secondary[600],
        }}>
        Disc {new Intl.NumberFormat().format(item.diskon)}%
      </Text>}



      {item.diskon == 0 &&
        <Text
          style={{
            fontSize: windowWidth / 30,
            color: colors.zavalabs,
            textAlign: 'right',
            marginLeft: 5,
            textDecorationLine: 'line-through',
            textDecorationStyle: 'solid',
            fontFamily: fonts.secondary[600],
          }}>

        </Text>
      }
      {item.diskon == 0 && <Text
        style={{
          fontSize: windowWidth / 35,
          padding: 5,
          maxWidth: '40%',
          margin: 2,
          borderRadius: 5,
          textAlign: 'center',
          alignSelf: 'flex-end',
          color: colors.secondary,

          fontFamily: fonts.secondary[600],
        }}>

      </Text>}



      <Text
        style={{
          paddingLeft: 5,
          fontSize: windowWidth / 25,
          color: colors.price,
          fontFamily: fonts.secondary[600],
        }}>
        Rp. {new Intl.NumberFormat().format(item.harga_barang)}
      </Text>
      <Text
        style={{
          padding: 2,
          backgroundColor: colors.tertiary,
          fontSize: windowWidth / 40,
          width: 60,
          textAlign: 'center',
          color: colors.black, borderRadius: 2,
          fontFamily: fonts.secondary[400],
        }}>
        {item.nama_kategori}
      </Text>
      <Text
        style={{
          padding: 5,
          height: 50,
          fontSize: windowWidth / 30,
          color: colors.textPrimary, borderRadius: 2,
          fontFamily: fonts.secondary[400],
        }}>
        {item.nama_barang}
      </Text>






    </TouchableOpacity>
  );

  const __renderItemKategori = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Barang', {
        key: item.id,
        id_user: user.id
      })} style={{
        backgroundColor: colors.background1,
        margin: 3,
        flex: 1,

      }}>

        <View style={{
          justifyContent: 'center',
          alignItems: 'center',

        }}>
          <Image style={{
            width: '100%',
            borderRadius: 10,
            height: 100,
            width: 100,


          }} source={{
            uri: item.image
          }} />
        </View>
        <Text style={{
          textAlign: 'center',
          color: colors.textPrimary,
          fontFamily: fonts.secondary[600],
          fontSize: windowWidth / 30,
        }}>{item.nama_kategori}</Text>
      </TouchableOpacity>
    )
  }


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>

      <View
        style={{
          height: windowHeight / 10,
          padding: 10,
          backgroundColor: colors.background1,
        }}>


        <View style={{
          flexDirection: 'row'
        }}>
          <TouchableOpacity onPress={() => navigation.navigate('Barang', {
            key: 0,
            id_user: user.id
          })} style={{
            flex: 1,
            height: 40,
            flexDirection: 'row',
            backgroundColor: colors.zavalabs,
            borderRadius: 5,

          }}>

            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 10,
            }}>
              <Icon type='ionicon' name="search-outline" color={colors.border} size={windowWidth / 30} />
            </View>
            <View style={{
              paddingLeft: 5,
              flex: 1,
              justifyContent: 'center'
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                color: colors.border,
                fontSize: windowWidth / 30
              }}>Search Product</Text>
            </View>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://wa.me/' + comp.tlp);
            }}
            style={{
              position: 'relative',
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center'


            }}>
            <Icon type='ionicon' name="logo-whatsapp" color={colors.secondary} />


          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={{
              position: 'relative',
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center'


            }}>
            <Icon type='ionicon' name="cart-outline" color={colors.secondary} />
            <Text style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, backgroundColor: colors.primary, width: 18,
              textAlign: 'center',
              height: 18, borderRadius: 10, color: colors.secondary
            }} >{cart}</Text>

          </TouchableOpacity>
        </View>


      </View>

      <ScrollView style={{
        backgroundColor: colors.background1
      }}>

        <MyCarouser />

        {/* list Kategoti */}
        <View>
          <View style={{
            flexDirection: 'row',
            flex: 1,
            paddingHorizontal: 10,
            padding: 10,
            alignItems: 'center'
          }}>
            <Icon type='ionicon' name="grid-outline" color={colors.textPrimary} />
            <Text style={{
              left: 10,
              color: colors.textPrimary,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 25,
            }}>Kategori Produk</Text>
          </View>
          <View style={{
            flex: 1,
          }}>
            <FlatList showsHorizontalScrollIndicator={false} numColumns={1} horizontal data={kategori} renderItem={__renderItemKategori} />
          </View>
        </View>

        {/* list Product */}
        <View>
          <View style={{
            flexDirection: 'row',
            flex: 1,
            paddingHorizontal: 10,
            padding: 10,
            alignItems: 'center'
          }}>
            <Icon type='ionicon' name="newspaper-outline" color={colors.textPrimary} />
            <Text style={{
              left: 10,
              color: colors.textPrimary,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 25,
            }}>Product Terbaru</Text>
          </View>
          <View style={{
            flex: 1
          }}>
            <FlatList numColumns={2} data={produk} renderItem={__renderItem} />
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
