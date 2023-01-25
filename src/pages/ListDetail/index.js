import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ImageBackground,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { colors } from '../../utils/colors';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { urlAPI } from '../../utils/localStorage';
import { MyButton, MyGap } from '../../components';

export default function ListDetail({ navigation, route }) {
  const [item, setItem] = useState(route.params);
  navigation.setOptions({ title: 'Detail Pesanan' });
  const [data, setData] = useState(route.params);
  const [buka, setBuka] = useState(true);
  const [dataDetail, setDataDetail] = useState([]);

  useEffect(() => {
    DataDetail();

  }, []);
  let nama_icon = '';

  if (data.status == "DONE") {
    nama_icon = 'checkmark-circle-outline';
  } else {
    nama_icon = 'close-circle-outline';
  }


  const DataDetail = () => {
    axios
      .post(urlAPI + '/transaksi_detail.php', {
        kode: item.kode,
      })
      .then(res => {
        console.warn('detail transaksi', res.data);
        setDataDetail(res.data);
        setBuka(true);
      });
  }



  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background2
      }}>

      {!buka && <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>}
      {buka &&
        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 10, flex: 1 }}>

          {item.status !== 'PENDING' && (
            <View style={{
              backgroundColor: colors.white,
              marginVertical: 5,
            }}>

              <View style={{
                flexDirection: 'row'
              }}>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: fonts.secondary[600],
                    padding: 10,
                    fontSize: windowWidth / 30,
                    color: colors.black,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border
                  }}>
                  {item.status}
                </Text>


              </View>

              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  padding: 10,
                  fontSize: windowWidth / 30,
                  color: colors.black,

                }}>
                {item.kode}
              </Text>
              <View style={{
                flexDirection: 'row'
              }}>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: fonts.secondary[400],
                    padding: 10,
                    fontSize: windowWidth / 30,
                    color: colors.black,

                  }}>
                  Tanggal Pembelian
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.secondary[400],
                    padding: 10,
                    fontSize: windowWidth / 30,
                    color: colors.black,

                  }}>
                  {item.tanggal}, {item.jam} WIB
                </Text>
              </View>

              <View style={{
                flexDirection: 'row'
              }}>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: fonts.secondary[400],
                    padding: 10,
                    fontSize: windowWidth / 30,
                    color: colors.black,

                  }}>
                  Metode Pembayaran
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.secondary[400],
                    padding: 10,
                    fontSize: windowWidth / 30,
                    color: colors.black,

                  }}>
                  {item.metode}
                </Text>
              </View>
            </View>

          )}
          <View style={{
            backgroundColor: colors.white,
            marginVertical: 5,
          }}>
            <Text
              style={{
                fontFamily: fonts.secondary[600],
                padding: 10,
                fontSize: windowWidth / 30,
                color: colors.black,
              }}>
              Detail Produk
            </Text>

            {dataDetail.map(i => {
              return (
                <View style={{
                  flexDirection: 'row',
                  padding: 10,
                }}>

                  <View style={{
                    paddingRight: 10,
                  }}>
                    <Image source={{
                      uri: i.image
                    }} style={{
                      width: 50, height: 50
                    }} />
                  </View>

                  <View style={{
                    flex: 1,
                    justifyContent: 'center'
                  }}>
                    <Text style={{
                      fontFamily: fonts.secondary[600],
                      fontSize: windowWidth / 35,
                      color: colors.black,
                    }}>{i.nama_barang}</Text>
                    <Text style={{
                      fontFamily: fonts.secondary[400],
                      fontSize: windowWidth / 35,
                      color: colors.black,
                    }}>Jumlah :  {new Intl.NumberFormat().format(i.qty)} {i.uom}</Text>
                    <Text style={{
                      fontFamily: fonts.secondary[400],
                      fontSize: windowWidth / 35,
                      color: colors.black,
                      fontStyle: 'italic'
                    }}>{i.note}</Text>

                  </View>

                  <View style={{
                    justifyContent: 'center'
                  }}>
                    <Text style={{
                      fontFamily: fonts.secondary[600],
                      fontSize: windowWidth / 25,
                      color: colors.black,
                      paddingHorizontal: 10,
                      borderRadius: 5,

                    }}>Rp. {new Intl.NumberFormat().format(i.total)}</Text>
                  </View>
                </View>
              )
            })}
          </View>


          <View style={{
            backgroundColor: colors.white,
            marginVertical: 5,
          }}>


            <View style={{
              flexDirection: 'row'
            }}>
              <Text
                style={{
                  flex: 1,
                  fontFamily: fonts.secondary[400],
                  padding: 10,
                  fontSize: windowWidth / 30,
                  color: colors.black,

                }}>
                Total Transaksi
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  padding: 10,
                  fontSize: windowWidth / 20,
                  color: colors.black,

                }}>
                Rp. {new Intl.NumberFormat().format(item.total_harga)}
              </Text>
            </View>
          </View>


          <MyGap jarak={10} />

          {item.status == 'SUDAH DIKIRIM' && (<MyButton onPress={() => {
            axios.post(urlAPI + '/1transaksi_selesai.php', {
              kode: item.kode
            }).then(res => {
              console.log(res);
              setItem({
                ...item,
                status: 'SELESAI'
              })

            })
          }} title='Pesanan Selesai' warna={colors.primary} colorText={colors.white} Icons="checkmark-circle" iconColor={colors.white} />)}


          {item.status == 'PENDING' && (<MyButton onPress={() => {



            axios.post(urlAPI + '/1add_cart_new.php', {
              kode: route.params.kode,
              fid_user: route.params.fid_user
            }).then(res => {
              console.log(res.data);
              navigation.navigate('Cart');
            })

          }} title='Masukan ke keranjang' warna={colors.primary} colorText={colors.white} Icons="checkmark-circle" iconColor={colors.white} />)}


          <MyGap jarak={20} />
        </ScrollView>
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.primary,

    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    height: 80,
    margin: 5,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    textAlign: 'center',
  },
  date: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    textAlign: 'center',
  },
});
