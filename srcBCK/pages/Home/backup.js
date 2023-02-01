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

export default function Home({ navigation }) {
    const [user, setUser] = useState({});
    const [kategori, setKategori] = useState([]);
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
                channelId: 'kopicaptiger', // (required) channelId, if the channel doesn't exist, notification will not trigger.
                title: obj.notification.title, // (optional)
                message: obj.notification.body, // (required)
            });
        });

        getDataKategori();

        if (isFocused) {
            __getDataUserInfo();
        }
        return unsubscribe;
    }, [isFocused]);


    const getDataKategori = () => {
        axios.post(urlAPI + '/1data_kategori.php').then(res => {
            console.log('kategori', res.data);

            setKategori(res.data);
        })
    }


    const __getDataUserInfo = () => {
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

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const ratio = 192 / 108;


    const __renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('Barang', {
                key: item.id,
                id_user: user.id
            })} style={{
                // padding: 10,
                // paddingTop: 5,
                flex: 1,

            }}>

                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.white,
                }}>
                    <Image style={{
                        width: '70%',
                        height: 150,
                        resizeMode: 'contain'

                    }} source={{
                        uri: item.image
                    }} />
                </View>
                <Text style={{
                    textAlign: 'center',
                    color: colors.primary,
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
                    marginBottom: 10,
                    // height: windowHeight / 7,
                    padding: 10,
                    backgroundColor: colors.primary,
                }}>


                <View style={{
                    flexDirection: 'row'
                }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Barang', {
                        key: 0,
                        id_user: user.id
                    })} style={{
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: colors.white,
                        borderRadius: 5,

                    }}>
                        <View style={{
                            paddingLeft: 5,
                            flex: 1,
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontFamily: fonts.secondary[400],
                                color: colors.primary,
                            }}>Search Product</Text>
                        </View>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingRight: 10,
                        }}>
                            <Icon type='ionicon' name="search-outline" color={colors.primary} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Cart')}
                        style={{
                            position: 'relative',
                            width: 50,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center'


                        }}>
                        <Icon type='ionicon' name="cart" color={colors.white} />
                        <Text style={{
                            position: 'absolute', top: 2, right: 5, backgroundColor: colors.secondary, width: 15,
                            textAlign: 'center',
                            height: 15, borderRadius: 2, color: colors.primary
                        }} >{cart}</Text>

                    </TouchableOpacity>
                </View>


            </View>

            <ScrollView>
                <MyCarouser />


                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    marginRight: 10,
                    alignItems: 'center'
                }}>
                    <Icon type='ionicon' name="grid" color={colors.primary} />
                    <Text style={{
                        left: 10,
                        color: colors.primary,
                        fontFamily: fonts.secondary[600],
                        fontSize: windowWidth / 25,
                    }}>Varian Kopi Cap Tiger</Text>
                </View>
                <View style={{
                    flex: 1
                }}>
                    <FlatList numColumns={2} data={kategori} renderItem={__renderItem} />
                </View>
            </ScrollView>

        </SafeAreaView>
    );
}
