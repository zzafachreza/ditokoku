import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Modal, PermissionsAndroid, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import MyHeader from '../../components/MyHeader';

export default function ({ navigation, route }) {

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Cool Photo App Camera Permission",
                    message:
                        "Cool Photo App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };


    const user = route.params;
    const [data, setData] = useState([]);
    const [kirim, setKirim] = useState({
        nama_saran: '',
        harga_saran: '',
        foto: ''
    });

    const [loading, setLoading] = useState(false);
    const __sendServer = () => {
        setLoading(true);

        setTimeout(() => {
            axios.post(urlAPI + '/saran.php', kirim).then(res => {
                console.log(res.data);
                setLoading(false);
                showMessage({
                    type: 'success',
                    message: 'Suggest Produk berhasil dikirim !'
                });
                navigation.replace('MainApp');
            })
        }, 1200)
    }



    const [foto1, setfoto1] = useState(
        'https://zavalabs.com/nogambar.jpg',
    );

    const options = {
        includeBase64: true,
        quality: 0.3,
    };

    const getCamera = xyz => {
        launchCamera(options, response => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                // console.log('User cancelled image picker');
            } else if (response.error) {
                // console.log('Image Picker Error: ', response.error);
            } else {
                let source = { uri: response.uri };
                switch (xyz) {
                    case 1:
                        setKirim({
                            ...kirim,
                            foto: `data:${response.type};base64, ${response.base64}`,
                        });
                        setfoto1(`data:${response.type};base64, ${response.base64}`);
                        break;
                }
            }
        });

    };

    const getGallery = xyz => {
        launchImageLibrary(options, response => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                // console.log('Image Picker Error: ', response.error);
            } else {
                let source = { uri: response.uri };
                switch (xyz) {
                    case 1:
                        setKirim({
                            ...kirim,
                            foto: `data:${response.type};base64, ${response.base64}`,
                        });
                        setfoto1(`data:${response.type};base64, ${response.base64}`);
                        break;
                }
            }
        });
    };

    const UploadFoto = ({ onPress1, onPress2, label, foto }) => {
        return (
            <View
                style={{
                    padding: 10,
                    color: colors.textPrimary,
                    marginVertical: 10,
                    borderRadius: 10,
                    borderColor: colors.border,
                }}>
                <Text
                    style={{
                        fontFamily: fonts.secondary[600],
                        color: colors.textPrimary,
                    }}>
                    {label}
                </Text>
                <Image
                    source={{
                        uri: foto,
                    }}
                    style={{
                        width: '100%',
                        aspectRatio: 2,
                    }}
                    resizeMode="center"
                />
                <View
                    style={{
                        flexDirection: 'row',
                    }}>
                    <View
                        style={{
                            flex: 1,
                            paddingRight: 5,
                        }}>
                        <MyButton
                            onPress={onPress1}
                            colorText={colors.white}
                            title="KAMERA"
                            warna={colors.primary}
                        />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: 5,
                        }}>
                        <MyButton
                            colorText={colors.white}
                            onPress={onPress2}
                            title="GALLERY"
                            warna={colors.secondary}
                        />
                    </View>
                </View>
            </View>
        );
    };

    useEffect(() => {
        requestCameraPermission();
        getData('user').then(u => {
            setKirim({
                ...kirim,
                fid_user: u.id
            })
        })
    }, [])

    return (
        <>
            <ScrollView>
                <MyHeader />
                <SafeAreaView style={{
                    flex: 1,
                    padding: 10,
                    justifyContent: 'center',
                    backgroundColor: colors.background1
                }}>


                    <MyInput value={kirim.nama_saran} onChangeText={x => {
                        setKirim({
                            ...kirim,
                            nama_saran: x
                        })
                    }} autoFocus label="Masukan Suggest Produk" iconname="cube" />

                    <MyInput value={kirim.harga_saran} onChangeText={x => {
                        setKirim({
                            ...kirim,
                            harga_saran: x
                        })
                    }} autoFocus label="Masukan Kisaran harga" iconname="cash" />


                    <UploadFoto
                        onPress1={() => getCamera(1)}
                        onPress2={() => getGallery(1)}
                        label="Upload Foto Produk"
                        foto={foto1}
                    />

                    <MyGap jarak={10} />
                    {!loading && <MyButton onPress={__sendServer} title="Kirim Sugggest Produk" Icons="cloud-upload-outline" warna={colors.primary} />}
                    {loading && <ActivityIndicator color={colors.secondary} size="large" />}

                </SafeAreaView >
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({})