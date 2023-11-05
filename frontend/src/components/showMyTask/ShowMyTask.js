/* eslint-disable prettier/prettier */
import { View, Text, Image, StyleSheet, useWindowDimensions, Pressable, Modal, TextInput} from 'react-native';
import React, {useState} from 'react';
import { InMemoryCache, ApolloClient, ApolloProvider } from '@apollo/client';
import {createuploadlink} from 'apollo-upload-client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

// const EditTask = ({modal, setModal, taskName, setTaskName, taskDeadline, setTaskDeadline}) => {
//     const [date, setDate] = useState(new Date());
//     const [show, setShow] = useState(false);
//     const [input, setInput] = useState(taskName);
//     const onChange = (event, selectedDate) => {
//       const currentDate = selectedDate || date;
//       setDate(currentDate);
//       setShow(false);
//       console.log(currentDate);
//     };
  
//     const onPressed = () => {
//       setShow(true);
//     };
  
//     const editTask = () => {
//       // mutation
//       setTaskName(input);
//       setTaskDeadline(date);
//       setModal(!modal);
//     };
  
//     return (
//       <View>
//         <View>
//           <Text style={styles.header} >EditTaskScreen</Text>
//           <Pressable onPress={()=> setModal(!modal)}style={styles.exit}>
//             <MaterialCommunityIcons name="close" size={20} color={'black'}/>
//           </Pressable>
//           <TextInput placeholder={taskName} style={styles.input} value={input} onChange={setInput}/>
//           <Pressable onPress={onPressed} style={styles.choose}>
//             <Text>Choose deadline</Text>
//           </Pressable>
//           {show && (
//             <DateTimePicker
//             testID='dateTimePicker'
//             mode='date'
//             value={date}
//             is24Hour={true}
//             display='default'
//             onChange={onChange}/>
//           )}
//         </View>
//         <View>
//           <Pressable onPress={editTask} style={styles.add}>
//             <Text>Edit</Text>
//           </Pressable>
//         </View>
//       </View>
//     );
//   };
  

const ShowMyTask = (props) => {
    const [modal, setModal] = useState(false);
    const editTask = () => {
        setModal(true);
    };
    let {name, deadline, status, image} = props.props;
    // const [taskDeadline, setTaskDeadline] = useState(deadline);
    // const [taskName, setTaskName] = useState(name);
    const {height} = useWindowDimensions();
    let textColour;
    if (status === 'todo'){
        status = 'still to do';
        textColour = '#f08bb5';
    } else {
        textColour = '#6eb591';
    };
    const textDeadline = deadline.slice(0, 10);

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [input, setInput] = useState(name);
    const chooseDate = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      setShow(false);
      console.log(currentDate);
    };
    const datePressed = () => {
      setShow(true);
    };
    const editPressed = () => {
      // mutation
      name = input;
      deadline = date;
      setModal(!modal);
    };
    
    return (
        <View style={styles.root}>
            <Text style={styles.title}>Task: {name} - {status}</Text>
            <Text style={[styles.deadline, {color: textColour}]}>Deadline: {textDeadline}</Text>
            {status === 'done' ? <Image style = {[styles.post, {height: height * 0.4}]} source={{uri: image}} /> : <Text style={styles.notDone}>Upload task</Text>}
            <Pressable onPress={editTask} style={styles.edit}>
                <MaterialCommunityIcons name='pencil' size={25}/>
            </Pressable>
            {modal && (
                <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
                onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModal(!modal);
                }}>
                <View style={{backgroundColor: 'white', flex: 1}}>
                  <View>
                    <Text style={styles.header} >EditTaskScreen</Text>
                    <Pressable onPress={()=> setModal(!modal)}style={styles.exit}>
                      <MaterialCommunityIcons name="close" size={20} color={'black'}/>
                    </Pressable>
                    <TextInput placeholder={name} style={styles.input} value={input} onChange={setInput}/>
                    <Pressable onPress={chooseDate} style={styles.choose}>
                      <Text>Choose deadline</Text>
                    </Pressable>
                    {show && (
                      <DateTimePicker
                      testID='dateTimePicker'
                      mode='date'
                      value={deadline}
                      is24Hour={true}
                      display='default'
                      onChange={datePressed}/>
                    )}
                  </View>
                  <View>
                    <Pressable onPress={editPressed} style={styles.add}>
                      <Text>Edit</Text>
                    </Pressable>
                  </View>
                </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        marginHorizontal: 20,
    },
    post: {
        width: '100%',
        borderRadius: 30,
        marginBottom: 30,
    },
    title: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 10,
        marginRight: 60,
    },
    deadline: {
        marginHorizontal: 10,
        marginVertical: 5,
        marginBottom: 20,
    },
    notDone: {
        fontStyle: 'italic',
        fontSize: 15,
        padding: 4,
        borderWidth: 2,
        borderRadius: 20,
        textAlign: 'center',
    },
    edit: {
        position: 'absolute',
        right: 20,
        top: 15,
    },
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
        marginBottom: 80,
    },
    exit:{
        position: 'absolute',
        right: 20,
        top: 10,
    },
    add:{
        position: 'absolute',
        right: 50,
    },
});

export default ShowMyTask;
