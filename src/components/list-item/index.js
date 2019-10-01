import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Db } from '../../db';
import ConfirmModal from '../../modals/confirm-modal';
import TanslatorWatson from '../../translator/watson';


class ListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item: this.props.item,
            // translations: Object.assign([], this.props.item.translations),
            isModalVisible: false
        };
    }

    saveItem(item) {
        if (item.text) {
            Db.open().saveItem(item);
        }
    }

    saveTranslation(index) {
        if (this.state.item.text) {
            Db.open().saveTranslation(this.state.item.id, this.state.item.translations[index]);
        }
    }

    deleteItem(id) {
        this.props.deleteItem(id);
    }

    async translate(item, index) {
        var translater = new TanslatorWatson();
        var result = await translater.translate({ text: item, model: this.props.config.targets[index].model });

        this.state.item.translations[index].text = result.translations[0].translation;
        this.setState({ translations: Object.assign([], this.state.item.translations) });
        this.saveTranslation(index);
    }

    updateTranslation = (index, newText) => {
        this.state.item.translations[index].text = newText;
        this.setState({ translations: Object.assign([], this.state.item.translations) })
    }

    okClick = (okClicked) => {

        if (okClicked) {
            this.deleteItem(this.props.item.id);
        }

        this.setState({ isModalVisible: false });
    }

    changeModalVisibility = (isModalVisible) => {
        this.setState({ isModalVisible });
    }

    render() {
        let translations = Object.assign([], this.props.item.translations);
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
        marginTop: -25
    },
})


export default ListItem;