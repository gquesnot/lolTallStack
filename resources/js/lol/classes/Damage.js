export class Damage{
    ap= 0;
    ad = 0;
    true= 0;
    crit = 0;


        total(withoutCrit =false){
        return this.ap + this.ad + this.true + (!withoutCrit ? this.crit : 0);
    }
}
