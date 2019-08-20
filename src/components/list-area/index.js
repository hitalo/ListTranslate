import React, { Component, Fragment } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import uuid from 'react-native-uuid';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ListItem from '../list-item';
import { Db } from '../../db';

class MainList extends Component {

    texts = [
        {
            id: 1,
            text: ""
        }
    ];

    constructor(props) {
        super(props);
        this.state = { text: '', itens: this.texts};
        this.getItens();
    }

    addNewItem() {
        const item = {id: uuid.v4(), text:""}
        let itens = Array.from(this.state.itens);
        itens.push(item);
        this.setState({itens});
    }

    async getItens() {
        const itens = await Db.open().getItens()
        this.setState({itens});
    }
    
    updateList = () => {
        this.getItens();
    }

    render() {
        return (
            <View style={styles.container}>

                {
                    this.state.itens.map(item => {
                        return (
                            <Card containerStyle={{padding: 0}} key={item.id}>
                                <Fragment>
                                    <ListItem item={ item } updateList={ this.updateList }/>
                                </Fragment>
                            </Card>
                        );
                    })
                }

                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
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
    }
})


export default MainList;