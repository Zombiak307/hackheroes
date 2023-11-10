/* eslint-disable prettier/prettier */
import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ShowTask = (props) => {
    const {image, name, status, user} = props.props;
    const {height} = useWindowDimensions();
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setdisLikeCount] = useState(0);

    const handleLike = () => {
        if (likeCount >= 1){
            setLikeCount(likeCount - 1);
        }
        if (dislikeCount == 1){
            return (0);
        }
        if (likeCount == 0){
            setLikeCount(likeCount + 1);
        }
    };
    
    const handledisLike = () => {
        if (dislikeCount >= 1){
            setdisLikeCount(dislikeCount - 1);
        }
        if (likeCount == 1){
            return (0);
        }
        if (dislikeCount == 0){
            setdisLikeCount(dislikeCount + 1);
        }
    };

    return (
        <View style={styles.root}>
            <Text style={styles.user}>@{user}</Text>
            <Text style={styles.title}>Task: {name}</Text>
            {status === 'done' ? (
                <Image style = {[styles.post, {height: height * 0.4}]} source={{uri: image}} /> 
            ) : ( 
                <Text style={styles.notDone}>!Task hasn't been completed yet!</Text>
            )}
            {status === 'done' && (
                <View style = {styles.buttonContainer}>
                    <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
                        <Text style = {{fontSize: 25}}>
                            <MaterialCommunityIcons name="heart" style = {styles.icon} />
                            {likeCount}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handledisLike} style={styles.dislikeButton}>
                        <Text style = {{fontSize: 25}}>
                            <MaterialCommunityIcons name="baseball-bat" style = {styles.icon} />
                            {dislikeCount}
                        </Text>
                    </TouchableOpacity>
                </View>
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
    user :{
        fontFamily: 'Cutive Mono',
        fontSize: 30,
        marginHorizontal: 20,
        marginTop: 20,
        color: 'black',
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
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    likeButton: {
        backgroundColor: '#f52c65',
        //flexDirection: 'row',
        width: '40%',
        padding: 5,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 5,
        marginLeft: 15,
    },
    dislikeButton: {
        backgroundColor: '#8a8888',
        //flexDirection: 'row',
        width: '40%',
        padding: 5,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 5,
        marginRight: 15,
    },
    icon: {
        opacity: 0.7,
        fontSize: 25,
    },
});

export default ShowTask;
