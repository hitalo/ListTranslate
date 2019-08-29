import Realm from 'realm';
import uuid from 'react-native-uuid';

// class Item { }
// class Translations { }

const TranslationsSchema = {
    name: 'Translations',
    primaryKey: 'id',
    properties: {
        id: 'string',
        text: 'string'
    }
};

const ItemSchema = {
    name: 'Itens',
    primaryKey: 'id',
    properties: {
        id: 'string',
        text: 'string',
        translations: { type: 'list', objectType: 'Translations' }
    }
};

export class RealmDB {

    addItem(item) {

        Realm.open({ schema: [TranslationsSchema, ItemSchema] }).then(realm => {
            realm.write(() => {
                let newItem = realm.create('Itens', { id: item.id, text: item.text, translations: [] }, true);
                const translations = Object.assign([], item.translations);
                translations.forEach(translation => {
                    newItem.translations.push(realm.create('Translations', translation, true));
                });
            });

            realm.close();
        }).catch(e => { console.error("add error open ", e); });

    }


    getItens() {

        try {

            return Realm.open({ schema: [ItemSchema, TranslationsSchema] }).then(realm => {
                let itens = realm.objects('Itens');
                itens = this.convertToArray(itens);
                return itens;
            }).catch(e => { console.error("get error open ", e); });

        } catch (e) {
            console.error("get itens error ", e);
        }
    }

    deleteItem(id) {

        return Realm.open({ schema: [ItemSchema, TranslationsSchema] }).then(realm => {

            const item = realm.objects('Itens').filtered('id == $0', id.trim())[0];

            if (item) {
                realm.write(() => { realm.delete(item); });
                return true;
            }

            return false;
        }).catch(err => {
            console.error("delete item open error ", err);
        });

    }


    convertToArray(realmObjectsArray) {
        let copyOfJsonArray = Array.from(realmObjectsArray);
        let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
        return jsonArray;
    }
}