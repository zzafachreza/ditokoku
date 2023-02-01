import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { MyInput, MyGap, MyButton, MyPicker } from '../../components';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { getData, storeData, urlAPI } from '../../utils/localStorage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { showMessage } from 'react-native-flash-message';
import DatePicker from 'react-native-date-picker';
import { Icon } from 'react-native-elements';

export default function EditProfile({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    getData('user').then(res => {
      setData(res);
      console.error('data user', res);
    });
    console.log('test edit');
  }, []);


  const simpan = () => {
    setLoading(true);
    console.log('kirim edit', data);
    axios.post(urlAPI + '/profile.php', data).then(res => {
      console.log(res.data);
      storeData('user', res.data);
      setLoading(false);
      showMessage({
        type: 'success',
        message: 'Data bershasil diupdate..',
      });
      navigation.replace('MainApp');
    });
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      padding: 10,
    }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: 12
          }}>Customer ID</Text>
          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: 15,
            color: colors.primary
          }}>{data.id_customer}</Text> */}
        </View>

        {/* <MyInput
          label="Nama Toko"
          iconname="home-outline"
          value={data.nama_toko}
          onChangeText={value =>
            setData({
              ...data,
              nama_toko: value,
            })
          }
        />

        <MyInput
          label="Alamat Toko"
          iconname="location-outline"
          value={data.alamat_toko}
          onChangeText={value =>
            setData({
              ...data,
              alamat_toko: value,
            })
          }
        /> */}
        <MyInput
          label="Nama Pribadi"
          iconname="person-outline"
          value={data.nama_lengkap}
          onChangeText={value =>
            setData({
              ...data,
              nama_lengkap: value,
            })
          }
        />

        <MyGap jarak={10} />
        <MyInput
          label="Telepon"
          iconname="call-outline"
          keyboardType="number-pad"
          value={data.telepon}
          onChangeText={value =>
            setData({
              ...data,
              telepon: value,
            })
          }
        />

        <MyGap jarak={10} />

        <MyInput
          label="Alamat"
          iconname="map-outline"
          multiline={true}
          value={data.alamat}
          onChangeText={value =>
            setData({
              ...data,
              alamat: value,
            })
          }
        />






        <MyGap jarak={10} />
        <MyInput
          label="Password"
          placeholder="Kosongkan jika tidak diubah"
          iconname="key-outline"
          secureTextEntry
          value={data.newpassword}
          onChangeText={value =>
            setData({
              ...data,
              newpassword: value,
            })
          }
        />

        <MyGap jarak={20} />
        <MyButton
          warna={colors.primary}
          title="Simpan Perubahan"
          Icons="log-in"
          onPress={simpan}
        />
      </ScrollView>


      {loading && (
        <LottieView
          source={require('../../assets/animation.json')}
          autoPlay
          loop
          style={{
            flex: 1,
            backgroundColor: colors.primary,
          }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})