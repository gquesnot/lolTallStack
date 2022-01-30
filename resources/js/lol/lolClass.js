import {itemsCategory} from "./itemsCategory";
import {ItemList} from "./ItemsList";

const v8 = require('v8');

class Stats {
    ad = 0
    ap = 0
    as = 0
    crit = 0
    armorPen = 0
    armorPenPercent = 0
    armorPenBonusPercent = 0
    magicPen = 0
    magicPenPercent = 0
    magicPenBonusPercent = 0
    hp = 0
    armor = 0
    dps = 0
    realArmor = 0
    realMr = 0
    critDps = 0
    adTakenPercent = 0
    apTakenPercent = 0
    adReceive = 0
    mr = 0
    ah= 0
    cdr = 0

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
    toggleChangeItems: true,

    items: [],
    modItems: [],
    myItemList: [],

    // TODO : FIX AS by lvl
    async init() {
        this.itemsCategory = itemsCategory
        await this.loadItems();
        await this.setSummonerName();

    },


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

        for (let i in this.participants) {
            let idx = parseInt(i) + 1

            let participant = this.participants[idx]

            this.participants[i].stats = new Stats();
            let frames = [];
            for (let matchTimeline of matchTimelines.frames) {
                let tmp = {}
                tmp.lolStats = matchTimeline.participantFrames[idx]
                tmp.baseStats = this.calcStatsByLevel(this.participants[i].champion, matchTimeline.participantFrames[idx].level)
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


    selectFrame(newValue = null) {

        if (newValue) {
            this.frameId = newValue.target.value;


            this.updateDatas()
        }
    },
    updateDatas() {
        this.participantFrame = this.participants[this.getParticipantId()].frames[this.frameId]
        this.updateEnemyParticipants()
        this.calcAllStats()
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


    calcAllStats(isItemUpdate = false) {

        if (this.toggleChangeItems && !isItemUpdate) {
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


    },

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

                enemyParticipantFrame.stats.physicalDamageTaken = Math.round(this.participantFrame.stats.dps * enemyParticipantFrame.stats.physicalDamageReductionPercent)
            }


        }
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


    convertProxy($datas) {
        return JSON.parse(JSON.stringify($datas))
    },

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
        console.log(this.modItems)
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
    round(value, decimal = 0) {

        return decimal === 0 ? Math.round(value) : Math.round(value * 10 * decimal) / (10 * decimal)
    },
    addItemsToStats(isItemUpdate) {
        this.participantFrame.stats = Stats.copy(this.participantFrame.baseStats)
        for (let itemId of this.myItemList) {
            let item = this.items[itemId.toString()]
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
                            this.participantFrame.stats.as *= 1 + value
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

                            ].includes(statName)) {
                                console.log("not found", statName, value,)

                            }
                    }
                }
            }
        }
        if (this.participantFrame.stats.ah !== 0){
            this.participantFrame.stats.cdr = 1 -(100 / (100 + this.participantFrame.stats.ah))
        }
        if (this.participantFrame.stats.as > 2.5){
            this.participantFrame.stats.as = 2.5
        }

    },
    calcDps(isItemUpdate) {
        this.addItemsToStats(isItemUpdate)
        let hasIe = this.myItemList.includes(3031) && this.participantFrame.stats.crit > 0.6
        let hasGuinsoo = this.myItemList.includes(3124)

        this.participantFrame.stats.dps = this.participantFrame.stats.ad * this.participantFrame.stats.as

        if (this.participantFrame.stats.crit > 0) {
            let dps = this.participantFrame.stats.dps
            if (!hasGuinsoo) {
                console.log(hasIe, this.participantFrame.stats.crit)
                let critDamage = 0.75 + (hasIe ? 0.35 : 0)
                this.participantFrame.stats.dps *= 1 + (this.participantFrame.stats.crit * critDamage)
            } else if (hasGuinsoo) {

                let crit = this.participantFrame.stats.crit > 1 ? 1 : this.participantFrame.stats.crit
                this.participantFrame.stats.dps += (crit * 2 * 100 * this.participantFrame.stats.as)
                console.log(crit, this.participantFrame.stats.dps)
            }
            this.participantFrame.stats.critDps = this.participantFrame.stats.dps - dps
        }
    },
    calcStatsByLevel(champ, level) {
        let champStats = champ.stats
        let stats = new Stats();
        stats.ad = champStats.attackdamage + level * champStats.attackdamageperlevel
        stats.armor = champStats.armor + level * champStats.armorperlevel
        stats.mr = champStats.spellblock + level * champStats.spellblockperlevel
        stats.as = champStats.attackspeed + level * (champStats.attackspeedperlevel / 100)
        stats.hp = champStats.hp + level * champStats.hpperlevel
        return stats
    },
    calcGold(isItemUpdate) {
        this.totalGold = this.participantFrame.lolStats.totalGold
        if (this.toggleChangeItems && !isItemUpdate) {
            this.currentGold = this.participantFrame.lolStats.currentGold
        } else {
            this.currentGold = this.totalGold
            for (let itemId of this.myItemList) {
                let item = this.items[itemId]
                this.currentGold -= item.gold
            }
        }

    }


})
