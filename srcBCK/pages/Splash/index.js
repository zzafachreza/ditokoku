import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Image,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { color, asin } from 'react-native-reanimated';
import { getData, storeData, urlAPI } from '../../utils/localStorage';
import { PermissionsAndroid } from 'react-native';
import LottieView from 'lottie-react-native';
import axios from 'axios';

export default function Splash({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const scaleLogo = new Animated.Value(10);
  const scaleRadius = new Animated.Value(0);

  Animated.timing(scaleLogo, {
    toValue: 300,
    duration: 1000,
  }).start();

  Animated.timing(scaleRadius, {
    toValue: 100,
    duration: 1000,
  }).start();


  useEffect(() => {



    const unsubscribe = getData('user').then(res => {
      // console.log(res);
      if (!res) {
        // console.log('beum login');

        setTimeout(() => {
          navigation.replace('Login');
        }, 1500);
      } else {
        console.log('sudah login logon');

        setTimeout(() => {
          navigation.replace('MainApp');
        }, 1500);
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.page}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>

        <Animated.Image
          source={require('../../assets/splash.png')}
          style={{
            height: scaleLogo,
            width: scaleLogo,
            resizeMode: 'contain',
            marginBottom: 20,

          }}
        />

        <ActivityIndicator size="large" color={colors.secondary} />

      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    flex: 1,
  },
  image: {
    aspectRatio: 1,
    width: 250,
    height: 250,
  },
});
