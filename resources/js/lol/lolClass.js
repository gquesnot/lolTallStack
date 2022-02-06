import {itemsCategory, itemsOnHit} from "./itemsCategory";
import {ItemList} from "./ItemsList";
import PopOverHandler from './classes/pop_over_handler';
import Pop_hover_handler from "./classes/pop_over_handler";

const v8 = require('v8');

class Stats {
    ad = 0
    ap = 0
    as = 1
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
    adaptative
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


export default () => ({
    itemsCategory: [],

    summonerName: 'random Iron',
    matchs: [],
    matchId: '',
    version: '12.2.1',
    category: 0,
    totalGold: 0,
    currentGold: 0,

    match: null,
    participants: [],
    maxFrame: null,
    frameId: 0,
    participantName: null,
    participantFrame: null,
    enemyParticipantsFrame: null,
    openModal: false,
    toggleChangeItems: false,
    perks: {
        5002: {
            key: 'armor',
            value: 6
        },
        5008: {
            key: 'adaptative',
            value: {
                ad: 5.4,
                ap: 9
            }
        },
        5001: {
            key: 'health',
            value: {
                base: 7.7,
                perLevel: 7.35
            }
        },
        5007: {
            key: 'ah',
            value: 8
        },
        5005: {
            key: 'as',
            value: 0.1
        },
        5003: {
            key: 'mr',
            value: 8
        }
    },
    items: [],
    modItems: [],
    myItemList: [],


    popover: null,


    // init
    async init() {

        this.itemsCategory = itemsCategory
        await this.loadItems();

        await this.setSummonerName();

    },

    afterInit() {

        this.popover = new PopOverHandler();
        this.popover.init(this.items, this.version);


    },

    //loading
    async setSummonerName() {

        let datas = await (await fetch(`summoner/${this.summonerName}`)).json()
        this.matchs = datas.matchIds
        if (this.matchs) {
            this.matchId = this.matchs[0]
            await this.loadMatch()
            this.selectParticipant()
        }
    },


    fillTimelineInParticipants(matchTimelines) {
        let newMatchTimeline = [];
        let newParticipants = [];
        console.log(this.participants, matchTimelines.frames[0].participantFrames)
        for (let i in this.participants) {
            let idx = parseInt(i) + 1
            console.log(i, idx)
            let participant = this.participants[i]

            this.participants[i].stats = new Stats();
            console.log('participant', participant)
            let frames = [];
            for (let matchTimeline of matchTimelines.frames) {
                let tmp = {}
                tmp.lolStats = matchTimeline.participantFrames[idx]

                tmp.baseStats = this.calcStatsByLevel(this.participants[i].champion, matchTimeline.participantFrames[idx].level, participant.perks.statPerks)
                tmp.stats = tmp.baseStats//new Stats();
                tmp.events = matchTimeline.events.filter(function (event) {
                    if (event['participantId'] !== undefined) {
                        return event['participantId'] === idx;
                    } else if (event['killerId'] !== undefined) {
                        if (event['killerId'] === idx) {
                            return true;
                        }
                    } else if (event['victimId'] !== undefined) {
                        if (event['victimId'] === idx) {
                            return true;
                        }
                    }
                    return false
                })
                let tmpEvents = {}

                for (let event of tmp.events) {
                    let timestampString = event.timestamp.toString()
                    if (!tmpEvents.hasOwnProperty(timestampString)) {
                        tmpEvents[timestampString] = {
                            type: event.type.includes('ITEM') ? 'ITEM' : 'OTHER',
                            events: []
                        };
                    }
                    tmpEvents[timestampString].events.push(event)
                }
                tmp.events = tmpEvents

                frames.push(tmp)
            }

            this.participants[i].frames = frames;
        }
    },

    async loadMatch() {

        let allInfo = await (await fetch(`summoner/${this.summonerName}/${this.matchId}`)).json()

        this.match = allInfo.match
        this.participants = allInfo.summoners
        this.fillTimelineInParticipants(allInfo.matchTimeline)
        this.maxFrame = allInfo.maxFrame
        for (let idx in this.participants) {
            let participant = this.participants[idx]
            if (this.summonerName.toLowerCase().trim() === participant.summonerName.toLowerCase().trim()) {
                this.summonerName = this.participantName = participant.summonerName

            }
        }
        this.selectParticipant()

    },

    async loadItems() {
        let datas = await (await fetch('get_items')).json()
        this.items = this.modItems = datas.items
        this.version = datas.version
    },


    // update datas
    selectFrame(newValue = null) {

        if (newValue) {
            this.frameId = newValue.target.value;


            this.updateDatas()
        }
    },


    selectParticipant() {
        if (this.participantName === null) {
            this.participantName = this.participants[0].summonerName
        }
        let participantId = this.getParticipantId()
        this.participantFrame = this.participants[participantId].frames[this.frameId]
        this.enemyParticipantsFrame = this.getParticipantNotInTeam(this.participants[participantId].teamId)
        //this.updateEnemyParticipants()
        this.calcAllStats()
    },


    updateDatas() {
        this.participantFrame = this.participants[this.getParticipantId()].frames[this.frameId]
        this.updateEnemyParticipants()
        this.calcAllStats()
    },


    //computing after update
    calcAllStats(isItemUpdate = false) {

        if (! this.toggleChangeItems && !isItemUpdate) {
            this.rebuildItems()

        }
        this.calcGold(isItemUpdate)
        this.calcDps(isItemUpdate)
        this.calcEnemyParticipantsDamageReceive()
        console.log('participantFrame', this.participantFrame)
        console.log('enemyParticipantFrame', this.enemyParticipantsFrame)
        console.log('items', this.myItemList)
    },
    updateEnemyParticipants() {

        for (let idx in this.enemyParticipantsFrame) {
            let i = idx + 1
            let participant = this.enemyParticipantsFrame[idx];
            let summonerName = participant.summonerName;
            let championName = participant.championName;
            let id = participant.id;
            participant = this.participants[id].frames[this.frameId];
            participant.summonerName = summonerName
            participant.championName = championName
            participant.id = id
            this.enemyParticipantsFrame[idx] = participant;
        }
    },


    // items calculation

    calcEnemyParticipantsDamageReceive() {
        //console.log(this.enemyParticipantsFrame)
        for (let enemyParticipantFrame of this.enemyParticipantsFrame) {
            enemyParticipantFrame.stats = Stats.fromLolFrameStats(enemyParticipantFrame.lolStats.championStats)
            if (enemyParticipantFrame.stats !== undefined) {
                let enemyRealAmor = ((enemyParticipantFrame.stats.armor * (1 - this.participantFrame.stats.armorPenPercent)) * (1 - this.participantFrame.stats.armorPenBonusPercent)) - this.participantFrame.stats.armorPen
                let enemyRealMr = ((enemyParticipantFrame.stats.mr * (1 - this.participantFrame.stats.magicPenPercent)) * (1 - this.participantFrame.stats.magicPenBonusPercent)) - this.participantFrame.stats.magicPen
                /*console.log('enemyRealAmor', enemyParticipantFrame.stats.armor,  enemyRealAmor)
                console.log('enemyRealMr', enemyParticipantFrame.stats.mr,  enemyRealMr)*/
                enemyRealMr = enemyRealMr < 0 ? 0 : enemyRealMr
                enemyRealAmor = enemyRealAmor < 0 ? 0 : enemyRealAmor
                enemyParticipantFrame.stats.realArmor = this.round(enemyRealAmor)
                enemyParticipantFrame.stats.realMr = this.round(enemyRealMr)
                enemyParticipantFrame.stats.physicalDamageReductionPercent = this.round(100 / (enemyRealAmor + 100), 2)
                enemyParticipantFrame.stats.magicalDamageReductionPercent = this.round(100 / (enemyRealMr + 100), 2)
                let dpsAd = this.participantFrame.stats.dpsAd
                // brk
                if (this.myItemList.includes(3153)) {
                    // Basic attacks deal (Melee  12% / Ranged 8%) of the target's current health bonus physical damage on-hit, with a minimum of 15 against all unit
                    let damage = this.participantIsRange() ? (enemyParticipantFrame.stats.hp * 0.08) : (enemyParticipantFrame.stats.hp * 0.12)
                    damage = damage < 15 ? 15 : damage
                    console.log(enemyParticipantFrame.championName, 'brk', damage)
                    dpsAd += this.myItemList.includes(3124) ? (damage * 0.3) : damage
                }
                // dominik
                if (this.myItemList.includes(3036)) {
                    // Deal 0% − 15% (based on maximum health difference) bonus physical damage against enemy champions.
                    let hpDiff = enemyParticipantFrame.stats.hp - this.participantFrame.stats.hp
                    hpDiff = hpDiff < 0 ? 0 : hpDiff > 2000 ? 2000 : hpDiff
                    let dpsPercent = 1 + (hpDiff <= 0 ? 0 : (hpDiff * 0.0075 / 100) / 100)
                    dpsAd *= dpsPercent
                }
                enemyParticipantFrame.stats.dpsAdReceive = Math.round(dpsAd * enemyParticipantFrame.stats.physicalDamageReductionPercent)
                enemyParticipantFrame.stats.dpsApReceive= Math.round(this.participantFrame.stats.dpsAp * enemyParticipantFrame.stats.magicalDamageReductionPercent)
                enemyParticipantFrame.stats.dpsTrueDamageReceive = Math.round(this.participantFrame.stats.dpsTrueDamage)
                enemyParticipantFrame.stats.dpsReceive=  enemyParticipantFrame.stats.dpsAdReceive + enemyParticipantFrame.stats.dpsApReceive + enemyParticipantFrame.stats.dpsTrueDamageReceive
            }


        }
    },
    addItemsToStats(isItemUpdate) {
        console.log(this.participantFrame)
        let mythicItem = null;
        let countLegendary = 0
        this.participantFrame.stats = Stats.copy(this.participantFrame.baseStats)
        for (let itemId of this.myItemList) {
            console.log('type', this.getItemType(itemId))
            let item = this.items[itemId.toString()]
            if (item.type === 'legendary') {
                countLegendary++
            } else if (item.type === 'mythic') {
                mythicItem = item;
            }


            if (item !== null) {
                for (let statName in item.stats_description) {
                    let value = item.stats_description[statName]
                    switch (statName) {
                        case 'AbilityPower':
                            this.participantFrame.stats.ap += value
                            break;
                        case 'MoveSpeed':
                            this.participantFrame.stats.ms += value
                            break;
                        case 'AttackSpeed':
                            this.participantFrame.stats.as += value
                            break;
                        case 'AttackDamage':
                            this.participantFrame.stats.ad += value
                            break;
                        case 'MagicResist':
                            this.participantFrame.stats.mr += value
                            break;
                        case 'Health':
                            this.participantFrame.stats.hp += value
                            break;
                        case 'Armor':
                            this.participantFrame.stats.armor += value
                            break;
                        case 'CriticalStrikeChance':
                            this.participantFrame.stats.crit += value
                            break;
                        case 'ArmorPenetration':
                            this.participantFrame.stats.armorPenPercent += value
                            break;
                        case 'Lethality':
                            this.participantFrame.stats.armorPen += value * (0.6 + 0.4 * this.participantFrame.lolStats.level / 18)
                            break;
                        case 'MagicPenetration':
                            if (parseInt(value) !== value) {
                                this.participantFrame.stats.magicPenPercent += value
                            } else {
                                this.participantFrame.stats.magicPen += value
                            }
                            break;

                        case 'AbilityHaste':
                            this.participantFrame.stats.ah += value
                            break;
                        default:
                            if (![
                                'PercentMovementSpeedMod',
                                'PercentLifeStealMod',
                                'Mythic'

                            ].includes(statName)) {
                                console.log("not found", statName, value,)

                            }
                    }
                }
            }
        }
        if (mythicItem !== null) {
            for (let statName in mythicItem.stats_description.Mythic) {
                let stat = mythicItem.stats_description.Mythic[statName]
                if (statName === 'lethality') {
                    this.participantFrame.stats.armorPen += stat * countLegendary * (0.6 + 0.4 * this.participantFrame.lolStats.level / 18)
                } else {
                    this.participantFrame.stats[statName] += stat * countLegendary
                }
            }
        }

        // calc onHit
        //nashor
        if (this.myItemList.includes(3115)) {
            this.participantFrame.stats.onHitAp += 15 + this.participantFrame.stats.ap * 0.2
        }
        //whit's end
        if (this.myItemList.includes(3091)) {
            this.participantFrame.stats.onHitAp += 15
            // 9 -> 14 = +10  & 15 -> 18 = 1.25
            if (this.participantFrame.lolStats.level >= 9) {

                this.participantFrame.stats.onHitAp += 10 * ((this.participantFrame.lolStats.level >= 15 ? 14 : this.participantFrame.lolStats.level) - 8)
            }
            if (this.participantFrame.lolStats.level >= 15) {
                this.participantFrame.stats.onHitAp += 1.25 * (this.participantFrame.lolStats.level - 14)
            }
        }
        // titanic  round between range and melee
        if (this.myItemList.includes(3748)) {
            // 3.5 + 1.3% of max health
            this.participantFrame.stats.onHitAd += 3.5 + this.participantFrame.stats.hp * 0.013
        }

        //recurve bow
        console.log(this.myItemList, this.myItemList.includes(1043))
        if (this.myItemList.includes(1043)) {
            this.participantFrame.stats.onHitAd += 15
        }
        //rage knife
        if (this.myItemList.includes(6677)) {
            this.participantFrame.stats.onHitAd += this.participantFrame.stats.crit * 1.75
            this.participantFrame.stats.crit = 0
        }



        //trinity force maxed
        if (this.myItemList.includes(3078)) {
            this.participantFrame.stats.ad += this.participantFrame.baseStats.ad * 0.2
        }


        /*//runaan huricane
        if (this.myItemList.includes(3085)) {
            this.participantFrame.stats.onHitAd += this.participantFrame.baseStats.ad * 0.2
        }*/

        //kraken
        if (this.myItemList.includes(6672)) {
            this.participantFrame.stats.onHitTrueDamage += 0.3 * (60 + 0.45 * this.participantFrame.baseStats.ad)
        }




        /*//manamune -> need to calculate mana
        if (this.myItemList.contains('3004')) {
            this.participantFrame.stats.onHitAd += this.participantFrame.stats.mana * 0.015
        }*/

        //proc onHit


        //calc as
        this.participantFrame.stats.as = this.participantFrame.stats.as * this.participantFrame.baseStats.baseAs
        if (this.participantFrame.stats.as > 2.5) {
            this.participantFrame.stats.as = 2.5
        }
        //calc cdr
        if (this.participantFrame.stats.ah !== 0) {
            this.participantFrame.stats.cdr = 1 - (100 / (100 + this.participantFrame.stats.ah))
        }

        //calc adaptative
        if (this.participantFrame.stats.adaptative !== undefined) {
            //add adataptive stat depend if participant has more ap or ad
            if (this.participantFrame.stats.ap > this.participantFrame.stats.ad) {
                this.participantFrame.stats.ad += this.participantFrame.stats.adaptative.ad
            } else {
                this.participantFrame.stats.ap += this.participantFrame.stats.adaptative.ap
            }
        }

    },
    rebuildItems() {
        let participant = this.participants[this.getParticipantId()]

        this.warningViego = false
        this.myItemList = []
        let itemList = new ItemList(this.items)
        for (let i = 0; i <= this.frameId; i++) {
            let frame = this.participants[this.getParticipantId()].frames[i]

            for (let idx in frame.events) {
                let eventObj = frame.events[idx]
                if (eventObj.type === 'ITEM') {
                    itemList.addEvents(eventObj.events)
                }
            }
        }
        this.myItemList = itemList.items
        console.log(this.participantFrame)

    },
    calcGold(isItemUpdate) {
        this.totalGold = this.participantFrame.lolStats.totalGold
        if (!this.toggleChangeItems && !isItemUpdate) {
            this.currentGold = this.participantFrame.lolStats.currentGold
        } else {
            this.currentGold = this.totalGold
            for (let itemId of this.myItemList) {
                let item = this.items[itemId]
                this.currentGold -= item.gold
            }
        }

    },

    // other calculation
    calcDps(isItemUpdate) {
        this.addItemsToStats(isItemUpdate)
        let hasIe = this.myItemList.includes(3031) && this.participantFrame.stats.crit > 0.6
        let hasGuinsoo = this.myItemList.includes(3124)

        this.participantFrame.stats.dpsAd = this.participantFrame.stats.ad * this.participantFrame.stats.as

        if (this.participantFrame.stats.crit > 0) {
            let dps = this.participantFrame.stats.dpsAd
            if (!hasGuinsoo) {
                let critDamage = 0.75 + (hasIe ? 0.35 : 0)
                this.participantFrame.stats.dpsAd *= 1 + (this.participantFrame.stats.crit * critDamage)
            } else if (hasGuinsoo) {

                let crit = this.participantFrame.stats.crit > 1 ? 1 : this.participantFrame.stats.crit
                this.participantFrame.stats.dpsAd += (crit * 2 * 100 * this.participantFrame.stats.as)
                console.log(crit, this.participantFrame.stats.dpsAd)
            }
            this.participantFrame.stats.critDps = this.participantFrame.stats.dpsAd - dps
        }
        this.participantFrame.stats.dpsAd += this.participantFrame.stats.onHitAd * this.participantFrame.stats.as * (1 + hasGuinsoo * 0.3)
        this.participantFrame.stats.dpsAp += this.participantFrame.stats.onHitAp * this.participantFrame.stats.as * (1 + hasGuinsoo * 0.3)
        this.participantFrame.stats.dpsTrueDamage += this.participantFrame.stats.onHitTrueDamage * this.participantFrame.stats.as
        this.participantFrame.stats.dps = this.participantFrame.stats.dpsAd + this.participantFrame.stats.dpsAp + this.participantFrame.stats.dpsTrueDamage
        console.log(this.participantFrame.stats)
    },
    calcStatsByLevel(champ, level, statPerks) {
        let champStats = champ.stats
        let stats = new Stats();

        console.log(champStats)
        stats.ad = this.applyLolGrowStatistic(champStats.attackdamage, champStats.attackdamageperlevel, level)
        stats.armor = this.applyLolGrowStatistic(champStats.armor, champStats.armorperlevel, level)

        stats.hp = this.applyLolGrowStatistic(champStats.hp, champStats.hpperlevel, level)
        stats.mr = this.applyLolGrowStatistic(champStats.spellblock, champStats.spellblockperlevel, level)
        stats.baseAs = champStats.attackspeed
        stats.as += this.applyLolGrowStatistic(0, champStats.attackspeedperlevel / 100, level)
        // apply perks to stats
        for (let perkName in statPerks) {
            let perkId = statPerks[perkName]
            let perkData = this.perks[perkId]
            if (perkData.key === 'adaptative') {
                if (stats.adaptative === undefined) {
                    stats.adaptative = perkData.value

                } else {
                    stats.adaptative.ap += perkData.value.ap
                    stats.adaptative.ad += perkData.value.ad
                }
            } else if (perkData.key === 'health') {
                stats.hp += perkData.value.base + perkData.value.perLevel * level
            } else if (perkData.key === 'as') {
                stats.as += perkData.value
            } else {
                stats[perkData.key] += perkData.value
            }

        }
        return stats
    },


    // ITEMS
    //category
    selectCategory(idx) {
        this.category = idx
        console.log(this.itemsCategory[this.category])
        this.modItems = [];
        for (let itemId in this.items) {
            let item = this.items[itemId]
            if (this.hasTagInCategory(item.tags) || this.category === 0) {
                this.modItems.push(item)
            }
        }
    },
    hasTagInCategory(tags) {
        let tagSplited = tags.split(';');
        for (let tag of tagSplited) {
            if (this.itemsCategory[this.category].tags.includes(tag)) {
                return true;
            }
        }
        return false;
    },


    // items actions
    removeItem(idx) {
        this.myItemList.splice(idx, 1)
        this.calcAllStats(true)
    },
    addItem(idx) {
        if (this.myItemList.length < 6) {
            this.myItemList.push(idx)
            this.calcAllStats(true)
        }
    },
    resetItems() {
        this.myItemList = [];
        this.calcAllStats(true)
    },


    // util function
    participantIsRange() {
        return this.participantFrame.stats.range > 250

    },
    getParticipantId() {

        return this.participants.findIndex((item) => {
            return item.summonerName === this.participantName
        })
    },

    getParticipantNotInTeam(teamId) {
        let enemyParticipantsFrame = [];
        for (let participantId in this.participants) {
            if (this.participants[participantId].teamId !== teamId) {

                let participantFrame = this.participants[participantId].frames[this.frameId]
                participantFrame.summonerName = this.participants[participantId].summonerName
                participantFrame.championName = this.participants[participantId].championName
                participantFrame.id = participantId
                enemyParticipantsFrame.push(participantFrame)
            }

        }
        return enemyParticipantsFrame;
    },
    applyLolGrowStatistic(base, grow, level) {
        level--
        return base + grow * level * (0.7025 + 0.0175 * level)
    },

    convertProxy($datas) {
        return JSON.parse(JSON.stringify($datas))
    },
    round(value, decimal = 0) {

        return decimal === 0 ? Math.round(value) : Math.round(value * 10 * decimal) / (10 * decimal)
    },
    getItemType(id) {
        return this.items[id.toString()].type
    },

})
