import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fonts, windowWidth } from '../../utils/fonts';
import { colors } from '../../utils/colors';

export default function Akses({ navigation, route }) {
  const item = route.params;
  console.log(route.params);

  const [open, setOpen] = useState(false)
  const [data, setData] = useState({});

  useEffect(() => {

    const dt = {
      waybill: route.params.nomor_resi,
      courier: route.params.kode_kurir,
    };
    console.warn('kirim ongkir', dt)


    fetch('https://pro.rajaongkir.com/api/waybill', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'key': '5106929e87e49fdd84a96e55f515f522'
      },
      body: JSON.stringify(dt)
    }).then((response) => response.json())
      .then((json) => {

        if (json.rajaongkir.status.code == 400) {
          console.log(json.rajaongkir);
          Alert.alert('Informasi Lacak Resi', 'Maaf nomor resi Anda tidak valid !')
        } else {
          console.log(json.rajaongkir.result.manifest);
          setData(json.rajaongkir.result);
          setOpen(true);
        }

      })
  }, [])

  const MyList = ({ judul, isi }) => {
    return (
      <View style={{
        flexDirection: 'row',
        padding: 10,
        backgroundColor: colors.white,
      }}>
        <View style={{
          flex: 0.5,
          justifyContent: 'center'
        }}>
          <Text style={{
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 30,
            color: colors.black,

          }}>{judul}</Text>
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
            {isi}
          </Text>
        </View>
      </View>
    )
  }


  const MyList2 = ({ judul, isi, jam, kota }) => {
    return (
      <View style={{
        flexDirection: 'row',
        backgroundColor: colors.white,
      }}>
        <View style={{
          flex: 0.5,
          justifyContent: 'center',
          padding: 10,
        }}>
          <Text style={{
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 30,
            color: colors.black,

          }}>{judul}</Text>
          <Text style={{
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 30,
            color: colors.black,

          }}>{jam}</Text>
        </View>
        <View style={{
          width: 10,
          borderLeftWidth: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: colors.primary,
            width: 10,
            marginLeft: -10,
            height: 10,
            borderRadius: 5,
          }} />
        </View>
        <View style={{
          flex: 1.5,
          padding: 10,
          justifyContent: 'flex-start',
        }}>
          <Text style={{
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 30,
            color: colors.black,

          }}>
            {isi}
          </Text>

        </View>
      </View>
    )
  }
  return (
    <SafeAreaView style={{
      flex: 1,
      padding: 10,
    }}>
      <View style={{
        backgroundColor: colors.white,
        marginVertical: 5,
      }}>


        {!open && <ActivityIndicator color={colors.primary} size="large" />}

        {open && <ScrollView showsVerticalScrollIndicator={false}>

          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 30,
            color: colors.black,
            margin: 10,

          }}>Informasi Pengiriman</Text>

          <MyList judul="Nomor Resi" isi={item.nomor_resi} />
          <MyList judul="Tanggal Pengiriman" isi={data.summary.waybill_date} />
          <MyList judul="Ekspedisi" isi={data.summary.courier_name} />
          <MyList judul="Status" isi={data.summary.status} />
          <MyList judul="Pengirim" isi={data.summary.shipper_name} />
          <MyList judul="Asal" isi={data.summary.origin} />
          <MyList judul="Penerima" isi={data.summary.receiver_name} />
          <MyList judul="Tujuan" isi={data.summary.destination} />

          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 30,
            color: colors.black,
            margin: 10,

          }}>Riwayat Pengiriman</Text>


          {data.manifest.map(i => {
            return (
              <MyList2 judul={i.manifest_date} jam={i.manifest_time} isi={i.manifest_description} kota={i.city_name} />
            )
          })}

        </ScrollView>}



      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})