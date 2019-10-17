import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { Divider } from 'react-native-elements';

class ConfirmModal extends Component {

    constructor(props) {
        super(props);
        this.state = { isModalVisible: false };
    }

    okClick = (okClicked) => {
        this.props.okClick(okClicked);
    }

    render() {
        return (
            <TouchableWithoutFeedback
                style={{ flex: 1 }}
                onPress={() => this.props.outside(false)}>
                    
                <View style={styles.content}>
                    <TouchableWithoutFeedback>
                        <View style={styles.opacity}>
                            <View style={styles.titleView}>
                                <Text style={styles.titleText}>{this.props.title || "Boo!"}</Text>
                            </View>
                            <Divider style={{ backgroundColor: 'black' }} />
                            <View style={styles.bodyView}>
                                <Text style={styles.bodyText}>{this.props.text || "Hi there"}</Text>
                            </View>
                            <Divider style={{ backgroundColor: 'black' }} />
                            <View style={styles.buttonsView}>
                                <TouchableHighlight onPress={() => this.okClick(false)} style={[styles.buttons, styles.cancelButton]}>
                                    <Text style={styles.buttonsText}>Cancel</Text>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => this.okClick(true)} style={[styles.buttons, styles.okButton]}>
                                    <Text style={styles.buttonsText}>OK</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
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
});

export default ConfirmModal;