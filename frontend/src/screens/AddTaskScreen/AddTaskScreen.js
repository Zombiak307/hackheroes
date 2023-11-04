import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import React, {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../../components/customButton';

const AddTaskScreen = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShow(false);
    console.log(currentDate);
  };

  const onPressed = () => {
    setShow(true);
  };

  return (
    <View>
      <View>
        <Text style={styles.header} >AddTaskScreen</Text>
        <TextInput placeholder='Task name' style={styles.input}/>
        <Pressable onPress={onPressed} style={styles.choose}>
          <Text>Choose deadline</Text>
        </Pressable>
        {show && (
          <DateTimePicker
          testID='dateTimePicker'
          value={date}
          is24Hour={true}
          display='default'
          onChange={onChange}/>
        )}
      </View>
        <Pressable style={styles.add}>
          <Text>Add</Text>
        </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    backgroundColor: '#f7f8fa',
    padding: 10,
    fontStyle: 'italic',
    color: 'black',
    marginBottom: 40,
  },
  input:{
    margin: 10,
    borderBottomWidth: 3,
    marginHorizontal: 20,
  },
  choose: {
    margin: 10,
    backgroundColor: '#f7f8fa',
    fontSize: 10,
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 20,
  },
  add:{
    position: 'absolute',
    bottom: 0,

  },
})

export default AddTaskScreen;