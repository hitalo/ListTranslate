import React, { Component, Fragment } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Picker, Text } from 'react-native';
import uuid from 'react-native-uuid';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ListItem from '../list-item';
import { Db } from '../../db';
import modals from '../../translator/watson/models'

class MainList extends Component {

    itens = [{}];

    constructor(props) {
        super(props);
        this.state = {
            itens: this.itens,
            isMenuVisible: false,
            config: { id: '', src: 'French', target: 'English', model: 'fr-en' },
            languages: [],
            targetLanguages: []
        };
    }

    componentDidMount() {
        this.getConfigs();
        this.getItens();
    }

    addNewItem() {
        const item = {
            id: uuid.v4(),
            text: "",
            translations: [{
                id: uuid.v4(),
                text: ""
            }]
        }

        let itens = Array.from(this.state.itens);
        itens.push(item);
        this.setState({ itens });
    }

    async getItens() {
        const itens = await Db.open().getItens();
        this.setState({ itens });
    }

    async getConfigs() {
        let configs = await Db.open().getConfigs();
        configs.map(c => {
            let config = this.state.config;
            config.id = c.id;
            config.src = c.src;
            config.target = c.target;
            config.model = c.model;
            this.setState({ config });
        });
    }

    updateList = () => {
        this.getItens();
    }

    getItemByModal(model) {
        return modals.list.filter(item => { return item.model === model })[0];
    }

    changeMenuVisibility = (isMenuVisible) => {
        if (isMenuVisible && this.state.languages.length === 0) {
           
            languages = [];
            modals.list.map(item => {
                if (!languages.includes(item.src))
                    languages.push(item.src);
            });

            state = { languages: languages }
            this.setState(state, () => this.selectLanguage(this.state.config.src));
        }
        this.setState({ isMenuVisible });
    }

    selectLanguage(selectedLanguage) {
        targets = [];
        modals.list.map(item => {
            if (item.src === selectedLanguage)
                targets.push(item.target);
        });
        let config = { ...this.state.config }
        config.src = selectedLanguage;
        this.setState({ config: config, targetLanguages: targets });
    }

    selectLanguageTarget(item) {
        let config = { ...this.state.config }
        config.target = item;
        this.setState({ config });
    }

    saveModel() {
        itens = modals.list.filter(item => {
            return item.src === this.state.config.src && item.target === this.state.config.target
        });
        let config = { ...this.state.config }
        config.model = (itens[0].model || "");
        this.setState({ config }, () => {
            Db.open().saveConfig(config);
            this.changeMenuVisibility(false)
        });
    }

    deleteItem = async (id) => {
        const deleted = await Db.open().deleteItem(id);
        if (deleted) {
            let itens = this.state.itens;
            itens = itens.filter(i => { return i.id !== id });
            this.setState({ itens });
        }
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
                                    selectedValue={this.state.config.src}
                                    style={styles.languagesPicker}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.selectLanguage(itemValue)
                                    }
                                >

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
                                    selectedValue={this.state.config.target}
                                    style={styles.languagesPicker}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.selectLanguageTarget(itemValue)
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
                    this.state.itens.length > 0 && this.state.itens.map((item, index) => {
                        if (item.id) {
                            return (
                                <Card key={item.id} containerStyle={{ padding: 0 }}>
                                    <Fragment>
                                        <ListItem item={item} deleteItem={this.deleteItem} />
                                    </Fragment>
                                </Card>
                            );
                        }
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