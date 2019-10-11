import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Db } from '../../db';
import ConfirmModal from '../../modals/confirm-modal';
import MsgModal from '../../modals/msg-modal';
import TanslatorWatson from '../../translator/watson';


class ListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item: this.props.item,
            // translations: Object.assign([], this.props.item.translations),
            isConfirmModalVisible: false,
            isMsgModalVisible: false,
            activity: []
        };
    }

    componentDidMount() {
        let translations = Object.assign([], this.props.item.translations);
        let activity = [];
        translations.map((_, index) => {
            activity.push(false);
        });
        this.setState({ activity });
    }

    saveItem(item) {
        if (item.text) {
            Db.open().saveItem(item);
            this.props.updateItem(item);
        }
    }

    saveTranslation(index) {
        if (this.state.item.text) {
            Db.open().saveTranslation(this.state.item.id, this.state.item.translations[index]);
            this.props.updateItem(this.state.item);
        }
    }

    deleteItem(id) {
        this.props.deleteItem(id);
    }

    async translate(item, index) {

        let activity = this.state.activity;
        activity[index] = true;

        this.setState({ item: this.props.item, activity }, async () => {

            if (item && this.state.item.translations[index]) {
                var translater = new TanslatorWatson();

                try {
                    var result = await translater.translate({ text: item, model: this.props.config.targets[index].model });
                    this.state.item.translations[index].text = result.translations[0].translation;
                    this.setState({ translations: Object.assign([], this.state.item.translations) });
                    this.saveTranslation(index);
                } catch (error) {
                    this.changeMsgModalVisibility(true);
                }
            }
            activity[index] = false;
            this.setState(activity);
        });
    }

    updateTranslation = (index, newText) => {
        this.state.item.translations[index].text = newText;
        this.setState({ translations: Object.assign([], this.state.item.translations) })
    }

    okClick = (okClicked) => {

        if (okClicked) {
            this.deleteItem(this.props.item.id);
        }

        this.setState({ isConfirmModalVisible: false });
    }

    okMsgClick = () => {
        this.setState({ isMsgModalVisible: false });
    }

    changeConfirmModalVisibility = (isConfirmModalVisible) => {
        this.setState({ isConfirmModalVisible });
    }

    changeMsgModalVisibility = (isMsgModalVisible) => {
        this.setState({ isMsgModalVisible });
    }

    render() {
        let translations = Object.assign([], this.props.item.translations);
        const activity = this.state.activity;
        return (

            <View style={styles.container}>

                <Modal
                    visible={this.state.isConfirmModalVisible}
                    transparent={true}
                    onRequestClose={() => this.changeConfirmModalVisibility(false)}>

                    <ConfirmModal
                        text="Delete this item?"
                        title="Confirm delete"
                        okClick={this.okClick} />
                </Modal>

                <Modal
                    visible={this.state.isMsgModalVisible}
                    transparent={true}
                    onRequestClose={() => this.changeMsgModalVisibility(false)}>

                    <MsgModal
                        title="Can't translate"
                        text="Maybe you are having a network problem"
                        okClick={this.okMsgClick} />
                </Modal>

                <View style={styles.iconsContainer}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                            this.changeConfirmModalVisibility(true);
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

                <Text style={styles.languageID}>{this.props.config.src}</Text>
                <Input
                    style={styles.inputContainer}
                    multiline={true}
                    placeholder='Text'
                    onChangeText={(text) => this.setState({ 'item': { ...this.state.item, 'text': text } })}
                    onBlur={() => { this.saveItem(this.state.item) }}
                    value={this.state.item.text}
                />



                {
                    translations && translations.map((translation, index) => {
                        return (
                            <View key={index}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Text style={styles.languageID}>{this.props.config.targets[index].target}</Text>
                                    {
                                        //While there's a bug with animating
                                        activity[index] && <ActivityIndicator
                                            animating={true}
                                            style={{ marginTop: 10, marginRight: 10 }}
                                            size="small"
                                            color="#0000ff" />
                                    }
                                    <TouchableOpacity
                                        style={{ marginTop: 10 }}
                                        onPress={() => {
                                            this.translate(this.state.item.text, index);
                                        }}
                                    >
                                        <Icon
                                            name="translate"
                                            size={20}
                                            color="blue"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Input
                                    style={styles.inputContainer}
                                    multiline={true}
                                    placeholder="Translation"
                                    onChangeText={(newText) => this.updateTranslation(index, newText)}
                                    onBlur={() => { this.saveTranslation(index) }}
                                    value={translation.text}
                                />
                            </View>)
                    })
                }

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
    languageID: {
        color: 'grey',
        fontSize: 15,
        marginTop: 10,
        flex: 1
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
        height: 30,
        backgroundColor: 'red',
        alignItems: 'center',
        marginTop: 0
    },
    iconsContainer: {
        backgroundColor: '#fff',
        flexDirection: "row",
        justifyContent: 'flex-end',
        marginTop: -25,
        marginRight: -1
    },
})


export default ListItem;