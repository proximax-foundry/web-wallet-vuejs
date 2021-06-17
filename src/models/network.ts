import { Currency } from "./currency";
import { NetworkType } from "tsjs-xpx-chain-sdk";

export class Network{

    type: number;
    currency: Currency;

    constructor(type: number, currency: Currency){
        this.type = type;
        this.currency = currency;
    }

    static createDefault(): Network{
        return new Network(NetworkType.TEST_NET, Currency.createDefault());
    }

    serialize(){
        return {
            type: this.type,
            currency: this.currency.serialize()
        };
    }
}