import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    FlatList,
    TouchableWithoutFeedback,
    Image,
    Linking,
    ActivityIndicator,
    Alert,
} from 'react-native';

import { getData, storeData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyButton, MyInput, MyPicker } from '../../components';
import { colors } from '../../utils/colors';
import { TouchableOpacity, Swipeable } from 'react-native-gesture-handler';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { showMessage } from 'react-native-flash-message';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Modalize } from 'react-native-modalize';

export default function Wish({ navigation, route }) {
    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);;
    const [itemz, setItem] = useState({});


    const isFocused = useIsFocused();
    //   useEffect(() => {

    //   }, []);

    useEffect(() => {
        if (isFocused) {

            getData('user').then(rx => {
                console.log(rx)
                setUser(rx);
                __getDataBarang(rx.id);
            });

        }
    }, [isFocused]);

    const __getDataBarang = (zz) => {
        axios.post(urlAPI + '/1_wish.php', {
            fid_user: zz
        }).then(x => {
            setData(x.data);
            console.log('favorit', x.data);
        })

    }

    const hanldeHapus = (x, y) => {
        axios.post(urlAPI + '/1_wish_hapus.php', {
            fid_barang: x,
            fid_user: y
        }).then(x => {
            getData('user').then(tkn => {
                __getDataBarang(tkn.id);
            });

        })
    };





    const __renderItem = ({ item, index }) => {
        return (

            <View style={{
                backgroundColor: colors.white,
                marginVertical: 3,
            }}>
                <View
                    style={{

                        padding: 10,
                        flexDirection: 'row'
                    }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Pinjam', item)} style={{
                        paddingHorizontal: 10,
                    }}>
                        <Image style={{
                            width: 50, height: 50,
                            borderRadius: 5,
                        }} source={{
                            uri: item.image
                        }} />
                    </TouchableOpacity>

                    <View style={{ flex: 1, justifyContent: 'center' }}>

                        <Text
                            style={{
                                fontFamily: fonts.secondary[600],
                                fontSize: windowWidth / 30,
                            }}>
                            {item.nama_barang}
                        </Text>

                        {
                            item.diskon > 0 && <Text
                                style={{
                                    fontFamily: fonts.secondary[400],
                                    flex: 1,
                                    fontSize: windowWidth / 30,
                                    textDecorationLine: 'line-through'
                                }}>
                                {new Intl.NumberFormat().format(item.harga_dasar)}
                            </Text>
                        }

                        <Text
                            style={{
                                fontFamily: fonts.secondary[600],
                                color: colors.black,
                                fontSize: windowWidth / 25,

                            }}>
                            {new Intl.NumberFormat().format(item.harga_barang)}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => {


                        Alert.alert(
                            "Apakah kamu yakin akan menghapus ini dari favorit ?",
                            item.nama_barang,
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                { text: "OK", onPress: () => hanldeHapus(item.id, item.fid_user) }
                            ]
                        );

                    }} style={{
                        marginHorizontal: 5,
                    }}>
                        <Icon type='ionicon' name='trash' color={colors.danger} />
                    </TouchableOpacity>


                </View>

            </View >

        );
    };


    const [foto, setfoto] = useState('https://zavalabs.com/nogambar.jpg');



    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.white
                // padding: 10,
            }}>

            <FlatList data={data} renderItem={__renderItem} />



        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
