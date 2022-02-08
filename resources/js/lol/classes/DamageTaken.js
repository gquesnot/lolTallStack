import {Damage} from "./Damage";

export class DamageTaken {
    dps = new Damage();
    onHitDps  = new Damage();
    //reducedDamage = new Damage();
    armorReduction = 0
    mrReduction = 0
    realArmor = 0
    realMr= 0

    reset(){
        this.dps = new Damage();
        this.onHitDps = new Damage();
        this.armorReduction = 0;
        this.mrReduction = 0;
        this.realArmor = 0;
        this.realMr = 0;
    }

}
