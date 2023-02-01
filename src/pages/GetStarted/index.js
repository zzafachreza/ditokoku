import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Animated,
  Dimensions,
  ImageBackground,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { MyButton, MyGap } from '../../components';
import { colors } from '../../utils/colors';
import { color } from 'react-native-reanimated';
import { fonts } from '../../utils/fonts';
import LottieView from 'lottie-react-native';
import FastImage from 'react-native-fast-image';

export default function GetStarted({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const bottom = new Animated.Value(windowWidth);
  const opacity = new Animated.Value(0);
  const top = new Animated.Value(0);

  Animated.timing(bottom, {
    toValue: 100,
    duration: 1200,
    useNativeDriver: false,
  }).start();

  Animated.timing(opacity, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: false,
  }).start();

  Animated.timing(top, {
    toValue: 50,
    duration: 1000,
    useNativeDriver: false,
  }).start();

  return (
    <SafeAreaView style={styles.page} resizeMode="cover">
      {/* <StatusBar backgroundColor={colors.secondary} barStyle="light-content" /> */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{
          backgroundColor: colors.white,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
        }}>
          <Image
            source={require('../../assets/splash.png')}
            style={{
              resizeMode: 'contain',
              height: windowHeight / 3,
            }}
          />
          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 28
          }}>Jualan mudah untung berlimpah</Text>
        </View>

      </View>

      <MyButton
        title="LOGIN"
        Icons="log-in-outline"


        warna={colors.primary}
        onPress={() => navigation.navigate('Login')}
      />

      <MyGap jarak={20} />

      <MyButton
        title="REGISTER"
        warna={colors.secondary}
        Icons="create-outline"

        onPress={() => navigation.navigate('Register')}
      />

      <Animated.View style={{ height: top }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    marginTop: 50,
    fontFamily: fonts.secondary[800],
    fontSize: 50,
    color: colors.primary,
  },
});
