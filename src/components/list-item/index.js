import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Modal from "react-native-modal";

import { Db } from '../../db';
import ConfirmModal from '../../modals/confirm-modal';
import TanslatorWatson from '../../translator/watson';


class ListItem extends Component {

    constructor(props) {
        super(props);
        this.state = { item: this.props.item, translation: this.props.item.text.toUpperCase(), isModalVisible: false };
    }

    saveItem(item) {
        if(item.text) {
            Db.open().addItem(item);
        }
    }

    deleteItem(id) {
        Db.open().deleteItem(id);
        this.props.updateList();
    }

    translate(item) {
        // var translater =  new TanslatorWatson();

        // translater.test(item.text, 'en', 'fr');
    }

    okClick = (okClicked) => {
        
        if(okClicked) {
            this.deleteItem(this.props.item.id);
        } 

        this.setState({ isModalVisible: false });
    }

    changeModalVisibility = (isModalVisible) => {
        this.setState({ isModalVisible });
    }

    render() {
        return (

            <View style={styles.container}>

                <Modal 
                    visible={this.state.isModalVisible} 
                    transparent={true}
                    onRequestClose={() => this.changeModalVisibility(false)}>
                    
                    <ConfirmModal 
                    text="Delete this item?"
                    title="Confirm delete"
                    okClick={this.okClick} />
                </Modal>

                <View style={styles.iconsContainer}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                            this.changeModalVisibility(true);
                        }}
                    >
                        <Icon
                            name="clear"
                            size={30}
                            color="white"
                            light
                        />
                    </TouchableOpacity>
                </View>

                <Input
                    style={styles.inputContainer}
                    multiline={true}
                    placeholder='Text'
                    onChangeText={(text) => this.setState({ 'item': { ...this.state.item, 'text': text }, 'translation': text.toUpperCase() })}
                    onBlur={() => { this.saveItem(this.state.item) }}
                    value={this.state.item.text}
                />
                <Input
                    style={styles.inputContainer}
                    multiline={true}
                    placeholder="Translation"
                    onChangeText={(translation) => this.setState({ 'translation': translation })}
                    onBlur={() => { this.saveItem(this.state.item) }}
                    value={this.state.translation}
                />

                {/* <View style={styles.buttonContainer}>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => {
                            this.translate(this.item);
                        }}
                    >
                        <Text style={{ color: 'white' }}>TRANSLATE</Text>
                    </TouchableOpacity>
                </View> */}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        paddingBottom: 15
    },
    inputContainer: {
        fontSize: 24
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: 'flex-end'
    },
    saveButton: {
        fontSize: 24,
        flex: 0.2,
        height: 30,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 20
    },
    deleteButton: {
        // flex: 0.1,
        height: 30,
        backgroundColor: 'red',
        alignItems: 'center',
        marginTop: 0
    },
    iconsContainer: {
        backgroundColor: '#fff',
        flexDirection: "row",
        justifyContent: 'flex-end',
        marginTop: -25
    },
})


export default ListItem;