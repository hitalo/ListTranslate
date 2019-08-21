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

    selectedLanguageModel = 'fr-en';

    constructor(props) {
        super(props);
        this.state = {
            itens: this.texts,
            isMenuVisible: false,
            selectedLanguage: "French",
            selectedLanguageTarget: {src: 'French', target: 'English', model: 'fr-en'},
            languages: [],
            targetLanguages: [],
            selectedLanguageModel: this.selectedLanguageModel
        };
        this.getItens();
    }

    componentDidMount() {
        languages = [];
        modals.list.map(item => {
            if (!languages.includes(item.src))
                languages.push(item.src);
        });
        const preSelected = this.getItemByModal(this.selectedLanguageModel);
        state = { languages: languages, selectedLanguage: (preSelected.src || ""), selectedLanguageTarget: (preSelected.target || "") }
        this.setState(state, () => this.languageSelect(preSelected.src));
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

    getItemByModal(model) {
        return modals.list.filter(item => { return item.model === model})[0];
    }

    changeMenuVisibility = (isMenuVisible) => {
        this.getItemByModal(this.state.selectedLanguageModel);
        this.setState({ isMenuVisible });
    }

    languageSelect(selectedLanguage) {
        targets = [];
        modals.list.map(item => {
            if (item.src === selectedLanguage)
                targets.push(item.target);
        });
        this.setState({ selectedLanguage: selectedLanguage, targetLanguages: targets });
    }

    languageTargetSelect(item) {
        this.setState({ selectedLanguageTarget: item });
    }

    saveModel() {
        itens = modals.list.filter(item => {
            return item.src === this.state.selectedLanguage && item.target === this.state.selectedLanguageTarget
        });
        this.setState({ selectedLanguageModel: (itens[0].model || "") }, () => this.changeMenuVisibility(false));
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
                            <Text style={{ fontSize: 20 }}>From</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Picker
                                    selectedValue={this.state.selectedLanguage}
                                    style={styles.languagesPicker}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.languageSelect(itemValue)
                                    }
                                >


                                    {/* {
                                        modals.list.map((item, index) => {
                                            return (<Picker.Item label={item.src + " - " + item.target} value={item.model} key={index} />)
                                        })
                                    } */}
                                    {
                                        this.state.languages.map((language, index) => {
                                            return (<Picker.Item label={language} value={language} key={index} />)
                                        })
                                    }
                                </Picker>
                                </View>
                                <Text style={{ fontSize: 20 }}>To</Text>
                                <View style={{ flexDirection: 'row' }}>
                                <Picker
                                    selectedValue={this.state.selectedLanguageTarget}
                                    style={styles.languagesPicker}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.languageTargetSelect(itemValue)
                                    }
                                >
                                    {
                                        this.state.targetLanguages.map((item, index) => {
                                            return (<Picker.Item label={item} value={item} key={index} />)
                                        })
                                    }
                                </Picker>
                                </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={styles.menuOkButton}
                                    onPress={() => {
                                        this.saveModel();
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
        flexDirection: 'column',
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