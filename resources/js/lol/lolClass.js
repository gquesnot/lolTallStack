import {itemsCategory} from "./datas/itemsCategory";
import {ItemList} from "./classes/ItemsList";
import {PopOverHandler} from './classes/pop_over_handler';
import {Participant} from "./classes/Participant";
import {Stats} from "./classes/Stats";
import {round} from "./util/util";

const v8 = require('v8');

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
    maxFrame: 0,
    frameId: 0,
    participantId: 0,
    participant: null,
    enemyParticipants: [],
    participantFrame: null,
    enemyParticipantFrames: [],
    openModal: false,
    toggleChangeItems: false,
    items: [],
    modItems: [],


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
        }
    },


    fillTimelineInParticipants(matchTimelines) {
        let participants = [];
        for (let i in this.participants) {
            let idx = parseInt(i) + 1
            let participant = new Participant(this.participants[i])
            participant.fillFrames(matchTimelines)
            participants.push(participant)
        }
        this.participants = participants
    },

    async loadMatch() {

        let allInfo = await (await fetch(`summoner/${this.summonerName}/${this.matchId}`)).json()

        this.match = allInfo.match
        this.participants = allInfo.summoners
        this.fillTimelineInParticipants(allInfo.matchTimeline)
        this.maxFrame = allInfo.maxFrame
        this.frameId = this.maxFrame < this.frameId ? this.maxFrame : this.frameId
        for (let idx in this.participants) {
            let participant = this.participants[idx]
            if (this.summonerName.toLowerCase().trim() === participant.name.toLowerCase().trim()) {
                this.summonerName = this.participantName = participant.name

            }
        }
        this.selectParticipant(-1)

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
            this.participantFrame = this.participant.frames[this.frameId]


            this.updateDatas()
        }
    },


    selectParticipant(participantId = 0) {
        participantId = parseInt(participantId)
        this.participant = participantId === -1 ? this.participants.find(participant => participant.name.toLowerCase() === this.summonerName.toLowerCase()) : this.participants.find(participant => participant.id === participantId)
        this.participantId = this.participant.id
        this.participantFrame = this.participant.frames[this.frameId]
        this.enemyParticipants = this.getEnemyParticipants()
        this.calcAllStats()
    },


    updateDatas() {
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
        console.log('participant', this.participant)
        console.log('participantFrame', this.participantFrame)
        console.log('enemyParticipantFrame', this.enemyParticipants)
    },


    // items calculation

    calcEnemyParticipantsDamageReceive() {
        //console.log(this.enemyParticipantsFrame)
        this.enemyParticipantFrames = [];
        for (let participant of this.enemyParticipants) {
            let enemyParticipantFrame = participant.frames[this.frameId]
            if (enemyParticipantFrame.stats !== undefined) {
                let enemyRealAmor = ((enemyParticipantFrame.stats.stats.armor * (1 - this.participantFrame.stats.stats.armorPenPercent)) * (1 - this.participantFrame.stats.stats.armorPenBonusPercent)) - this.participantFrame.stats.stats.armorPen
                let enemyRealMr = ((enemyParticipantFrame.stats.stats.mr * (1 - this.participantFrame.stats.stats.magicPenPercent)) * (1 - this.participantFrame.stats.stats.magicPenBonusPercent)) - this.participantFrame.stats.stats.magicPen
                console.log('enemyRealAmor', enemyParticipantFrame.stats.stats.armor, this.participantFrame.stats.stats.armorPenPercent,  enemyRealAmor)
                console.log('enemyRealMr', enemyParticipantFrame.stats.stats.mr, this.participantFrame.stats.stats.magicPenPercent,  enemyRealMr)
                enemyRealMr = enemyRealMr < 0 ? 0 : enemyRealMr
                enemyRealAmor = enemyRealAmor < 0 ? 0 : enemyRealAmor
                enemyParticipantFrame.stats.damageTaken.realArmor = round(enemyRealAmor)
                enemyParticipantFrame.stats.damageTaken.realMr = round(enemyRealMr)
                enemyParticipantFrame.stats.damageTaken.armorReduction = round(100 / (enemyRealAmor + 100), 2)
                enemyParticipantFrame.stats.damageTaken.mrReduction = round(100 / (enemyRealMr + 100), 2)
                let dpsAd = this.participantFrame.stats.damageDealt.dps.ad
                // brk
                if (this.participant.items.includes(3153)) {
                    // Basic attacks deal (Melee  12% / Ranged 8%) of the target's current health bonus physical damage on-hit, with a minimum of 15 against all unit
                    let damage = this.participantIsRange() ? (enemyParticipantFrame.stats.stats.hp * 0.08) : (enemyParticipantFrame.stats.stats.hp * 0.12)
                    damage = damage < 15 ? 15 : damage
                    dpsAd += this.participant.items.includes(3124) ? (damage * 0.3) : damage
                }
                // dominik
                if (this.participant.items.includes(3036)) {
                    // Deal 0% − 15% (based on maximum health difference) bonus physical damage against enemy champions.
                    let hpDiff = enemyParticipantFrame.stats.stats.hp - this.participantFrame.stats.stats.hp
                    hpDiff = hpDiff < 0 ? 0 : hpDiff > 2000 ? 2000 : hpDiff
                    let dpsPercent = 1 + (hpDiff <= 0 ? 0 : (hpDiff * 0.0075 / 100) / 100)
                    dpsAd *= dpsPercent
                }
                enemyParticipantFrame.stats.damageTaken.dps.ad = Math.round(dpsAd * enemyParticipantFrame.stats.damageTaken.armorReduction)
                enemyParticipantFrame.stats.damageTaken.dps.ap= Math.round(this.participantFrame.stats.damageDealt.dps.ap * enemyParticipantFrame.stats.damageTaken.mrReduction)
                enemyParticipantFrame.stats.damageTaken.dps.true = Math.round(this.participantFrame.stats.damageDealt.dps.true)
            }

            participant.frames[this.frameId] = enemyParticipantFrame
            this.enemyParticipantFrames.push(enemyParticipantFrame)
        }
    },
    addItemsToStats(isItemUpdate) {
        console.log(this.participantFrame)
        let mythicItem = null;
        let countLegendary = 0
        this.participantFrame.stats.stats = Stats.copy(this.participantFrame.stats.baseStats)
        for (let itemId of this.participant.items) {
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
                            this.participantFrame.stats.stats.ap += value
                            break;
                        case 'MoveSpeed':
                            this.participantFrame.stats.stats.ms += value
                            break;
                        case 'AttackSpeed':
                            this.participantFrame.stats.stats.as += value
                            break;
                        case 'AttackDamage':
                            this.participantFrame.stats.stats.ad += value
                            break;
                        case 'MagicResist':
                            this.participantFrame.stats.stats.mr += value
                            break;
                        case 'Health':
                            this.participantFrame.stats.stats.hp += value
                            break;
                        case 'Armor':
                            this.participantFrame.stats.stats.armor += value
                            break;
                        case 'CriticalStrikeChance':
                            this.participantFrame.stats.stats.crit += value
                            break;
                        case 'ArmorPenetration':
                            this.participantFrame.stats.stats.armorPenPercent += value
                            break;
                        case 'Lethality':
                            this.participantFrame.stats.stats.armorPen += value * (0.6 + 0.4 * this.participantFrame.stats.apiStats.level / 18)
                            break;
                        case 'MagicPenetration':
                            if (parseInt(value) !== value) {
                                this.participantFrame.stats.stats.magicPenPercent += value
                            } else {
                                this.participantFrame.stats.stats.magicPen += value
                            }
                            break;

                        case 'AbilityHaste':
                            this.participantFrame.stats.stats.ah += value
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
                    this.participantFrame.stats.stats.armorPen += stat * countLegendary * (0.6 + 0.4 * this.participantFrame.stats.apiStats.level / 18)
                } else {
                    this.participantFrame.stats.stats[statName] += stat * countLegendary
                }
            }
        }

        // calc onHit
        //nashor
        if (this.participant.items.includes(3115)) {
            this.participantFrame.stats.damageDealt.onHit.ap += 15 + this.participantFrame.stats.stats.ap * 0.2
        }
        //whit's end
        if (this.participant.items.includes(3091)) {
            this.participantFrame.stats.damageDealt.onHit.ap += 15
            // 9 -> 14 = +10  & 15 -> 18 = 1.25
            if (this.participantFrame.stats.stats.apiStats.level >= 9) {

                this.participantFrame.stats.damageDealt.onHit.ap += 10 * ((this.participantFrame.stats.apiStats.level >= 15 ? 14 : this.participantFrame.stats.apiStats.level) - 8)
            }
            if (this.participantFrame.stats.stats.apiStats.level >= 15) {
                this.participantFrame.stats.damageDealt.onHit.ap += 1.25 * (this.participantFrame.stats.apiStats.level - 14)
            }
        }
        // titanic  round between range and melee
        if (this.participant.items.includes(3748)) {
            // 3.5 + 1.3% of max health
            this.participantFrame.stats.damageDealt.onHit.ad += 3.5 + this.participantFrame.stats.stats.hp * 0.013
        }

        //recurve bow
        console.log(this.participant.items, this.participant.items.includes(1043))
        if (this.participant.items.includes(1043)) {
            this.participantFrame.stats.damageDealt.onHit.ad += 15
        }
        //rage knife
        if (this.participant.items.includes(6677)) {
            this.participantFrame.stats.damageDealt.onHit.ad += this.participantFrame.stats.stats.crit * 1.75
            this.participantFrame.stats.stats.crit = 0
        }



        //trinity force maxed
        if (this.participant.items.includes(3078)) {
            this.participantFrame.stats.stats.ad += this.participantFrame.baseStats.ad * 0.2
        }


        /*//runaan huricane
        if (this.participant.items.includes(3085)) {
            this.participantFrame.stats.onHitAd += this.participantFrame.baseStats.ad * 0.2
        }*/

        //kraken
        if (this.participant.items.includes(6672)) {
            this.participantFrame.stats.damageDealt.onHit.true += 0.3 * (60 + 0.45 * this.participantFrame.stats.baseStats.ad)
        }




        /*//manamune -> need to calculate mana
        if (this.participant.items.contains('3004')) {
            this.participantFrame.stats.onHitAd += this.participantFrame.stats.mana * 0.015
        }*/

        //proc onHit


        //calc as
        this.participantFrame.stats.stats.as = this.participantFrame.stats.stats.as * this.participantFrame.stats.baseStats.baseAs
        if (this.participantFrame.stats.stats.as > 2.5) {
            this.participantFrame.stats.stats.as = 2.5
        }
        //calc cdr
        if (this.participantFrame.stats.stats.ah !== 0) {
            this.participantFrame.stats.stats.cdr = 1 - (100 / (100 + this.participantFrame.stats.stats.ah))
        }

        //calc adaptative
        if (this.participantFrame.stats.stats.adaptative !== undefined) {
            //add adataptive stat depend if participant has more ap or ad
            if (this.participantFrame.stats.stats.ap > this.participantFrame.stats.stats.ad) {
                this.participantFrame.stats.stats.ad += this.participantFrame.stats.stats.adaptative.ad
            } else {
                this.participantFrame.stats.stats.ap += this.participantFrame.stats.stats.adaptative.ap
            }
        }

    },
    rebuildItems() {

        this.warningViego = false
        this.participant.items = []
        let itemList = new ItemList(this.items)
        for (let i = 0; i <= this.frameId; i++) {
            let frame = this.participant.frames[i]
            for (let idx in frame.events) {
                let eventObj = frame.events[idx]

                if (eventObj.type === 'ITEM') {
                    console.log(eventObj.events)
                    itemList.addEvents(eventObj.events)
                }
            }
        }
        console.log('itemList', itemList)
        this.participant.items = itemList.items

    },
    getParticipantFrame(id=-1){
        console.log(this.participant)
        return id === -1 ? this.participant.frames[this.frameId] : this.participants[id].frames[this.frameId]

    },
    calcGold(isItemUpdate) {
        this.totalGold = this.participantFrame.stats.apiStats.totalGold
        if (!this.toggleChangeItems && !isItemUpdate) {
            this.currentGold = this.participantFrame.stats.apiStats.currentGold
        } else {
            this.currentGold = this.totalGold
            for (let itemId of this.participant.items) {
                let item = this.items[itemId]
                this.currentGold -= item.gold
            }
        }

    },

    // other calculation
    calcDps(isItemUpdate) {
        this.addItemsToStats(isItemUpdate)
        let hasIe = this.participant.items.includes(3031) && this.participantFrame.stats.stats.crit > 0.6
        let hasGuinsoo = this.participant.items.includes(3124)

        this.participantFrame.stats.damageDealt.dps.ad = this.participantFrame.stats.stats.ad * this.participantFrame.stats.stats.as

        if (this.participantFrame.stats.stats.crit > 0) {
            let oldDps = this.participantFrame.stats.damageDealt.dps.ad
            if (!hasGuinsoo) {
                let critDamage = 0.75 + (hasIe ? 0.35 : 0)
                this.participantFrame.stats.damageDealt.dps.ad *= 1 + (this.participantFrame.stats.stats.crit * critDamage)
            } else if (hasGuinsoo) {

                let crit = this.participantFrame.stats.stats.crit > 1 ? 1 : this.participantFrame.stats.stats.crit
                let guinsooDamage= (crit * 2 * 100 * this.participantFrame.stats.stats.as)
                this.participantFrame.stats.damageDealt.onHit.ad += guinsooDamage
                console.log(crit, this.participantFrame.stats.damageDealt.dps.ad)
            }
            this.participantFrame.stats.damageDealt.dps.crit = this.participantFrame.stats.damageDealt.dps.ad - oldDps
        }
        this.participantFrame.stats.damageDealt.dps.ad += this.participantFrame.stats.damageDealt.onHit.ad * this.participantFrame.stats.stats.as * (1 + hasGuinsoo * 0.3)
        this.participantFrame.stats.damageDealt.dps.ap += this.participantFrame.stats.damageDealt.onHit.ap * this.participantFrame.stats.stats.as * (1 + hasGuinsoo * 0.3)
        this.participantFrame.stats.damageDealt.dps.true += this.participantFrame.stats.damageDealt.onHit.true * this.participantFrame.stats.stats.as
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
        this.participant.items.splice(idx, 1)
        this.calcAllStats(true)
    },
    addItem(idx) {
        if (this.participant.items.length < 6) {
            this.participant.items.push(idx)
            this.calcAllStats(true)
        }
    },
    resetItems() {
        this.participant.items = [];
        this.calcAllStats(true)
    },


    // util function
    participantIsRange() {
        return this.participantFrame.stats.stats.range > 250

    },
    getParticipantId() {

        return this.participants.findIndex((item) => {
            return item.name === this.participantName
        })
    },

    getEnemyParticipants() {
        return this.participants.filter((item) => {
            return item.teamId !== this.participant.teamId
        })
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
