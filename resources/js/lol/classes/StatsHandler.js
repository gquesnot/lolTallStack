import {Stats} from "./Stats";
import {DamageDealt} from "./DamageDealt";
import {DamageTaken} from "./DamageTaken";

export class StatsHandler{
    stats = new Stats();
    baseStats = new Stats();
    apiStats  = null;
    damageDealt = new DamageDealt();
    damageTaken = new DamageTaken();

    constructor(baseStats, apiStats){
        this.baseStats = baseStats;
        this.apiStats = apiStats;
        this.stats = this.baseStats;
    }

}
