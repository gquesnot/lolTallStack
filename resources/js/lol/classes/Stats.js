import {Damage} from "./Damage";

export class Stats{
    ad = 0;
    ap = 0
    as = 1
    ms= 0
    crit = 0
    armorPen = 0
    armorPenPercent = 0
    armorPenBonusPercent = 0
    magicPen = 0
    magicPenPercent = 0
    magicPenBonusPercent = 0
    hp = 0
    armor = 0
    dpsAd = 0
    dpsAp = 0
    dpsTrueDamage = 0
    dps = 0
    realArmor = 0
    realMr = 0
    critDps = 0
    adTakenPercent = 0
    apTakenPercent = 0
    adReceive = 0
    apReceive = 0
    trueDamageReceive = 0
    mr = 0
    ah = 0
    cdr = 0
    baseAs = 0
    adaptative= new Damage()
    onHitAd = 0
    onHitAp = 0
    onHitTrueDamage= 0
    constructor() {
    }

    static copy(stat) {
        let stats = new Stats();
        let data = JSON.parse(JSON.stringify(stat))
        stats.ad = data.ad
        stats.ap = data.ap
        stats.as = data.as
        stats.realArmor = data.realArmor
        stats.realMr = data.realMr
        stats.crit = data.crit
        stats.armorPen = data.armorPen
        stats.armorPenPercent = data.armorPenPercent
        stats.armorPenBonusPercent = data.armorPenBonusPercent
        stats.magicPen = data.magicPen
        stats.magicPenPercent = data.magicPenPercent
        stats.magicPenBonusPercent = data.magicPenBonusPercent
        stats.hp = data.hp
        stats.armor = data.armor
        stats.mr = data.mr
        stats.dps = data.dps
        stats.adTakenPercent = data.adTakenPercent
        stats.apTakenPercent = data.apTakenPercent
        stats.adReceive = data.adReceive
        stats.critDps = data.critDps
        return stats
    }

    static fromLolFrameStats(lolFrameStats) {
        let newStats = new Stats();
        newStats.ap = lolFrameStats.abilityPower
        newStats.armor = lolFrameStats.armor
        newStats.mr = lolFrameStats.magicResist
        newStats.armorPen = lolFrameStats.armorPen
        newStats.armorPenPercent = lolFrameStats.armorPenPercent
        newStats.ad = lolFrameStats.attackDamage
        newStats.as = lolFrameStats.attackSpeed / 100
        newStats.armorPenBonusPercent = lolFrameStats.bonusArmorPenPercent
        newStats.magicPenBonusPercent = lolFrameStats.bonusMagicPenPercent
        newStats.cdr = lolFrameStats.cooldownReduction
        newStats.hp = lolFrameStats.healthMax
        newStats.magicPen = lolFrameStats.magicPen
        newStats.magicPenPercent = lolFrameStats.magicPenPercent
        newStats.ms = lolFrameStats.movementSpeed
        return newStats
    }
}
