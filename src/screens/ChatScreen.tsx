//screens/ChatScreen.tsx

import React, { useState, useEffect } from 'react';
import { Button, Header } from 'react-native-elements';
import {
    StyleSheet,
    TextInput,
    SafeAreaView,
    SafeAreaProvider,
    KeyboardAvoidingView,
    View,
    FlatList,
    Alert,
    Platform,
    StatusBar,
    ImageBackground
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import * as firebase from 'firebase';
import { getMessageDocRef, getUserId } from '../lib/firebase';
import { Message } from '../types/message';
import { MessageItem } from '../components/MessageItem';




export const ChatScreen = () => {
    const [text, setText] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [userId, setUserId] = useState<string | undefined>();


    const sendMessage = async (value: string, uid: string | undefined) => {
        
        if (value != '') {
            const docRef = await getMessageDocRef();
            const newMessage = {
                text: value,
                createdAt: firebase.firestore.Timestamp.now(),
                userId: uid
            } as Message;
            
            await docRef.set(newMessage);
            setText('');
        } else {
            Alert.alert('エラー', 'メッセージやを入力してください');
        }
    };

    const getMessages = async () => {
        const messages = [] as Message[];
        firebase
            .firestore()
            .collection('messages')
            .orderBy('createdAt')
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        messages.unshift(change.doc.data() as Message);
                    }
                });
                setMessages(messages);
            });
    };

    const signin = async () => {
        const uid = await getUserId();
        setUserId(uid);
    };

    useEffect(() => {
        signin();
        getMessages();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ExpoStatusBar style="auto" />
            <Header 
                placement="center"
                leftComponent={{ icon: 'menu', color: '#94aa44' }}
                centerComponent={{ text: 'メンターチャット', style: { fontSize: 18, color: '#3d3d3d' } }}
                rightComponent={{ icon: 'home', color: '#94aa44' }}
                containerStyle={{ paddingBottom: 50}}
                backgroundColor='#eff4ef'
                backgroundImage={require('./chatback.png')}
                backgroundImageStyle={{height: 150, flex: 1 ,resizeMode: 'contain' ,bottom: 0}}
                >
             </ Header>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior="padding"
            >
                <FlatList
                    style={styles.messagesContainer}
                    data={messages}
                    inverted={true}
                    renderItem={({ item }: { item: Message }) => (
                        <MessageItem userId={userId} item={item} />
                    )}
                    keyExtractor={(_, index) => index.toString()}
                />
                <View style={styles.inputTextContainer}>
                    <TextInput
                        style={styles.inputText}
                        onChangeText={(value) => {
                            setText(value);
                        }}
                        value={text}
                        placeholder="メッセージを入力してください"
                        placeholderTextColor="#777"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="done"
                    />
                    <Button
                        title="送 信"
                        type="solid"
                        buttonStyle={{width:70, height:32, backgroundColor:'#8fc31f',padding: 5,borderRadius: 20}}
                        onPress={() => {
                            sendMessage(text, userId);
                        }}                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    keyboardAvoidingView: {
        width: '100%',
        flex: 1
    },
    messagesContainer: {
        width: '100%',
        padding: 10
    },
    inputTextContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    inputText: {
        color: '#333',
        borderWidth: 0,
        
        backgroundColor: '#eff4ef',
        height: 32,
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 20,
        marginRight: 20

    }

});