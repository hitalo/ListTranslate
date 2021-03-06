import React, { Component, Fragment } from 'react';
import { StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Modal, Picker, Text, ScrollView, TextInput } from 'react-native';
import uuid from 'react-native-uuid';
import { Card, Divider, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import ListItem from '../list-item';
import { Db } from '../../db';
import { Utils } from '../../utils';
import modals from '../../translator/watson/models';
import ConfirmModal from '../../modals/confirm-modal';
import InputModal from '../../modals/input-modal';

class MainList extends Component {

    items = [{}];
    targetToDelete = undefined;
    allLanguages = {};

    constructor(props) {
        super(props);
        this.state = {
            items: this.items,
            allItems: this.items,
            groupName: this.props.navigation.getParam('group').name,
            isMenuVisible: false,
            isConfirmMenuVisible: false,
            isConfirmRemoveTargetVisibility: false,
            isEditGroupModalVisible: false,
            isSearchVisible: false,
            config: { id: '', src: 'English', targets: [{ id: '', target: 'Spanish', model: 'en-es' }] },
            src: 'English',
            targets: [{ target: 'Spanish', model: 'en-es' }],
            languages: [],
            targetLanguages: [],
            search: ''
        };
    }

    componentDidMount() {
        this.allLanguages = Utils.getLanguages();
        this.getConfigs();
        this.getItems();
        this.props.navigation.setParams({ changeMenuVisibility: this.changeMenuVisibility });
        this.props.navigation.setParams({ changeConfirmMenuVisibility: this.changeConfirmMenuVisibility });
        this.props.navigation.setParams({ changeEditGroupVisibility: this.changeEditGroupVisibility });
        this.props.navigation.setParams({ changeSearchVisibility: this.changeSearchVisibility });
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('group').name,
            headerRight: (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.getParam('changeSearchVisibility')();
                        }}
                    >
                        <Icon name="search" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.getParam('changeEditGroupVisibility')(true);
                        }}
                    >
                        <Icon name="edit" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.getParam('changeConfirmMenuVisibility')(true);
                        }}
                    >
                        <Icon name="delete" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.getParam('changeMenuVisibility')(true);
                        }}
                    >
                        <Icon name="more-vert" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            ),
        }
    };

    addNewItem() {
        let item = {
            id: uuid.v4(),
            group_id: this.props.navigation.getParam('group').id,
            text: "",
            translations: []
        }

        this.state.config.targets.map(target => {
            item.translations.push({ id: uuid.v4(), text: "" });
        });

        let items = Array.from(this.state.items);
        let allItems = Array.from(this.state.allItems);
        items.push(item);
        allItems.push(item);
        this.setState({ items, allItems });
    }

    async getItems() {
        const items = await Db.open().getItems(this.props.navigation.getParam('group').id);
        this.setState({ items, allItems: items });
    }

    async getConfigs() {
        let configs = await Db.open().getConfigs(this.props.navigation.getParam('group').id);
        if (configs.length) {
            configs.map(c => {
                let config = this.state.config;
                config.id = c.id;
                config.group_id = c.group_id;
                config.src = c.src;
                config.targets = Object.assign([], c.targets);
                this.setState({ config, src: config.src }, () => this.getLanguages());
            });
        } else {
            this.getLanguages();
        }
    }

    updateList = () => {
        this.getItems();
    }

    updateItem = (item) => {
        let items = this.state.items;
        let itemIndex = items.findIndex((i => i.id === item.id));
        items[itemIndex] = item;

        let allItems = this.state.allItems;
        itemIndex = allItems.findIndex((i => i.id === item.id));
        allItems[itemIndex] = item;

        this.setState({ items, allItems });
    }

    getItemByModal(model) {
        return modals.list.filter(item => { return item.model === model })[0];
    }

    changeMenuVisibility = (isMenuVisible) => {

        if (isMenuVisible) {
            let targets = [];
            this.state.config.targets.map((target, index) => {
                targets[index] = { target: target.target, model: target.model };
            });
            this.setState({ targets });
        }

        this.setState({ isMenuVisible });
    }

    changeConfirmMenuVisibility = (isConfirmMenuVisible) => {
        this.setState({ isConfirmMenuVisible });
    }

    changeConfirmRemoveTargetVisibility = (isConfirmRemoveTargetVisibility, targetToDelete) => {
        this.targetToDelete = (isConfirmRemoveTargetVisibility && targetToDelete != undefined) ? targetToDelete : undefined;
        this.setState({ isConfirmRemoveTargetVisibility });
    }

    changeEditGroupVisibility = (isVisible) => {
        if (isVisible) {
            this.setState({ groupName: this.props.navigation.getParam('group').name });
        }
        this.setState({ isEditGroupModalVisible: isVisible });
    }

    changeSearchVisibility = () => {
        let isSearchVisible = !this.state.isSearchVisible;
        if (!isSearchVisible) {
            this.updateSearch("");
        } else {
            this.refs._scrollView.scrollTo({ y: 0 });
        }
        this.setState({ isSearchVisible });
    }

    selectLanguage(selectedLanguage) {
        let allTargets = [];
        this.allLanguages.list.map(language => {
            allTargets.push({ target: language, model: this.getModel(selectedLanguage, language) });
        });
        allTargets = allTargets.filter(target => target.target !== selectedLanguage);

        let targets = this.state.targets;
        targets.map(target => {
            target.target = allTargets[0].target;
            target.model = allTargets[0].model;
        });

        this.setState({ src: selectedLanguage, targets }, () => this.setState({ targetLanguages: allTargets }));
    }

    selectLanguageTarget(newTarget, index) {
        let targets = this.state.targets;
        targets[index].target = newTarget;
        targets[index].model = this.getModel(this.state.src, newTarget);
        this.setState({ targets });
    }

    getModel(src, target) {
        let list = modals.list.filter(item => {
            return item.src === src && item.target === target;
        });
        return list[0] ? list[0].model : '';
    }

    async saveModel() {

        let config = { ...this.state.config }
        config.src = this.state.src;

        let items = this.state.items;
        let saveItems = false;

        this.state.targets.map((target, index) => {
            if (!config.targets[index]) {
                config.targets[index] = target;

                saveItems = true;
                items.map(item => {
                    item.translations = Object.assign([], item.translations);
                    item.translations.push({ id: uuid.v4(), text: "" });
                });
            } else {
                config.targets[index].target = target.target;
                config.targets[index].model = target.model;
            }
        });

        if (saveItems) { await Db.open().saveAllItems(items); }

        config.group_id = (config.group_id || this.props.navigation.getParam('group').id);
        this.setState({ config, items }, () => {
            Db.open().saveConfig(config);
            this.changeMenuVisibility(false)
        });
    }

    deleteItem = async (id) => {
        await Db.open().deleteItem(id);
        let items = this.state.items;
        items = items.filter(i => { return i.id !== id });

        let allItems = this.state.allItems;
        allItems = allItems.filter(i => { return i.id !== id });

        this.setState({ items, allItems });
    }

    getLanguages() {
        this.setState({ languages: this.allLanguages.list }, () => this.selectLanguage(this.state.src));
    }

    addNewTarget() {
        let allTargets = modals.list.filter(item => {
            return item.src === this.state.src;
        });
        let newTarget = { target: allTargets[0].target, model: allTargets[0].model };
        let targets = this.state.targets;
        targets.push(newTarget);

        this.setState({ targets });
    }

    removeTarget = async (isOkSelected) => {
        if (isOkSelected && this.targetToDelete != undefined) {
            let config = { ...this.state.config }
            let targets = config.targets;

            if (targets.length < 2) {
                console.log('Need at least one target');
                this.changeConfirmRemoveTargetVisibility(false);
                return;
            }

            targets.splice(this.targetToDelete, 1);
            config.targets = targets;

            let items = this.state.items;
            items.map(item => {
                item.translations = Object.assign([], item.translations);
                item.translations.splice(this.targetToDelete, 1);
            });
            await Db.open().saveAllItems(items);
            config.group_id = (config.group_id || this.props.navigation.getParam('group').id);
            await Db.open().saveConfig(config);

            this.setState({ targets, config, items });
        }

        this.changeConfirmRemoveTargetVisibility(false);
    }

    deleteGroup = async (isOkSelected) => {
        if (isOkSelected) {
            await Db.open().deleteGroup(this.props.navigation.getParam('group').id);
            this.changeConfirmMenuVisibility(false);
            this.changeMenuVisibility(false);
            this.props.navigation.navigate('GroupArea');
            this.props.navigation.state.params.updateGroups();
        }

        this.changeConfirmMenuVisibility(false);
    }

    responseEditGroup = async (isOk, groupName) => {
        if (isOk && groupName.trim()) {
            const group = { id: this.props.navigation.getParam('group').id, name: groupName.trim() };
            await Db.open().saveGroup(group);
            this.props.navigation.setParams({ group });
            this.props.navigation.state.params.updateGroups();
        }
        this.setState({ isEditGroupModalVisible: false });
    }

    updateSearch = search => {

        let items = [{}];

        if (!search) {
            items = this.state.allItems;
        } else {
            items = this.state.allItems.filter(allItems => {
                return allItems.text.includes(search);
            });
            Array.prototype.push.apply(items, this.searchInTranslations(search)); //merge the arrays
        }
        this.setState({ search, items });

    };

    searchInTranslations(search) {
        let items = [{}];

        if (search) {
            let itemsToTest = this.state.allItems.filter(items => {
                return !items.text.includes(search); //already tested when includes
            });

            itemsToTest.forEach(item => {
                let matchingTranslations = Object.assign([], item.translations).filter(translation => translation.text.includes(search));
                if (matchingTranslations.length > 0) {
                    items.push(item);
                }
            });
        }

        return items;
    }

    render() {
        return (
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#3e74f0', '#799df2', '#d5e1fb']} style={styles.linearGradient}>
                <ScrollView
                    ref='_scrollView'
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <View style={styles.container}>

                        <Modal
                            style={{ flex: 1 }}
                            visible={this.state.isEditGroupModalVisible}
                            transparent={true}
                            onRequestClose={() => this.changeEditGroupVisibility(false)}>
                            <InputModal
                                placeholder="List Name"
                                title="List"
                                text={this.state.groupName}
                                okClick={this.responseEditGroup}
                                outside={this.changeEditGroupVisibility} />
                        </Modal>

                        <Modal
                            style={{ flex: 1 }}
                            visible={this.state.isConfirmMenuVisible}
                            transparent={true}
                            onRequestClose={() => this.changeConfirmMenuVisibility(false)}>
                            <ConfirmModal
                                text="Delete this list?"
                                title="Confirm delete"
                                okClick={this.deleteGroup}
                                outside={this.changeConfirmMenuVisibility} />
                        </Modal>

                        <Modal
                            style={{ flex: 1 }}
                            visible={this.state.isConfirmRemoveTargetVisibility}
                            transparent={true}
                            onRequestClose={() => this.changeConfirmRemoveTargetVisibility(false)}>
                            <ConfirmModal
                                text="Delete this item?"
                                title="Confirm delete"
                                okClick={this.removeTarget}
                                outside={this.changeConfirmRemoveTargetVisibility} />
                        </Modal>

                        <Modal
                            style={{ flex: 1 }}
                            visible={this.state.isMenuVisible}
                            transparent={true}
                            onRequestClose={() => this.changeMenuVisibility(false)}>


                            <ScrollView
                                contentContainerStyle={{ flexGrow: 1 }}>
                                <TouchableWithoutFeedback
                                    style={{ flex: 1 }}
                                    onPress={() => this.changeMenuVisibility(false)}>
                                    <View
                                        style={{ flexDirection: 'row', flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableWithoutFeedback>
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
                                                {
                                                    this.state.targets.map((target, index) => {
                                                        return (
                                                            <View key={index} style={{ flexDirection: 'row' }}>
                                                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                                    <TouchableOpacity
                                                                        style={{ marginRight: 10 }}
                                                                        onPress={() => {
                                                                            this.changeConfirmRemoveTargetVisibility(true, index);
                                                                        }}
                                                                    >
                                                                        <Icon name="remove" size={20} color="#ccc" />
                                                                    </TouchableOpacity>
                                                                </View>
                                                                <Picker
                                                                    selectedValue={target.target}
                                                                    style={styles.languagesPicker}
                                                                    onValueChange={(itemValue) =>
                                                                        this.selectLanguageTarget(itemValue, index)
                                                                    }
                                                                >
                                                                    {
                                                                        this.state.targetLanguages.map((item, indexTargets) => {
                                                                            return item.model ? (<Picker.Item color={'blue'} label={item.target} value={item.target} key={indexTargets} />) :
                                                                                (<Picker.Item color={'black'} label={item.target} value={item.target} key={indexTargets} />)
                                                                        })
                                                                    }
                                                                </Picker>
                                                            </View>
                                                        )
                                                    })
                                                }

                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <TouchableOpacity
                                                        style={styles.newTarget}
                                                        onPress={() => {
                                                            this.addNewTarget();
                                                        }}
                                                    >
                                                        <Icon name="add" size={30} color="#ccc" />
                                                    </TouchableOpacity>
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

                                                {/* <Divider style={{ backgroundColor: 'black' }} />

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={styles.menuDeleteGroupButton}
                                            onPress={() => {
                                                this.changeConfirmMenuVisibility(true);
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                <Icon name="clear" size={20} color="red" light />
                                                <Text style={{ color: 'red', fontSize: 20, marginLeft: 10 }}>DELETE GROUP</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View> */}
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </TouchableWithoutFeedback>
                            </ScrollView>
                        </Modal>

                        {
                            this.state.isSearchVisible && <SearchBar
                                placeholder="Search items..."
                                onChangeText={this.updateSearch}
                                value={this.state.search}
                                containerStyle={styles.search}
                                inputContainerStyle={styles.searchInput}
                            />
                        }


                        {
                            this.state.items.length > 0 && this.state.items.map((item, index) => {
                                if (item.id) {
                                    return (
                                        <Card key={item.id} containerStyle={{ padding: 0 }}>
                                            <Fragment>
                                                <ListItem config={this.state.config} item={item} deleteItem={this.deleteItem} updateItem={this.updateItem} />
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
    newTarget: {
        fontSize: 24,
        height: 30,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 80,
        borderWidth: 1,
        borderColor: '#ccc'
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
    },
    editGroupModal: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
        maxWidth: 300,
        borderRadius: 10,
    },
    titleView: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    bodyView: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    inputGroupName: {
        fontSize: 20
    },
    buttonsView: {
        backgroundColor: '#ddd',
        flexDirection: 'row',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    buttons: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 20
    },
    buttonsText: {
        color: 'white',
        fontSize: 25
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    okButton: {
        backgroundColor: 'green',
    },
    search: {
        backgroundColor: 'white',
        marginLeft: 13,
        marginRight: 13,
        borderRadius: 30
    },
    searchInput: {
        backgroundColor: 'white',
    }
})


export default MainList;