import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Divider } from 'react-native-elements';
import { bold } from 'ansi-colors';

class MsgModal extends Component {

    constructor(props) {
        super(props);
        this.state = { isModalVisible: false };
    }

    okClick = () => {
        this.props.okClick();
    }

    render() {
        return (
            <View style={styles.content}>
                <TouchableOpacity activeOpacity={1} disabled={true} style={styles.opacity}>
                    <View style={styles.titleView}>
                        <Text style={styles.titleText}>{this.props.title || "Boo!"}</Text>
                    </View>
                    <Divider style={{ backgroundColor: 'black' }} />
                    <View style={styles.bodyView}>
                        <Text style={styles.bodyText}>{this.props.text || "Hi there"}</Text>
                    </View>
                    <Divider style={{ backgroundColor: 'black' }} />
                    <View style={styles.buttonsView}>
                        <TouchableHighlight onPress={() => this.okClick()} style={[styles.buttons, styles.okButton]}>
                            <Text style={styles.buttonsText}>OK</Text>
                        </TouchableHighlight>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    opacity: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10
    },
    bodyView: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bodyText: {
        fontSize: 20
    },
    bodyView: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bodyText: {
        fontSize: 20
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
    buttonsView: {
        // flex: 1,
        backgroundColor: '#ddd',
        flexDirection: 'row',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttons: {
        // flex: 1,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 20
    },
    buttonsText: {
        color: 'white',
        fontSize: 25
    },
    okButton: {
        backgroundColor: 'green',
    }
});

export default MsgModal;