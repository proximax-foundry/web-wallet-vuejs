import { create, all } from "mathjs";
import { TimeUnit } from "../models/const/timeUnit"

let mathjs = create(all);

export class UnitConverter{

    static daysConvert(days: number, timeUnit: TimeUnit): number{

        const unit = mathjs.unit(days, 'day');
        let finalUnit: string = '';

        switch (timeUnit) {
            case TimeUnit.HOUR:
                finalUnit = 'hour';
                break;
            case TimeUnit.MINUTE:
                finalUnit = 'minute';
                break;
            case TimeUnit.SECOND:
                finalUnit = 'second';
                break;
        
            default:
                return days;
                break;
        }

        return unit.toNumber(finalUnit);
    }

    static hoursConvert(hours: number, timeUnit: TimeUnit): number{

        const unit = mathjs.unit(hours, 'hour');
        let finalUnit: string = '';

        if(timeUnit > TimeUnit.HOUR){
            throw new Error('Cannot convert to upper class of unit');
        }

        switch (timeUnit) {
            case TimeUnit.MINUTE:
                finalUnit = 'minute';
                break;
            case TimeUnit.SECOND:
                finalUnit = 'second';
                break;
            default:
                return hours;
                break;
        }

        return unit.toNumber(finalUnit);
    }

    static minutesConvert(minutes: number, timeUnit: TimeUnit): number{

        const unit = mathjs.unit(minutes, 'minute');
        let finalUnit: string = '';

        if(timeUnit > TimeUnit.HOUR){
            throw new Error('Cannot convert to upper class of unit');
        }

        switch (timeUnit) {
            case TimeUnit.MINUTE:
                finalUnit = 'minute';
                break;
            case TimeUnit.SECOND:
                finalUnit = 'second';
                break;
            default:
                return minutes;
                break;
        }

        return unit.toNumber(finalUnit);
    }

    static configReturn(configUnit:string, timeUnit: TimeUnit){

        let unitName: string = '';
        let unitAmount: number = parseInt(configUnit);

        if(configUnit.search('d') > -1){
            unitName = 'day';
        }
        else if(configUnit.search('h') > -1){
            unitName = 'hour';
        }
        else if(configUnit.search('m') > -1){
            unitName = 'minute';
        }
        else if(configUnit.search('s') > -1){
            unitName = 'second';
        }

        let unit = mathjs.unit(unitAmount, unitName);

        let finalUnit: string = '';

        switch (timeUnit) {
            case TimeUnit.DAY:
                finalUnit = 'day';
                break;
            case TimeUnit.HOUR:
                finalUnit = 'hour';
                break;
            case TimeUnit.MINUTE:
                finalUnit = 'minute';
                break;
            case TimeUnit.SECOND:
                finalUnit = 'second';
                break;
        }

        return unit.toNumber(finalUnit);
    }
}