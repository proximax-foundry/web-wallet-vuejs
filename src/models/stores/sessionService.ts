export class SessionService{

    static getRaw(key: string){
        return sessionStorage.getItem(key);
    }

    static getJSONParse(key: string){
        return JSON.parse(sessionStorage.getItem(key)) || {};
    }

    static setRaw(key: string, value: string){
        sessionStorage.setItem(key, value);
    }

    static setObject(key: string, value: object){
        sessionStorage.setItem(key, JSON.stringify(value));
    }
}