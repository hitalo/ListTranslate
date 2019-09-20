import React, { Component, Fragment } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Picker, Text, ScrollView } from 'react-native';
import uuid from 'react-native-uuid';
import { Card, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import ListItem from '../list-item';
import { Db } from '../../db';
import modals from '../../translator/watson/models'
import ConfirmModal from '../../modals/confirm-modal';

class MainList extends Component {

    itens = [{}];

    constructor(props) {
        super(props);
        this.state = {
            itens: this.itens,
            isMenuVisible: false,
            isConfirmMenuVisible: false,
            config: { id: '', src: 'French', target: 'English', model: 'fr-en' },
            src: 'Portuguese',
            target: 'English',
            languages: [],
            targetLanguages: []
        };
    }

    componentDidMount() {
        this.getConfigs();
        this.getItens();
        this.props.navigation.setParams({ changeMenuVisibility: this.changeMenuVisibility });
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('group').name,
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        navigation.getParam('changeMenuVisibility')(true);
                    }}
                >
                    <Icon name="more-vert" size={30} color="white" />
                </TouchableOpacity>
            ),
        }
    };

    addNewItem() {
        const item = {
            id: uuid.v4(),
            group_id: this.props.navigation.getParam('group').id,
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
        const itens = await Db.open().getItens(this.props.navigation.getParam('group').id);
        this.setState({ itens });
    }

    async getConfigs() {
        let configs = await Db.open().getConfigs(this.props.navigation.getParam('group').id);
        if (configs.length) {
            configs.map(c => {
                let config = this.state.config;
                config.id = c.id;
                config.group_id = c.group_id;
                config.src = c.src;
                config.target = c.target;
                config.model = c.model;
                this.setState({ config }, () => this.getLanguages());
            });
        } else {
            this.getLanguages();
        }
    }

    updateList = () => {
        this.getItens();
    }

    getItemByModal(model) {
        return modals.list.filter(item => { return item.model === model })[0];
    }

    changeMenuVisibility = (isMenuVisible) => {
        this.setState({ isMenuVisible, src: this.state.config.src, target: this.state.config.target });
    }

    changeConfirmMenuVisibility = (isConfirmMenuVisible) => {
        this.setState({ isConfirmMenuVisible });
    }

    selectLanguage(selectedLanguage) {
        targets = [];
        modals.list.map(item => {
            if (item.src === selectedLanguage)
                targets.push(item.target);
        });
        src = selectedLanguage;
        target = targets[0];
        this.setState({ src, target, targetLanguages: targets });
    }

    selectLanguageTarget(item) {
        const target = item;
        this.setState({ target });
    }

    saveModel() {
        itens = modals.list.filter(item => {
            return item.src === this.state.src && item.target === this.state.target
        });
        let config = { ...this.state.config }
        config.model = (itens[0].model || "");
        config.src = itens[0].src;
        config.target = itens[0].target;
        config.group_id = (config.group_id || this.props.navigation.getParam('group').id);
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

    getLanguages() {
        languages = [];
        targets = [];
        modals.list.map(item => {
            if (!languages.includes(item.src))
                languages.push(item.src);

            if (item.src === this.state.config.src)
                targets.push(item.target);
        });
        this.setState({ languages: languages, targetLanguages: targets });
    }

    deleteGroup = async (isOkSelected) => {
        if(isOkSelected) {
            await Db.open().deleteGroup(this.props.navigation.getParam('group').id);
            this.changeConfirmMenuVisibility(false);
            this.changeMenuVisibility(false);
            this.props.navigation.navigate('GroupArea');
            this.props.navigation.state.params.updateGroups();
        }

        this.changeConfirmMenuVisibility(false);
    }

    render() {
        return (
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#3e74f0', '#799df2', '#d5e1fb']} style={styles.linearGradient}>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <View style={styles.container}>

                    <Modal
                            style={{ flex: 1 }}
                            visible={this.state.isConfirmMenuVisible}
                            transparent={true}
                            onRequestClose={() => this.changeConfirmMenuVisibility(false)}>
                                <ConfirmModal 
                                    text="Delete this group?" 
                                    title="Confirm delete"
                                    okClick={this.deleteGroup} />
                            </Modal>

                        <Modal
                            style={{ flex: 1 }}
                            visible={this.state.isMenuVisible}
                            transparent={true}
                            onRequestClose={() => this.changeMenuVisibility(false)}>

                            <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={styles.menuView}>
                                    <Text style={{ fontSize: 20, marginBottom: 10 }}>Languages</Text>
                                    <Text style={{ fontSize: 15 }}>From</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Picker
                                            selectedValue={this.state.src}
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
                                    <Text style={{ fontSize: 15 }}>To</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Picker
                                            selectedValue={this.state.target}
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

                                    <Divider style={{ backgroundColor: 'black' }} />

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={styles.menuDeleteGroupButton}
                                            onPress={() => {
                                                this.changeConfirmMenuVisibility(true);
                                            }}
                                        >
                                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <Icon name="clear" size={20} color="red" light/>
                                                <Text style={{ color: 'red', fontSize: 20, marginLeft: 10 }}>DELETE GROUP</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                        </Modal>

                        {
                            this.state.itens.length > 0 && this.state.itens.map((item, index) => {
                                if (item.id) {
                                    return (
                                        <Card key={item.id} containerStyle={{ padding: 0 }}>
                                            <Fragment>
                                                <ListItem config={this.state.config} item={item} deleteItem={this.deleteItem} />
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
                                <Icon name="add" size={50} color="white" />
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </LinearGradient>
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
        borderRadius: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    menuDeleteGroupButton: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        borderColor: 'red',
        borderWidth: 1
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
    }
})


export default MainList;