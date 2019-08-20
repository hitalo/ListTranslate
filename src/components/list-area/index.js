import React, { Component, Fragment } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Picker, Text } from 'react-native';
import uuid from 'react-native-uuid';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ListItem from '../list-item';
import { Db } from '../../db';
import modals from '../../translator/watson/models'

class MainList extends Component {

    texts = [
        {
            id: 1,
            text: ""
        }
    ];

    constructor(props) {
        super(props);
        this.state = { text: '', itens: this.texts, isMenuVisible: false, selectedLanguage:'en-es' };
        this.getItens();
    }

    addNewItem() {
        const item = { id: uuid.v4(), text: "" }
        let itens = Array.from(this.state.itens);
        itens.push(item);
        this.setState({ itens });
    }

    async getItens() {
        const itens = await Db.open().getItens()
        this.setState({ itens });
    }

    updateList = () => {
        this.getItens();
    }

    changeMenuVisibility = (isMenuVisible) => {
        this.setState({ isMenuVisible });
    }

    languageSelect(selectedLanguage) {
        this.setState({ selectedLanguage: selectedLanguage });
    }

    render() {
        return (
            <View style={styles.container}>

                <Modal
                    style={{ flex: 1 }}
                    visible={this.state.isMenuVisible}
                    transparent={true}
                    onRequestClose={() => this.changeMenuVisibility(false)}>

                    <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.menuView}>
                            <Text style={{ fontSize: 20 }}>Translation</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Picker
                                    selectedValue={this.state.selectedLanguage}
                                    style={styles.languagesPicker}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.languageSelect(itemValue)
                                    }
                                    >
                                

                                    {
                                        modals.list.map((item, index) => {
                                            return (<Picker.Item label={item.src + " - " + item.target} value={item.model} key={index} />)
                                        })
                                    }
                                </Picker>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={styles.menuOkButton}
                                    onPress={() => {
                                        this.changeMenuVisibility(false)
                                    }}
                                >
                                    <Text style={{ color: 'white', fontSize: 20 }}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </Modal>

                <TouchableOpacity
                    onPress={() => {
                        this.changeMenuVisibility(true);
                    }}
                >
                    <Icon
                        name="more-vert"
                        size={30}
                        color="white"
                    />
                </TouchableOpacity>

                {
                    this.state.itens.map(item => {
                        return (
                            <Card containerStyle={{ padding: 0 }} key={item.id}>
                                <Fragment>
                                    <ListItem item={item} updateList={this.updateList} />
                                </Fragment>
                            </Card>
                        );
                    })
                }

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.newItem}
                        onPress={() => {
                            this.addNewItem();
                        }}
                    >
                        <Icon
                            name="add"
                            size={50}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    languagesPicker: {
        flex: 1
    },
    newItem: {
        fontSize: 24,
        // flex: 0.5,
        height: 50,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 80
    },
    menuView: {
        backgroundColor: 'white',
        flex: 1,
        maxWidth: 300,
        padding: 10,
        borderRadius: 10,
    },
    menuOkButton: {
        flex: 0.5,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: 20
    }
})


export default MainList;