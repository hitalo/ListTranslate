import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableWithoutFeedback, TextInput } from 'react-native';

class InputModal extends Component {

    constructor(props) {
        super(props);
        this.state = { isModalVisible: false, input: "" };
    }

    componentDidMount() {
        if(this.props.text) {
            this.setState({ input: this.props.text.trim() });
        }
    }

    okClick = (okClicked) => {
        this.props.okClick(okClicked, this.state.input);
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
                            <View style={styles.bodyView}>
                                <TextInput
                                    style={styles.inputGroupName}
                                    placeholder={this.props.placeholder || 'Text'}
                                    onChangeText={(input) => this.setState({ 'input': input })}
                                    value={this.state.input}
                                    maxLength={30}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                />
                            </View>
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
        paddingRight: 10
    },
    bodyText: {
        fontSize: 20
    },
    inputGroupName: {
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

export default InputModal;