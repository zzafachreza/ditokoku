import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MyPicker, MyGap, MyInput, MyButton } from '../../components';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../../utils/colors';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { Image } from 'react-native';
import { getData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
export default function ({ navigation, route }) {

    const user = route.params;
    const [data, setData] = useState([]);

    const [kirim, setKirim] = useState({
        fid_user: route.params.id,
    });

    const [loading, setLoading] = useState(false);
    const __sendServer = () => {
        setLoading(true);

        setTimeout(() => {
            axios.post(urlAPI + '/1add_transaksi.php', kirim).then(res => {
                console.log(res.data);
                setLoading(false);
                showMessage({
                    type: 'success',
                    message: 'Sent Successfully !'
                });
                navigation.replace('MainApp');
            })
        }, 1200)
    }

    useEffect(() => {
        axios.get(urlAPI + '/1get_laptop.php').then(res => {
            console.log(res.data);
            setData(res.data);
        })
    }, [])

    return (
        <SafeAreaView style={{
            flex: 1,
            padding: 10,
        }}>
            <View
                style={{
                    marginVertical: 5,
                    padding: 10,
                    backgroundColor: colors.white,
                    borderRadius: 10,
                }}>
                <Text
                    style={{
                        fontFamily: fonts.secondary[600],
                        color: colors.black,
                    }}>
                    Name
                </Text>
                <Text
                    style={{
                        fontFamily: fonts.secondary[400],
                        color: colors.primary,
                    }}>
                    {user.nama_lengkap}
                </Text>
            </View>


            <View
                style={{
                    marginVertical: 5,
                    padding: 10,
                    backgroundColor: colors.white,
                    borderRadius: 10,
                }}>
                <Text
                    style={{
                        fontFamily: fonts.secondary[600],
                        color: colors.black,
                    }}>
                    Position
                </Text>
                <Text
                    style={{
                        fontFamily: fonts.secondary[400],
                        color: colors.primary,
                    }}>
                    {user.posisi}
                </Text>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around'
            }}>

                <View
                    style={{
                        flex: 1,
                        marginRight: 5,
                        marginVertical: 5,
                        padding: 10,
                        backgroundColor: colors.white,
                        borderRadius: 10,
                    }}>
                    <Text
                        style={{
                            fontFamily: fonts.secondary[600],
                            color: colors.black,
                        }}>
                        Email
                    </Text>
                    <Text
                        style={{
                            fontFamily: fonts.secondary[400],
                            color: colors.primary,
                        }}>
                        {user.email}
                    </Text>
                </View>

                <View
                    style={{
                        flex: 1,
                        marginLeft: 5,
                        marginVertical: 5,
                        padding: 10,
                        backgroundColor: colors.white,
                        borderRadius: 10,
                    }}>
                    <Text
                        style={{
                            fontFamily: fonts.secondary[600],
                            color: colors.black,
                        }}>
                        Phone Number
                    </Text>
                    <Text
                        style={{
                            fontFamily: fonts.secondary[400],
                            color: colors.primary,
                        }}>
                        {user.telepon}
                    </Text>
                </View>
            </View>

            <View
                style={{
                    flex: 1,
                    marginLeft: 5,
                    marginVertical: 5,
                    padding: 10,
                    backgroundColor: colors.white,
                    borderRadius: 10,
                }}>

                <MyPicker
                    value={kirim.fid_laptop}
                    onValueChange={x =>
                        setKirim({
                            ...kirim,
                            fid_laptop: x,
                        })
                    }
                    iconname="list"
                    label="Laptop"
                    data={data}
                />

            </View>

            {!loading && <MyButton onPress={__sendServer} title="Send Request" Icons="cloud-upload-outline" warna={colors.primary} />}
            {loading && <ActivityIndicator color={colors.primary} size="large" />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})