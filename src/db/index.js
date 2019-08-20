import { RealmDB } from './realm-custom';

export class Db {
    static open() {
        this.db = this.db || new RealmDB();
        return this.db;
    }
}