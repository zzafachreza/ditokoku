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
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { colors } from '../../utils/colors';
import { windowWidth, fonts } from '../../utils/fonts';
import { Icon } from 'react-native-elements';
const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
export default function ({ navigation, route }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myKey, setMykey] = useState('');

  const key = route.params.key;

  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   getDataBarang();
  //   wait(2000).then(() => setRefreshing(false));
  // }, []);

  useEffect(() => {
    getDataBarang();
  }, []);

  const getDataBarang = (y) => {
    setLoading(true);
    axios.post(urlAPI + '/1data_barang.php', {
      key: route.params.key,
      key2: y,
      id_user: route.params.id_user
    }).then(res => {
      setMykey('');
      console.warn(res.data);
      setLoading(false);
      setData(res.data);
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Pinjam', item);
      }}
      style={{
        flex: 1,
        margin: 5,
        borderWidth: 1,
        borderColor: colors.zavalabs2,

      }}>
      <Image source={{
        uri: item.image
      }} style={{
        alignSelf: 'center',
        // resizeMode: 'contain',
        width: '100%',
        height: 200,

      }} />

      {item.diskon > 0 &&
        <Text
          style={{
            fontSize: windowWidth / 30,
            color: colors.black,
            textAlign: 'right',
            marginRight: 2,
            textDecorationLine: 'line-through',
            textDecorationStyle: 'solid',
            fontFamily: fonts.secondary[600],
          }}>
          Rp. {new Intl.NumberFormat().format(item.harga_dasar)}
        </Text>
      }
      {item.diskon > 0 && <Text
        style={{
          fontSize: windowWidth / 35,
          padding: 5,
          maxWidth: '40%',
          margin: 2,
          borderRadius: 5,
          textAlign: 'center',
          alignSelf: 'flex-end',
          color: colors.white,
          backgroundColor: colors.tertiary,
          fontFamily: fonts.secondary[600],
        }}>
        Disc {new Intl.NumberFormat().format(item.diskon)}%
      </Text>}



      {item.diskon == 0 &&
        <Text
          style={{
            fontSize: windowWidth / 30,
            color: colors.zavalabs,
            textAlign: 'right',
            marginLeft: 5,
            textDecorationLine: 'line-through',
            textDecorationStyle: 'solid',
            fontFamily: fonts.secondary[600],
          }}>

        </Text>
      }
      {item.diskon == 0 && <Text
        style={{
          fontSize: windowWidth / 35,
          padding: 5,
          maxWidth: '40%',
          margin: 2,
          borderRadius: 5,
          textAlign: 'center',
          alignSelf: 'flex-end',
          color: colors.primary,

          fontFamily: fonts.secondary[600],
        }}>

      </Text>}



      <Text
        style={{
          paddingLeft: 5,
          fontSize: windowWidth / 25,
          color: colors.primary,
          fontFamily: fonts.secondary[600],
        }}>
        Rp. {new Intl.NumberFormat().format(item.harga_barang)}
      </Text>
      {/* <Text
        style={{
          padding: 5,
          backgroundColor: colors.primary,
          fontSize: windowWidth / 35,
          color: colors.white, borderRadius: 2,
          fontFamily: fonts.secondary[400],
        }}>
        {item.nama_kategori}
      </Text> */}
      <Text
        style={{
          padding: 5,
          height: 50,
          fontSize: windowWidth / 30,
          color: colors.black, borderRadius: 2,
          fontFamily: fonts.secondary[400],
        }}>
        {item.nama_barang}
      </Text>






    </TouchableOpacity>
  );

  return (
    <SafeAreaView

      style={{
        flex: 1,
        padding: 10,
        backgroundColor: colors.white,
      }}>
      <View style={{
        position: 'relative',
        padding: 5,
      }}>
        <TextInput value={myKey} autoCapitalize='none' onSubmitEditing={(x) => {
          console.warn(x.nativeEvent.text);
          setMykey(x.nativeEvent.text);
          getDataBarang(x.nativeEvent.text);
        }}
          onChangeText={x => setMykey(x)}
          placeholderTextColor={colors.zavalabs}
          placeholder='Masukan kata kunci' style={{
            fontFamily: fonts.secondary[400],
            paddingLeft: 10,
            fontSize: windowWidth / 25,
            borderWidth: 1,
            borderColor: colors.zavalabs,
            // borderRadius: 10,
          }} />
        <View style={{
          position: 'absolute',
          right: 10,
          top: 15,
        }}>
          <Icon type='ionicon' name='search-outline' color={colors.zavalabs} />
        </View>
      </View>
      {loading && <View style={{
        flex: 1,
        marginTop: '50%',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size="large" color={colors.primary} /></View>}
      {!loading && <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
