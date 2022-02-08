import {Damage} from "./Damage";

export class DamageDealt{
    onHit=  new Damage();
    dps =  new Damage();
    dpsTotal  = new Damage();

    reset(){
        this.onHit = new Damage();
        this.dps = new Damage();
        this.dpsTotal = new Damage();


    }

}
