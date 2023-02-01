import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, ListItem, Button } from 'react-native-elements';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { TextInput } from 'react-native-gesture-handler';

export default function MyInput({
  onFocus,
  label,
  icon = true,
  maxLength,
  iconname,
  onChangeText,
  value,
  keyboardType,
  secureTextEntry,
  styleInput,
  placeholder,
  autoFocus,
  multiline,
  label2,
  styleLabel,
  colorIcon = colors.primary,
}) {

  const [tutup, setTutup] = useState(true);
  return (
    <View style={{

    }}>

      <View
        style={{

          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 5,
        }}>
        {icon && <Icon type="ionicon" name={iconname} color={colorIcon} size={16} />}
        <Text
          style={{
            fontFamily: fonts.secondary[600],
            color: colors.black,
            left: icon ? 10 : 5,
            fontSize: 12,
            ...styleLabel,
          }}>
          {label}
        </Text>
      </View>
      <View style={{
        position: 'relative'
      }}>
        <TextInput
          maxLength={maxLength}
          multiline={multiline}
          autoFocus={autoFocus}
          onFocus={onFocus}
          placeholderTextColor={colors.border}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry ? tutup : false}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          style={{
            backgroundColor: colors.zavalabs,
            borderColor: colors.primary,
            borderRadius: 10,
            // borderWidth: 1,
            paddingLeft: 10,
            color: colors.black,
            fontSize: 12,
            fontFamily: fonts.primary[400],
            ...styleInput,
          }}
        />
        {secureTextEntry &&
          <TouchableOpacity onPress={() => {
            if (tutup) {
              setTutup(false);
            } else {
              setTutup(true);
            }
          }} style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}>
            <Icon type="ionicon" name={!tutup ? 'eye-off' : 'eye'} color={colorIcon} size={18} />
          </TouchableOpacity>}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({});
