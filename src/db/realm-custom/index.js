import Realm from 'realm';
import uuid from 'react-native-uuid';

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

const ConfigsSchema = {
    name: 'Configs',
    primaryKey: 'id',
    properties: {
        id: 'string',
        src: 'string',
        target: 'string',
        model: 'string'
    }
}

export class RealmDB {

    saveItem(item) {

        Realm.open({ schema: [TranslationsSchema, ItemSchema] }).then(realm => {
            realm.write(() => {
                let newItem = realm.create('Itens', { id: item.id, text: item.text, translations: [] }, true);
                const translations = Object.assign([], item.translations);
                translations.forEach(translation => {
                    newItem.translations.push(realm.create('Translations', translation, true));
                });
            });

            realm.close();
        }).catch(e => { console.error("save item error open ", e); });

    }


    getItens() {

        try {

            const realm = new Realm({ schema: [ItemSchema, TranslationsSchema] });
            let itens = realm.objects('Itens');
            itens = this.convertToArray(itens);
            realm.close();
            return itens;

        } catch (e) {
            console.error("get itens error ", e);
        }
    }

    deleteItem(id) {

        return Realm.open({ schema: [ItemSchema, TranslationsSchema] }).then(realm => {

            const item = realm.objects('Itens').filtered('id == $0', id.trim())[0];

            if (item) {
                realm.write(() => { realm.delete(item); });
                realm.close();
                return true;
            }

            realm.close();
            return false;
        }).catch(err => {
            console.error("delete item open error ", err);
        });

    }

    saveTranslation(id, translation) {

        Realm.open({ schema: [TranslationsSchema, ItemSchema] }).then(realm => {
            realm.write(() => {
                let item = realm.create('Itens', { id: id }, true);
                Object.assign([], item.translations).push(realm.create('Translations', translation, true));
            });

            realm.close();
        }).catch(e => { console.error("save translation error open ", e); });

    }

    saveConfig(config) {

        Realm.open({ schema: [ConfigsSchema] }).then(realm => {
            realm.write(() => {
                config.id = (config.id || uuid.v4());
                realm.create('Configs', { id: config.id, src: config.src, target: config.target, model: config.model }, true);
            });

            realm.close();
        }).catch(e => { console.error("save config error open ", e); });

    }

    getConfigs() {

        try {

            const realm = new Realm({ schema: [ConfigsSchema] });
            let configs = realm.objects('Configs');
            configs = this.convertToArray(configs);
            realm.close();
            return configs;

        } catch (e) {
            console.error("get config error ", e);
        }
    }


    convertToArray(realmObjectsArray) {
        let copyOfJsonArray = Array.from(realmObjectsArray);
        let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
        return jsonArray;
    }
}