import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { colors } from '../../utils/colors';
import { windowWidth, fonts } from '../../utils/fonts';
import { useIsFocused } from '@react-navigation/native';

import 'intl';
import 'intl/locale-data/jsonp/en';
import MyHeader from '../../components/MyHeader';
const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
export default function ({ navigation, route }) {
  const [data, setData] = useState([]);

  const isFocused = useIsFocused();



  useEffect(() => {

    if (isFocused) {
      getDataBarang();
    }


  }, [isFocused]);

  const getDataBarang = () => {
    getData('user').then(res => {
      axios
        .post(urlAPI + '/transaksi.php', {
          fid_user: res.id,
        })
        .then(x => {
          console.log(x.data);
          setData(x.data);
        });
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ListDetail', item)}
      style={{
        padding: 10,
        margin: 10,
        backgroundColor: colors.background1,
        elevation: 1,
      }}>
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <View style={{
          flex: 1,
        }}>
          <Text
            style={{
              flex: 1,
              fontSize: windowWidth / 30,
              color: colors.textPrimary,
              fontFamily: fonts.secondary[600],
            }}>
            {item.kode}
          </Text>
          <Text
            style={{
              flex: 1,
              fontSize: windowWidth / 30,
              color: colors.textPrimary,
              fontFamily: fonts.secondary[600],
            }}>
            {item.tanggal}
          </Text>
        </View>
        <View style={{
          flex: 1,
        }}>
          <Text
            style={{
              fontSize: windowWidth / 35,
              // color: colors.white,
              textAlign: 'center',
              color: colors.textPrimary,
              fontFamily: fonts.secondary[600],
            }}>
            {item.status}
          </Text>
          <Text
            style={{
              fontSize: windowWidth / 35,
              // color: colors.white,
              textAlign: 'center',
              color: colors.primary,
              fontFamily: fonts.secondary[600],
            }}>
            {item.metode}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          borderTopWidth: 1,
          borderTopColor: colors.primary,
        }}>

        <View
          style={{
            flex: 1,
          }}>
          <Text style={{
            fontSize: windowWidth / 30,
            fontFamily: fonts.secondary[600],
            color: colors.textPrimary,
          }}>Catatan Pesanan</Text>
          <Text style={{
            fontSize: windowWidth / 30,
            fontFamily: fonts.secondary[400],
            color: colors.textPrimary,
          }}>{item.catatan}</Text>

        </View>
        <View
          style={{
          }}>

          <Text style={{
            fontSize: windowWidth / 30,
            fontFamily: fonts.secondary[400],
            color: colors.textPrimary,
          }}>Rp. {new Intl.NumberFormat().format(item.total_harga)}</Text>

        </View>

      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <MyHeader />
      <ScrollView

        style={{
          padding: 10,
          backgroundColor: colors.background1,
        }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});
