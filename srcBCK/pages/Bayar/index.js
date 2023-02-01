import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  PermissionsAndroid,
} from 'react-native';

import { getData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyButton, MyInput, MyGap, MyPicker } from '../../components';
import { colors } from '../../utils/colors';
import { TouchableOpacity, Swipeable } from 'react-native-gesture-handler';
import { fonts, windowWidth } from '../../utils/fonts';
import { useIsFocused } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Icon } from 'react-native-elements';
import 'intl';
import 'intl/locale-data/jsonp/en';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { showMessage } from 'react-native-flash-message';

export default function Bayar({ navigation, route }) {
  const [data, setData] = useState(route.params);
  const [open, setOpen] = useState(false);
  const [bank, setBank] = useState([]);
  // console.log('data dari bayar', data);
  const [loading, setLoading] = useState(false);
  // console.log('pembayaran', data);
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
            setData({
              ...data,
              foto_bayar: `data:${response.type};base64, ${response.base64}`,
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
            setData({
              ...data,
              foto_bayar: `data:${response.type};base64, ${response.base64}`,
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
          borderWidth: 1,
          borderRadius: 10,
          borderColor: colors.border,
          elevation: 2,
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

  const simpan = () => {
    setLoading(true);
    console.log('kirim ke server', data);
    setTimeout(() => {
      axios
        .post(urlAPI + '/1transaksi_update.php', data)
        .then(res => {
          console.log(res);
          setLoading(false);
        });

      navigation.replace('MainApp');
      showMessage({
        type: 'success',
        message: 'Transaksi Berhasil, Terima kasih',
      });
    }, 1200);
  };


  useEffect(() => {
    axios.post(urlAPI + '/1data_bank.php').then(res => {
      console.log(res.data);
      setBank(res.data);
    })
  }, [])
  return (
    <>
      <SafeAreaView
        style={{
          padding: 10,
          backgroundColor: colors.background1,
          flex: 1,
        }}>

        {!open && <View>

          {bank.map((p, i) => {
            return (
              <TouchableOpacity onPress={() => {

                // const numbers = bank;
                // const evens = numbers.filter((item, index) => index === i);
                // console.log(evens); // [2, 4]
                // setBank(evens);
                setData({
                  ...data,
                  nama_bank: p.nama_bank,
                  atas_nama: p.atas_nama,
                  rekening_bank: p.rekening_bank,
                  foto_bank: p.image
                });
                setOpen(true);

                // console.log(paket);



              }} style={{
                backgroundColor: colors.white,
                padding: 5,
                marginVertical: 2,
                flexDirection: 'row'
              }}>
                <View style={{
                  flex: 1,
                  flexDirection: 'row'
                }}>
                  <View style={{
                    paddingRight: 10,
                  }}>
                    <Text style={{
                      fontFamily: fonts.secondary[600],
                      fontSize: windowWidth / 30
                    }}>Nama Bank</Text>
                    <Text style={{
                      fontFamily: fonts.secondary[600],
                      fontSize: windowWidth / 30
                    }}>Atas Nama</Text>
                    <Text style={{
                      fontFamily: fonts.secondary[600],
                      fontSize: windowWidth / 30
                    }}>Nomor Rekening</Text>
                  </View>
                  <View>
                    <Text style={{
                      fontFamily: fonts.secondary[400],
                      fontSize: windowWidth / 30
                    }}>{p.nama_bank}</Text>
                    <Text style={{
                      fontFamily: fonts.secondary[400],
                      fontSize: windowWidth / 30
                    }}>{p.atas_nama}</Text>
                    <Text style={{
                      fontFamily: fonts.secondary[400],
                      fontSize: windowWidth / 30
                    }}>{p.rekening_bank}</Text>
                  </View>
                </View>
                <View style={{
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end'
                }}>
                  <Image source={{
                    uri: p.image
                  }} style={{
                    resizeMode: 'contain',
                    width: 80,
                    height: 80
                  }} />


                </View>
              </TouchableOpacity>
            )
          })}

        </View>}

        {open && <View style={{ flex: 1, backgroundColor: colors.background1, marginVertical: 10, }}>
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
            <Text
              style={{
                flex: 1,
                color: colors.textPrimary,
                fontFamily: fonts.secondary[400],
                padding: 10,
              }}>
              Opsi Pembayaran
            </Text>
            <TouchableOpacity onPress={() => setOpen(false)} style={{
              padding: 10,
              backgroundColor: colors.primary,
              flexDirection: 'row'
            }}>
              <Icon type='ionicon' name='search' size={windowWidth / 30} color={colors.textPrimary} />
              <Text style={{
                color: colors.textPrimary,
                left: 2,
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 30,

              }}>Pilih Bank</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
            <Text
              style={{
                flex: 1,
                color: colors.textPrimary,
                fontFamily: fonts.secondary[400],
                padding: 10,
              }}>
              Transfer Ke BANK :
            </Text>
            <Image
              source={{
                uri: data.foto_bank
              }}
              style={{ width: 150, height: 80, resizeMode: 'contain' }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
            <Text
              style={{
                flex: 1,
                color: colors.textPrimary,
                fontSize: windowWidth / 30,
                fontFamily: fonts.secondary[400],
                padding: 10,
              }}>
              Nomor Rekening
            </Text>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: windowWidth / 30,
                fontFamily: fonts.secondary[600],
                padding: 10,
              }}>
              {data.rekening_bank}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
            <Text
              style={{
                flex: 1,
                color: colors.textPrimary,
                fontSize: windowWidth / 30,
                fontFamily: fonts.secondary[400],
                padding: 10,
              }}>
              Atas Nama
            </Text>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: windowWidth / 30,
                fontFamily: fonts.secondary[600],
                padding: 10,
              }}>
              {data.atas_nama}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
            <Text
              style={{
                flex: 1,
                color: colors.textPrimary,
                fontSize: 16,
                fontFamily: fonts.secondary[400],
                padding: 10,
              }}>
              Total Pembayaran
            </Text>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 20,
                fontFamily: fonts.secondary[600],
                padding: 10,
              }}>
              Rp. {new Intl.NumberFormat().format(route.params.total_bayar)}
            </Text>
          </View>

          <UploadFoto
            onPress1={() => getCamera(1)}
            onPress2={() => getGallery(1)}
            label="Upload Bukti Pembayaran"
            foto={foto1}
          />
          <View>
            <MyButton
              onPress={simpan}
              title="KONFIRMASI PEMBAYARAN"
              Icons="cloud-upload"
              warna={colors.primary}
              style={{
                justifyContent: 'flex-end',
              }}
            />
          </View>
        </View>}


      </SafeAreaView>
      {loading && (
        <LottieView
          source={require('../../assets/animation.json')}
          autoPlay
          loop
          style={{ backgroundColor: colors.primary }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({});
