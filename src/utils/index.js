import models from '../translator/watson/models';

export class Utils {
    static getLanguages() {
        let allLanguages = {}
        let list = [];

        models.list.map(model => {
            if(!list.includes(model.src)) {
                list.push(model.src);
            }
            if(!list.includes(model.target)) {
                list.push(model.target);
            }
        });
        allLanguages.list = list;
        return allLanguages;
    }
}