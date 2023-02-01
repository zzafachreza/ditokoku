import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList, Pressable,
  TouchableWithoutFeedback,
  Image,
  Linking,
  Modal,
  ActivityIndicator,
} from 'react-native';

import LottieView from 'lottie-react-native';
import { getData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyButton, MyInput, MyGap, MyPicker } from '../../components';
import { colors } from '../../utils/colors';
import { TouchableOpacity, Swipeable } from 'react-native-gesture-handler';
import { fonts, windowWidth } from '../../utils/fonts';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { showMessage } from 'react-native-flash-message';

export default function Checkout({ navigation, route }) {
  const item = route.params;
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [company, setCompany] = useState({});
  const [paket, setPaket] = useState([]);

  const [kirim, setKirim] = useState(route.params);
  const [user, setUser] = useState({});
  const [kurir, setKurir] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    getData('user').then(res => {
      console.error(res)
      setUser(res);
      setKirim({
        ...kirim,
        destination: res.fid_kota,
        total_ongkir: 0,
        harga_total: 0
      })
    });

    axios.post(urlAPI + '/1data_company.php').then(c => {
      // console.error(c.data)
      setCompany(c.data);
      setKirim({
        ...kirim,
        origin: c.data.fid_kota
      })
    });



    axios.post(urlAPI + '/1data_kurir.php').then(c => {
      setKurir(c.data);
    })
  }, []);



  const simpan = () => {
    console.error('kirim', kirim);
    if (kirim.total_ongkir == null) {
      showMessage({
        type: 'danger',
        message: 'Opsi pengiriman harus di isi !'
      })
    } else {
      setLoading(true);
      // console.log('kirim ke server', item);
      setTimeout(() => {
        axios
          .post(urlAPI + '/1add_transaksi.php', kirim)
          .then(res => {
            console.log(res.data);

            setLoading(false);
          });

        navigation.replace('MainApp');
        showMessage({
          type: 'success',
          message: 'Transaksi Berhasil, Terima kasih',
        });
      }, 1200);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>

          {/* data penerima */}

          <View style={{
            backgroundColor: colors.white,
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.border
          }}>
            <Text style={{
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 30
            }}>Nama Pemesan</Text>
            <Text style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 30,
              color: colors.primary
            }}>{user.nama_lengkap}</Text>
            <Text style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 30
            }}>{user.telepon}</Text>
            <Text style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 30
            }}>{user.alamat} {user.nama_kota} {user.nama_provinsi}</Text>
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
                color: colors.black,
                fontSize: windowWidth / 30,
                fontFamily: fonts.secondary[400],
                padding: 10,
              }}>
              Total Transaksi
            </Text>
            <Text
              style={{
                color: colors.black,
                fontSize: windowWidth / 25,
                fontFamily: fonts.secondary[600],
                padding: 10,
              }}>
              Rp. {new Intl.NumberFormat().format(kirim.harga_total)}
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
                color: colors.black,
                fontSize: windowWidth / 30,
                fontFamily: fonts.secondary[400],
                padding: 10,
              }}>
              Total Berat
            </Text>
            <Text
              style={{
                color: colors.black,
                fontSize: windowWidth / 25,
                fontFamily: fonts.secondary[400],
                padding: 10,
              }}>
              {new Intl.NumberFormat().format(kirim.berat_total)} gr
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
                color: colors.black,
                fontSize: windowWidth / 30,
                fontFamily: fonts.secondary[400],
                padding: 10,
              }}>
              Opsi Pengiriman
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{
              paddingVertical: 10,
              paddingHorizontal: 30,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.secondary,
              flexDirection: 'row'
            }}>
              <Icon type='ionicon' name='create-outline' size={windowWidth / 30} color={colors.white} />
              <Text style={{
                left: 5,
                color: colors.white,
                fontSize: windowWidth / 30,
                fontFamily: fonts.secondary[600],
              }}>Pilih</Text>
            </TouchableOpacity>
          </View>
          {open &&

            <View>

              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}>
                <Text
                  style={{
                    flex: 1,
                    color: colors.black,
                    fontSize: windowWidth / 30,
                    fontFamily: fonts.secondary[600],
                    padding: 10,
                  }}>
                  {kirim.nama_kurir}
                </Text>
                <Image source={{
                  uri: kirim.foto_kurir
                }} style={{
                  margin: 5,
                  resizeMode: 'contain',
                  width: 100,
                  height: 30,

                }} />

              </View>

              {/* kurir */}

              {/* paket Kurir */}
              {!loading2 && <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                  padding: 10,
                }}>
                {paket.map((p, i) => {
                  return (
                    <TouchableOpacity onPress={() => {

                      const numbers = paket;
                      const evens = numbers.filter((item, index) => index === i);
                      console.log(evens); // [2, 4]
                      setPaket(evens);

                      // console.log(paket);


                      setKirim({
                        ...kirim,
                        layanan_kurir: p.description,
                        paket_kurir: p.service,
                        total_ongkir: p.cost[0].value,
                        estimasi_kurir: p.cost[0].etd
                      })
                    }} style={{
                      padding: 5,
                      marginVertical: 2,
                      flexDirection: 'row'
                    }}>
                      <View style={{
                        flex: 1
                      }}>
                        <Text style={{
                          fontFamily: fonts.secondary[600],
                          fontSize: windowWidth / 30
                        }}>{p.service}</Text>
                        <Text style={{
                          fontFamily: fonts.secondary[400],
                          fontSize: windowWidth / 30
                        }}>{p.description}</Text>
                      </View>
                      <View style={{
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end'
                      }}>
                        <Text style={{
                          fontFamily: fonts.secondary[600],
                          fontSize: windowWidth / 30,
                        }}>{new Intl.NumberFormat().format(p.cost[0].value)}</Text>
                        <Text style={{
                          fontFamily: fonts.secondary[400],
                          fontSize: windowWidth / 30
                        }}>{p.cost[0].etd} hari</Text>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>}

              {loading2 && (
                <View style={{
                  padding: 20,
                }}>
                  <ActivityIndicator color={colors.primary} size="large" />
                </View>
              )}
              {/* paket kurir */}
            </View>



          }


        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
          <Text
            style={{
              flex: 1,
              color: colors.black,
              fontSize: windowWidth / 30,
              fontFamily: fonts.secondary[400],
              padding: 10,
            }}>
            Total Pembayaran
          </Text>
          <Text
            style={{
              color: colors.primary,
              fontSize: windowWidth / 20,
              fontFamily: fonts.secondary[600],
              padding: 10,
            }}>
            {/* Rp. {new Intl.NumberFormat().format(kirim.harga_total + kirim.total_ongkir)} */}

            Rp. {new Intl.NumberFormat().format(kirim.total_ongkir == null ? 0 : kirim.harga_total + kirim.total_ongkir)}
          </Text>
        </View>

        <View style={{ padding: 10 }}>
          <MyButton
            onPress={simpan}
            title="SIMPAN PESANAN"
            warna={colors.secondary}
            Icons="cloud-upload"
            style={{
              justifyContent: 'flex-end',
            }}
          />
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {

            setModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomColor: colors.border,
                borderBottomWidth: 1,
              }}>
                <Text style={{
                  flex: 1,
                  margin: 10,
                  marginBottom: 15,
                  fontFamily: fonts.secondary[600],
                  textAlign: "center"
                }}>Opsi Pengiriman</Text>
                <Pressable
                  style={{
                    padding: 10,
                  }}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={{
                    fontFamily: fonts.secondary[600],
                    color: colors.primary,
                    fontSize: windowWidth / 20,
                    textAlign: 'center'
                  }}>X</Text>
                </Pressable>
              </View>

              {kurir.map(i => {
                return (
                  <Pressable onPress={() => {
                    console.log(kirim);
                    setModalVisible(false);
                    setKirim({
                      ...kirim,
                      nama_kurir: i.nama_kurir,
                      foto_kurir: i.image,
                      kode_kurir: i.kode_kurir,
                    });

                    setLoading2(true);

                    const dt = {
                      origin: company.fid_kota,
                      originType: 'city',
                      destination: user.fid_kota,
                      destinationType: 'city',
                      weight: kirim.berat_total,
                      courier: i.kode_kurir,

                    };

                    console.warn('kirim ongkir', dt)


                    fetch('https://pro.rajaongkir.com/api/cost', {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'key': '5106929e87e49fdd84a96e55f515f522'
                      },
                      body: JSON.stringify(dt)
                    }).then((response) => response.json())
                      .then((json) => {
                        setOpen(true);
                        setLoading2(false);
                        console.log(json.rajaongkir.results[0].costs);
                        setPaket(json.rajaongkir.results[0].costs)
                      })


                  }} style={{
                    padding: 10,
                    marginVertical: 2,
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border
                  }}>

                    <Text style={{
                      flex: 1,
                      fontFamily: fonts.secondary[600],
                      fontSize: windowWidth / 30
                    }}>{i.nama_kurir}</Text>
                    <Image source={{
                      uri: i.image
                    }} style={{
                      resizeMode: 'contain',
                      width: 100,
                      height: 30,

                    }} />
                  </Pressable>
                )
              })}

            </View>
          </View>
        </Modal>


      </SafeAreaView>
      {
        loading && (
          <LottieView
            source={require('../../assets/animation.json')}
            autoPlay
            loop
            style={{ backgroundColor: colors.primary }}
          />
        )
      }
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 22
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 0,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    flex: 1,
    marginBottom: 15,
    textAlign: "center"
  }
});
