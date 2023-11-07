import { ScrollView, useWindowDimensions, View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput } from 'react-native';
import React, {useState} from 'react';
import taskstab from '../../../assets/data/taskstab';
import ShowMyTask from '../../components/showMyTask/ShowMyTask';
import { profiles } from '../../components/profiles';
import {gql, useQuery, useMutation} from '@apollo/client';

//const username = 'mariadyli';
const user = profiles[2];
const { username, profilePic, myFriends } = user;

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const ADD_TASK = gql`
  mutation addTask($taskName: String!, $score: Int!, $deadline: Date!){
    createTask(taskName: $taskName, deadline: $deadline, score: $score){
      taskId
      taskName
    }
  }
`;

let taskCount = 0;
let doneCount = 0;
taskstab.forEach((element) => {
  if (element.user === username){
    taskCount += 1;
    if (element.status === 'done'){
      doneCount += 1;
    }
  };
});
let percentageDone = Math.floor((doneCount / taskCount) * 100);
let percentageToDo = 100 - percentageDone;
percentageDone = percentageDone.toString();
percentageToDo = percentageToDo.toString();
percentageDone += '%';
percentageToDo += '%';

let tasks_arr = [];
taskstab.forEach((element) => {
  if (element.user === username){
    let memo ={};
    memo["name"] = element.name;
    memo["deadline"] = element.deadline;
    memo["status"] = element.status;
    memo["score"] = element.score;
    memo['image'] = element.image;
    tasks_arr.push(memo);
  };
});

const AddTaskScreen = ({modal, setModal}) => {
  const [createTask, { data, loading, error }] = useMutation(ADD_TASK);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [input, setInput] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShow(false);
    console.log(currentDate);
  };

  const onPressed = () => {
    setShow(true);
  };

  const createTaskPressed = () => {
    addTodo({ variables: { taskName:  input, deadline: date, score: 0} });
    // mutation
    setModal(!modal);
  };

  return (
    <View>
      <View>
        <Text style={styles.header} >AddTaskScreen</Text>
        <Pressable onPress={()=> setModal(!modal)}style={styles.exit}>
          <MaterialCommunityIcons name="close" size={20} color={'black'}/>
        </Pressable>
        <TextInput placeholder='Task name' value={input} onChange={setInput} style={styles.input}/>
        <Pressable onPress={onPressed} style={styles.choose}>
          <Text>Choose deadline</Text>
        </Pressable>
        {show && (
          <DateTimePicker
          testID='dateTimePicker'
          mode='date'
          value={date}
          is24Hour={true}
          display='default'
          onChange={onChange}/>
        )}
      </View>
      <View>
        <Pressable onPress={createTaskPressed} style={styles.add}>
          <Text>Add</Text>
        </Pressable>
      </View>
    </View>
  );
};

const GET_TASKS = gql`
  query getTodos($userId: String!) {
    getTasks(userId: $userId) {
      taskName
      score
      deadline
    }
  }
`;

const MyTasksScreen = () => {
  const { data } = useQuery(GET_TASKS, {
    variables: { "userId": "1699260286367" },
  });
  console.log(data);
  // const tasks = data.getTasks;

  // let taskCount = 0;
  // let doneCount = 0;
  // tasks.forEach((element) => {
  //   taskCount += 1;
  //   if (score >= 5){
  //     doneCount += 1;
  //   };
  // });
  // let percentageDone = Math.floor((doneCount / taskCount) * 100);
  // let percentageToDo = 100 - percentageDone;
  // percentageDone = percentageDone.toString();
  // percentageToDo = percentageToDo.toString();
  // percentageDone += '%';
  // percentageToDo += '%';


  const [show, setShow] = useState(false);
  const addTask = () => {
    setShow(true);
  };
  return (
    <View style={styles.root}>
      <Text style={styles.title} > ~ My Tasks</Text>
      <View styles={styles.container}>
        <Text style={styles.done}>{percentageDone} done</Text>
        <Text style={styles.todo}>{percentageToDo} to do</Text>
      </View>
      <View style={{marginBottom: 100}}>
        <FlatList
        data={tasks_arr}
        renderItem={({item}) => <ShowMyTask props={item} />}
        />
      </View>
      <Pressable onPress={addTask} style={styles.pic}>
        <MaterialCommunityIcons name="plus-box-outline" size={50} color={'#395f75'} />
      </Pressable>
      {show && (
        <Modal
        animationType="slide"
        transparent={true}
        visible={show}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setShow(!show);
        }}>
          <View style={{backgroundColor: 'white', flex: 1}}>
            <AddTaskScreen modal={show} setModal={setShow}/>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#c4e3f5',
    paddingTop: 20,
    width: '100%',
  },
  title:{
    fontFamily: 'Cutive Mono',
    fontSize: 30,
    margin: 20,
  },
  container: {
    paddingBottom: 20,
  },
  done: {
    width: percentageDone,
    backgroundColor: '#75d9a4',
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 50,
  },
  todo: {
    width: percentageToDo,
    position:'absolute',
    alignSelf: 'flex-end',
    height: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#f08bb5',
  },
  pic: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    marginBottom: 20,
    backgroundColor: '#f7f8fa',
    borderRadius: 10,
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

export default MyTasksScreen;
