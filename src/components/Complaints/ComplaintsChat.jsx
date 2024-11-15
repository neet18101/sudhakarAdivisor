import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Dimensions, ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import GlobalHeader from '../../common/GlobalHeader';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Colors from '../../constants/Colors';
import URLActivity from '../../utlis/URLActivity';

export default function ComplaintsChat({ navigation }) {
    const [chatUser] = useState({
        name: 'Robert Henry',
        profile_image: 'https://randomuser.me/api/portraits/men/0.jpg',
        last_seen: 'online',
    });
    const [currentUser] = useState({
        name: 'John Doe',
    });

    const route = useRoute();
    const TicketID = route.params?.TicketID;

    const [messages, setMessages] = useState([]);

    const [inputMessage, setInputMessage] = useState('');

    const fetchTicketDetails = () => {
        const formdata = new FormData();
        formdata.append('TicketNo', TicketID);

        fetch(URLActivity.GetTicketDetail, {
            method: 'POST',
            body: formdata,
        })
            .then(response => response.json())
            .then(data => {
                setMessages(data);
            })
            .catch(error => console.error('Error fetching ticket details:', error));
    };

    useEffect(() => {
        fetchTicketDetails();
    }, []);

    function getTime(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    function sendMessage() {
        if (inputMessage === '') {
            return setInputMessage('');
        }
        let t = getTime(new Date());
        setMessages([
            ...messages,
            {
                sender: currentUser.name,
                message: inputMessage,
                time: t,
                SendByType: 'U', // Assuming this indicates the current user/admin
            },
        ]);
        setInputMessage('');
    }

    return (
        <View style={styles.container}>
            <GlobalHeader
                title={`Chat No ${TicketID}`}
                leftComponent={
                    <TouchableOpacity onPress={() => navigation.navigate('ComplaintsList')}>
                        <Icon name="arrow-back" size={wp(6)} color={Colors.white} />
                    </TouchableOpacity>
                }
            />
            <View style={styles.chatContainer}>
                <FlatList
                    style={styles.messagesContainer}
                    data={messages?.result}
                    renderItem={({ item }) => (
                        <View style={styles.messageWrapper}>
                            <View
                                style={{
                                    ...styles.messageBubble,
                                    backgroundColor: item.SendByType.trim() === 'U' ? '#fff' : '#3a6ee8',
                                    alignSelf: item.SendByType.trim() === 'U' ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <Text style={{ color: item.SendByType.trim() === 'U' ? '#000' : '#fff', fontSize: 16 }}>
                                    {item.Message}
                                </Text>

                                <Text style={styles.messageTime}>{item.Date1?.split(' ')[0]}</Text>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    inverted
                />
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.messageInputView}>
                    <TextInput
                        value={inputMessage}
                        style={styles.messageInput}
                        placeholder='Message'
                        placeholderTextColor="#0000"
                        onChangeText={(text) => setInputMessage(text)}
                        onSubmitEditing={sendMessage}
                    />
                    <TouchableOpacity style={styles.messageSendView} onPress={sendMessage}>
                        <Icon name='send' size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2ff',
    },
    chatContainer: {
        flex: 1,
        justifyContent: 'space-between',

    },
    messagesContainer: {
        flex: 1,
    },
    messageWrapper: {
        marginTop: 6,
        paddingHorizontal: 10,
    },
    messageBubble: {
        maxWidth: Dimensions.get('screen').width * 0.8,
        padding: 10,
        borderRadius: 8,
        marginVertical: 2,
    },
    messageTime: {
        color: '#b3b3b3',
        fontSize: 14,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#f2f2ff',
        padding: 10,
        justifyContent: 'flex-end'
    },
    messageInputView: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 4,
        alignItems: 'center',
    },
    messageInput: {
        height: 40,
        flex: 1,
        paddingHorizontal: 10,
        color: '#000',
    },
    messageSendView: {
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
});
