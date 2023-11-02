import { ScrollView, View, Text, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import taskstab from '../../../assets/data/taskstab';
import ShowMyTask from '../../components/showMyTask/ShowMyTask';

const username = 'mariadyli';
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

let tasks = [];
taskstab.forEach((element) => {
  if (element.user === username){
    let memo ={};
    memo["name"] = element.name;
    memo["status"] = element.status;
    memo['image'] = element.image;
    tasks.push(memo);
  };
});
console.log(tasks);


const MyTasksScreen = () => {
  
  return (
    <View style={styles.root}>
      <Text style={styles.title} > ~ My Tasks</Text>
      <View styles={styles.container}>
        <Text style={styles.done}>{percentageDone} done</Text>
        <Text style={styles.todo}>{percentageToDo} to do</Text>
      </View>
      <View style={{marginBottom: 100}}>
        <FlatList
        data={tasks}
        renderItem={({item}) => <ShowMyTask props={item} />}
        />
      </View>
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
  }
});

export default MyTasksScreen;