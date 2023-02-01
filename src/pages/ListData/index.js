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

import 'intl';
import 'intl/locale-data/jsonp/en';
const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
export default function ({ navigation, route }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDataBarang();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {




    getDataBarang();

  }, []);

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
        backgroundColor: 'white',
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
              color: colors.primary,
              fontFamily: fonts.secondary[600],
            }}>
            {item.kode}
          </Text>
          <Text
            style={{
              flex: 1,
              fontSize: windowWidth / 30,
              color: colors.black,
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
              color: colors.success,
              fontFamily: fonts.secondary[600],
            }}>
            {item.status}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          borderTopWidth: 1,
          borderTopColor: colors.tertiary,
        }}>

        <View
          style={{
            flex: 1,
          }}>
          <Text style={{
            fontSize: windowWidth / 30,
            fontFamily: fonts.secondary[400],
            color: colors.black,
          }}>Opsi Pengiriman</Text>
          <Text
            style={{
              fontSize: windowWidth / 30,
              fontFamily: fonts.secondary[600],
              color: colors.black,
            }}>
            {item.nama_kurir}
          </Text>
          <Text
            style={{
              fontSize: windowWidth / 30,
              fontFamily: fonts.secondary[600],
              color: colors.primary,
            }}>
            {item.paket}
          </Text>

        </View>
        <View
          style={{
            alignItems: 'flex-end',
            justifyContent: 'center',

            flex: 1,
          }}>

          <Text style={{
            fontSize: windowWidth / 30,
            fontFamily: fonts.secondary[400],
            color: colors.black,
          }}>Total Pembayaran</Text>
          <Text
            style={{
              fontSize: windowWidth / 20,
              fontFamily: fonts.secondary[600],
              color: colors.black,
            }}>
            Rp. {new Intl.NumberFormat().format(item.total_bayar)}
          </Text>

        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
        />
      }
      style={{
        padding: 10,
      }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
