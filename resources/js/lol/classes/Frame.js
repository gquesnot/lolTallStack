import {StatsHandler} from "./StatsHandler";

export class Frame{
    stats;
    events;

    constructor(events, stats){
        this.events = events;
        this.stats = stats;
    }

}
