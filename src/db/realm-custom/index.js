import Realm from 'realm';

class Item { }

Item.schema = {
    name: 'itens',
    primaryKey: 'id',
    properties: {
        id: 'string',
        text: 'string'
    }
};

export class RealmDB {
    name = "realm-db"

    addItem(item) {

        try {
            Realm.open({schema: [Item.schema]}).then(realm => {
                realm.write(() => {
                    realm.create('itens', { id: item.id, text: item.text }, true);
                });
            });
        } catch (e) {
            console.error("add error ", e);
        }

    }


    getItens() {

        try {

            return Realm.open({schema: [Item.schema]}).then(realm => {
                return realm.objects('itens');
            });

        } catch (e) {
            console.error("get itens error ", e);
        }
    }

    deleteItem(id) {

        try {
            Realm.open({schema: [Item.schema]}).then(realm => {

                const item = realm.objects('itens').filtered('id == $0', id.trim())[0];

                if(item) {
                    realm.write(() => { realm.delete(item); });
                }
            }).catch(err => {
                console.error("delete item open error ", err);
            });
        } catch(e) {
            console.error("delete item error ", e);
        }

    }

}