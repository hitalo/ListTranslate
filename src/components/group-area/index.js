import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import uuid from 'react-native-uuid';

import { Db } from '../../db';
import InputModal from '../../modals/input-modal';
import MsgModal from '../../modals/msg-modal';


class GroupArea extends Component {

    constructor(props) {
        super(props);
        this.state = { newGroupModalVisibility: false, isMsgModalVisible: false, newGroupName: '', groups: [] }
    }

    componentDidMount() {
        this.props.navigation.setParams({ changeNewGroupVisibility: this.changeNewGroupVisibility });
        this.getGroups();
    }

    changeNewGroupVisibility = (isVisible) => {
        this.setState({ newGroupModalVisibility: isVisible });
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: (
                <TouchableOpacity
                    style={{ margin: 10, backgroundColor: '#0845cf', padding: 10 }}
                    onPress={() => {
                        navigation.getParam('changeNewGroupVisibility')(true);
                    }}
                >
                    <Text style={{ color: '#fff' }}>New List</Text>
                </TouchableOpacity>
            ),
        }
    };

    getGroups = async () => {
        groups = await Db.open().getGroups()
        this.setState({ groups });
    }

    responseNewGroup = (isOk, newGroupName) => {
        if (isOk && newGroupName.trim()) {
            let result = this.state.groups.filter(group => group.name == newGroupName);
            if (result.length === 0) {
                const group = { id: uuid.v4(), name: newGroupName.trim() };
                Db.open().saveGroup(group);
                var groups = Array.from(this.state.groups);
                groups.push(group);
                this.setState({ groups });
            } else {
                this.changeMsgModalVisibility(true);
            }
        }
        this.setState({ newGroupModalVisibility: false });
    }

    okMsgClick = () => {
        this.changeMsgModalVisibility(false);
    }

    changeMsgModalVisibility = (isMsgModalVisible) => {
        this.setState({ isMsgModalVisible });
    }

    render() {
        return (

            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#3e74f0', '#799df2', '#d5e1fb']} style={styles.linearGradient}>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>

                    <Modal
                        visible={this.state.isMsgModalVisible}
                        transparent={true}
                        onRequestClose={() => this.changeMsgModalVisibility(false)}>

                        <MsgModal
                            title="Sorry"
                            text="A list with this name already exists!"
                            okClick={this.okMsgClick}
                            outside={this.changeMsgModalVisibility} />
                    </Modal>

                    <Modal
                        style={{ flex: 1 }}
                        visible={this.state.newGroupModalVisibility}
                        transparent={true}
                        onRequestClose={() => this.changeNewGroupVisibility(false)}>
                        <InputModal
                            placeholder="List Name"
                            title="New List"
                            okClick={this.responseNewGroup}
                            outside={this.changeNewGroupVisibility} />
                    </Modal>


                    <View>
                        <View style={{ paddingTop: 20, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                            {
                                this.state.groups.map((group, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={group.id}
                                            style={styles.groupButton}
                                            title="next"
                                            onPress={() => this.props.navigation.navigate('MainList', { group: group, updateGroups: this.getGroups })}
                                        >
                                            <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center' }}>{group.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
    },
    groupButton: {
        height: 150,
        width: 150,
        margin: 10,
        backgroundColor: '#1857ea',
        justifyContent: 'center',
        alignItems: 'center',
    },
    newGroup: {
        fontSize: 24,
        height: 50,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 80
    },
    newGroupModal: {
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
    buttonsView: {
        // flex: 1,
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
    }
})

export default GroupArea;