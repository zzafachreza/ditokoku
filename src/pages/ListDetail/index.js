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
        backgroundColor: colors.border
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

              {item.status == 'MENUNGGU PEMBAYARAN' && (
                <TouchableOpacity onPress={() => {
                  navigation.navigate('Bayar', {
                    kode: item.kode,
                    total_bayar: item.total_bayar
                  })
                }} style={{
                  padding: 10,
                  backgroundColor: colors.secondary,
                  flexDirection: 'row'
                }}>
                  <Icon type='ionicon' name='checkmark-circle' size={windowWidth / 30} color={colors.white} />
                  <Text style={{
                    left: 5,
                    fontFamily: fonts.secondary[600],
                    fontSize: windowWidth / 30,
                    color: colors.white,
                  }}>Bayar Sekarang</Text>
                </TouchableOpacity>

              )}
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
                Tipe Pembayaran
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  padding: 10,
                  fontSize: windowWidth / 30,
                  color: colors.black,

                }}>
                {item.tipe_bayar}
              </Text>
            </View>
          </View>


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
                    }}> {new Intl.NumberFormat().format(i.qty)} x Rp. {new Intl.NumberFormat().format(i.harga)}</Text>

                  </View>

                  <View style={{
                    justifyContent: 'center'
                  }}>
                    <Text style={{
                      fontFamily: fonts.secondary[400],
                      fontSize: windowWidth / 30,
                      color: colors.black,

                    }}>  Rp. {new Intl.NumberFormat().format(i.total)}</Text>
                  </View>
                </View>
              )
            })}
          </View>


          <View style={{
            backgroundColor: colors.white,
            marginVertical: 5,
          }}>



            {item.tipe_bayar == "Transfer Bank" && <>
              <Text style={{
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 30,
                color: colors.black,
                margin: 10,

              }}>Informasi Pengiriman</Text>
              <View style={{
                flexDirection: 'row',
                padding: 10,
              }}>
                <View style={{
                  flex: 0.5,
                  justifyContent: 'center'
                }}>
                  <Text style={{
                    fontFamily: fonts.secondary[400],
                    fontSize: windowWidth / 30,
                    color: colors.black,

                  }}>Kurir</Text>
                </View>
                <View style={{
                  flex: 1.5,
                  justifyContent: 'flex-start',
                }}>
                  <Text style={{
                    fontFamily: fonts.secondary[400],
                    fontSize: windowWidth / 30,
                    color: colors.black,

                  }}>
                    {item.nama_kurir} - {item.paket}
                  </Text>
                </View>
              </View>
              <View style={{
                flexDirection: 'row',
                padding: 10,
              }}>
                <View style={{
                  flex: 0.5,
                  justifyContent: 'center'
                }}>
                  <Text style={{
                    fontFamily: fonts.secondary[400],
                    fontSize: windowWidth / 30,
                    color: colors.black,

                  }}>No. Resi</Text>
                </View>
                <View style={{
                  flex: 1.5,
                  justifyContent: 'flex-start',
                  flexDirection: 'row'
                }}>
                  <Text style={{
                    fontFamily: fonts.secondary[400],
                    fontSize: windowWidth / 30,
                    color: colors.black,
                    textAlign: 'left',
                    flex: 1,
                  }}>
                    {item.nomor_resi}
                  </Text>

                  {item.status == 'SUDAH DIKIRIM' &&
                    <TouchableOpacity onPress={() => navigation.navigate('Akses', {
                      nomor_resi: item.nomor_resi,
                      kode_kurir: item.kode_kurir
                    })} style={{
                      padding: 7,
                      borderRadius: 2,
                      backgroundColor: colors.tertiary,
                      flexDirection: 'row'
                    }}>
                      <Icon type='ionicon' color={colors.black} name='search-outline' size={windowWidth / 30} />
                      <Text style={{
                        left: 2,
                        color: colors.black,
                        fontFamily: fonts.secondary[400],
                        fontSize: windowWidth / 30,
                      }}>Lacak Resi</Text>
                    </TouchableOpacity>}
                </View>
              </View>
            </>}


            <View style={{
              flexDirection: 'row',
              padding: 10,
            }}>
              <View style={{
                flex: 0.5,
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}>
                <Text style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: windowWidth / 30,
                  color: colors.black,

                }}>Alamat</Text>
              </View>
              <View style={{
                flex: 1.5,
                justifyContent: 'flex-start',
              }}>
                <Text style={{
                  fontFamily: fonts.secondary[600],
                  fontSize: windowWidth / 30,
                  color: colors.black,
                  textAlign: 'left'
                }}>
                  {item.nama_lengkap}
                </Text>
                <Text style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: windowWidth / 30,
                  color: colors.black,
                  textAlign: 'left'
                }}>
                  {item.telepon}
                </Text>
                <Text style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: windowWidth / 30,
                  color: colors.black,
                  textAlign: 'left'
                }}>
                  {item.alamat} {item.nama_kota} {item.nama_provinsi}
                </Text>
              </View>
            </View>




          </View>

          <View style={{
            backgroundColor: colors.white,
            marginVertical: 5,
          }}>
            <Text style={{
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 30,
              color: colors.black,
              margin: 10,

            }}>Rincian Pembayaran</Text>
            <View style={{
              flexDirection: 'row',
              padding: 10,
            }}>

              <View style={{
                flex: 1,
                justifyContent: 'center'
              }}>
                <Text style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: windowWidth / 30,
                  color: colors.black,

                }}>Total Harga</Text>
              </View>


              <View style={{
                justifyContent: 'center'
              }}>
                <Text style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: windowWidth / 30,
                  color: colors.black,

                }}>   Rp. {new Intl.NumberFormat().format(item.total_harga)}</Text>
              </View>
            </View>


            <View style={{
              flexDirection: 'row',
              padding: 10,
            }}>

              <View style={{
                flex: 1,
                justifyContent: 'center'
              }}>
                <Text style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: windowWidth / 30,
                  color: colors.black,

                }}>Total Ongkos Kirim</Text>
              </View>


              <View style={{
                justifyContent: 'center'
              }}>
                <Text style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: windowWidth / 30,
                  color: colors.black,

                }}>  Rp. {new Intl.NumberFormat().format(item.total_ongkir)}</Text>
              </View>
            </View>

            <View style={{
              flexDirection: 'row',
              padding: 10,
            }}>

              <View style={{
                flex: 1,
                justifyContent: 'center'
              }}>
                <Text style={{
                  fontFamily: fonts.secondary[600],
                  fontSize: windowWidth / 30,
                  color: colors.black,

                }}>Total Pembayaran</Text>
              </View>


              <View style={{
                justifyContent: 'center'
              }}>
                <Text style={{
                  fontFamily: fonts.secondary[600],
                  fontSize: windowWidth / 25,
                  color: colors.black,

                }}>   Rp. {new Intl.NumberFormat().format(item.total_bayar)}</Text>
              </View>
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
          }} title='Pesanan Selesai' warna={colors.secondary} colorText={colors.white} Icons="checkmark-circle" iconColor={colors.white} />)}
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
