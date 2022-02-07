import {StatsHandler} from "./StatsHandler";
import {Frame} from "./Frame";
import {Stats} from "./Stats";
import {applyLolGrowStatistic} from "../util/util";
import {perkList} from "../datas/perks";

export class Participant {
    frames = [];
    id;
    name;
    items = [];
    champion;
    perks;
    teamId;


    constructor(participant) {
        this.id = participant.participantId;
        this.name = participant.summonerName;
        this.champion = participant.champion;
        this.perks = participant.perks
        this.teamId = participant.teamId;
    }


    fillFrames(matchTimeLine) {
        for (let i = 0; i < matchTimeLine.frames.length; i++) {
            let frame = matchTimeLine.frames[i];
            let participantFrame = frame.participantFrames[this.id]
            let stats = new StatsHandler(this.calcStatsByLevel(participantFrame.level), participantFrame)

            let events = [];

            events = frame.events.filter((event) => {
                if (event['participantId'] !== undefined) {
                    return event['participantId'] === this.id;
                } else if (event['killerId'] !== undefined) {
                    if (event['killerId'] === this.id) {
                        return true;
                    }
                } else if (event['victimId'] !== undefined) {
                    if (event['victimId'] === this.id) {
                        return true;
                    }
                }
            });
            let tmpEvents = {}

            for (let event of events) {
                let timestampString = event.timestamp.toString()
                if (!tmpEvents.hasOwnProperty(timestampString)) {
                    tmpEvents[timestampString] = {
                        type: event.type.includes('ITEM') ? 'ITEM' : 'OTHER',
                        events: []
                    };
                }
                tmpEvents[timestampString].events.push(event)
            }


            this.frames.push(new Frame(tmpEvents, stats));
        }
    }


    calcStatsByLevel(level) {
        let stats = new Stats();
        stats.ad = applyLolGrowStatistic(this.champion.stats.attackdamage, this.champion.stats.attackdamageperlevel, level)
        stats.armor = applyLolGrowStatistic(this.champion.stats.armor, this.champion.stats.armorperlevel, level)

        stats.hp = applyLolGrowStatistic(this.champion.stats.hp, this.champion.stats.hpperlevel, level)
        stats.mr = applyLolGrowStatistic(this.champion.stats.spellblock, this.champion.stats.spellblockperlevel, level)
        stats.baseAs = this.champion.stats.attackspeed
        stats.as += applyLolGrowStatistic(0, this.champion.stats.attackspeedperlevel / 100, level)
        // apply perks to stats
        for (let perkName in this.perks.statPerks) {
            let perkId = this.perks.statPerks[perkName]
            let perkData = perkList[perkId]
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
    }
}
