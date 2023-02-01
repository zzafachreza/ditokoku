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
  Linking,
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
import { useNavigation } from '@react-navigation/native';
export default function MyHeader({ telepon }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [cart, setCart] = useState(0);

  const [user, setUser] = useState({});

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  useEffect(() => {
    if (isFocused) {
      getData('user').then(users => {
        setUser(users)
        axios.post(urlAPI + '/1_cart.php', {
          fid_user: users.id
        }).then(res => {
          console.log('cart', res.data);

          setCart(parseFloat(res.data))
        })
      })
    }
  }, [isFocused])


  return (


    <View
      style={{
        height: windowHeight / 10,
        padding: 10,
        backgroundColor: colors.white,
      }}>


      <View style={{
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <TouchableOpacity onPress={() => navigation.navigate('Produk', {
          key: 0,
          id_user: user.id
        })} style={{
          flex: 1,
          height: 40,
          flexDirection: 'row',
          backgroundColor: colors.background6,
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
            Linking.openURL('https://wa.me/' + telepon)
          }}
          style={{
            position: 'relative',
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center'


          }}>
          <Icon type='ionicon' name="logo-whatsapp" color={colors.secondary} />

        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('ListData2')}
          style={{
            position: 'relative',
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center'


          }}>
          <Icon type='ionicon' name="bookmark-outline" color={colors.secondary} />

        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={{
            position: 'relative',
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center'


          }}>
          <Icon type='ionicon' name="cart-outline" color={colors.secondary} />
          <Text style={{
            position: 'absolute', top: -5, right: -5, bottom: 5, backgroundColor: colors.primary, width: 15,
            textAlign: 'center',
            fontSize: 11,
            height: 15, borderRadius: 10, color: colors.secondary
          }} >{cart}</Text>

        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Account')}
          style={{
            position: 'relative',
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center'

          }}>
          <Icon type='ionicon' name="person-outline" color={colors.secondary} />


        </TouchableOpacity>
      </View>


    </View>

  );
}

