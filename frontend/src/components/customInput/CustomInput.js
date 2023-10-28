/* eslint-disable prettier/prettier */
import { View, TextInput, StyleSheet} from 'react-native';
import React from 'react';

const CustomInput = ({value, setValue, placeholder, secureTextEntry}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry} />
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        width: '100%',
        paddingHorizontal: 10,
        marginVertical: 5,
        borderColor: '#9dbed1',
        borderWidth: 1,
        borderRadius: 5,
    },
    input: {
      fontSize: 13,
    },
});

export default CustomInput;
