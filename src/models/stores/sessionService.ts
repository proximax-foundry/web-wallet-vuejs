export class SessionService{

    static getRaw(key: string): string | null{
        return sessionStorage.getItem(key);
    }

    static getJSONParse(key: string): any{

        try {
            const value = sessionStorage.getItem(key);

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

    static getNumber(key: string): number{
        return Number(sessionStorage.getItem(key));
    }

    static setRaw(key: string, value: string): void{
        sessionStorage.setItem(key, value);
    }

    static setObject(key: string, value: any): void{
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    static setNumber(key: string, value:number): void{
        sessionStorage.setItem(key, value.toString());
    }
}