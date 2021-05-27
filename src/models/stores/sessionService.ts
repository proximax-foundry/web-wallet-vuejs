export class SessionService{

    static getRaw(key: string){
        return sessionStorage.getItem(key);
    }

    static getJSONParse(key: string): any{

        try {
            var value = sessionStorage.getItem(key);

            if(value){
                return JSON.parse(value)
            }
            else{
                return null;
            }
        } catch (error) {
            return null;
        }
    }

    static setRaw(key: string, value: string){
        sessionStorage.setItem(key, value);
    }

    static setObject(key: string, value: object){
        sessionStorage.setItem(key, JSON.stringify(value));
    }
}