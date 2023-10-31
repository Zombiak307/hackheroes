/* eslint-disable prettier/prettier */
import { View, Text, Image, StyleSheet, useWindowDimensions} from 'react-native';
import React from 'react';

const ShowTask = (props) => {
    const {image, name, status, user} = props.props;
    const {height} = useWindowDimensions();
    return (
        <View style={styles.root}>
            <Text style={styles.user}>@{user}</Text>
            <Text style={styles.title}>Task: {name}</Text>
            {status === 'done' ? <Image style = {[styles.post, {height: height * 0.4}]} source={{uri: image}} /> : <Text style={styles.notDone}>!Task hasn't been completed yet!</Text>}
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
    user :{
        fontFamily: 'Cutive Mono',
        fontSize: 30,
        marginHorizontal: 20,
        marginTop: 20,
    },
    title: {
        margin: 10,
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 10,
    },
    notDone: {
        fontStyle: 'italic',
        fontSize: 15,
        padding: 4,
        borderWidth: 2,
        borderRadius: 20,
        textAlign: 'center',
    },
});

export default ShowTask;
