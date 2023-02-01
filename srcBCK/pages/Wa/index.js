import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts, windowWidth } from '../../utils/fonts';
import { MyInput, MyGap, MyButton } from '../../components';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import { showMessage } from 'react-native-flash-message';
import { Icon } from 'react-native-elements';

export default function Wa() {
  const [com, setCom] = useState({});

  useEffect(() => {
    axios.post(urlAPI + '/company.php').then(res => {
      console.warn(res.data);
      setCom(res.data);
    })
  }, [])
  return (
    <View style={{
      flex: 1,
      padding: 10,
      flexDirection: 'column',
      justifyContent: 'space-around'
    }}>
      <View style={{
        flex: 1,
        backgroundColor: colors.secondary,
        padding: 10,
        marginVertical: 10,
      }}>
        <Text style={{
          fontFamily: fonts.secondary[600],
          fontSize: windowWidth / 20,
        }}>Whatsapp</Text>
        <Text style={{
          fontFamily: fonts.secondary[400],
          fontSize: windowWidth / 15,
        }}>{com.tlp}</Text>
      </View>

      <View style={{
        marginVertical: 10,
        flex: 1,
        backgroundColor: colors.secondary,
        padding: 10,
      }}>
        <Text style={{
          fontFamily: fonts.secondary[600],
          fontSize: windowWidth / 20,
        }}>Email</Text>
        <Text style={{
          fontFamily: fonts.secondary[400],
          fontSize: windowWidth / 15,
        }}>{com.email}</Text>
      </View>

      <View style={{
        flex: 1,
        marginVertical: 10,
        backgroundColor: colors.secondary,
        padding: 10,
      }}>
        <Text style={{
          fontFamily: fonts.secondary[600],
          fontSize: windowWidth / 20,
        }}>Website</Text>
        <Text style={{
          fontFamily: fonts.secondary[400],
          fontSize: windowWidth / 20,
        }}>{com.website}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})