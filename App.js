import React from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import SocketIOClient from 'socket.io-client';
import {GiftedChat} from 'react-native-gifted-chat-new';

const USER_ID = '"userId';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userId: null
    }
    this.determineUser = this.determineUser.bind(this);
    this.onRecieveMessage = this.onRecieveMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this._storeMessages = this._storeMessages.bind(this);

    this.socket = SocketIOClient('http://localhost:3000');
    this.socket.on('message', this.onRecieveMessage);
    this.determineUser();
  };
  determineUser(){
    AsyncStorage.getItem(USER_ID)
    .then((userId) => {
      if (!userId){
        this.socket.emit('userJoined', null);
        this.socket.on('userJoined', (userId) =>{
          AsyncStorage.setItem(USER_ID, userId);
          this.setState({userId})
        })
      }else {
        this.socket.emit('userJoined', userId);
        this.setState({userId});
      }
    })
    .catch((e) => alert(e));
  
  }
  onRecieveMessage(messages){
    this._storeMessages(messages);

  }
  onSend(messages=[]){
    this.socket.emit('message', messages[0])
    this._storeMessages(messages);
  }
  render() {
    var user = {_id: this.state.usserId || -1};

     return(
       <GiftedChat
       messages={this.state.messages}
       onSend={this.onSend}
       user={user}
       />
     );
  }
  _storeMessages(messages) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages)
      }
    })
  }
}

module.exports=Main;
