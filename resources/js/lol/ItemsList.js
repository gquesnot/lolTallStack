import on from "alpinejs";

export class ItemList {
    items = []
    toBuy = []
    goldDiff = 0
    baseItems = {}
    events = []

    constructor(baseItems) {
        this.baseItems = baseItems
    }


    itemExist(id) {
        return this.baseItems[id] !== undefined
    }
    restoreItems(beforeId){

        for (let i = this.events.length - 1; i> 0; i--){
            for (let idx in this.events){
                let events = this.events[idx]
                let hasItem = events.some((event) => event.type ===  'ITEM_PURCHASED' && event.itemId === beforeId);
                if (hasItem){
                    for (let eventIdx in events){
                        let event = events[eventIdx]
                        if (event.type === 'ITEM_DESTROYED'){
                            this.applyItemPurchased(event)
                        }
                        else if (event.type === 'ITEM_PURCHASED'){
                            this.applyItemDestroyed(event)
                        }
                    }
                    return true;
                }
            }
        }
        console.log('error not found')
        return false;
    }

    addEvents(events) {

        let hasUndo = events.some((event) => event.type === 'ITEM_UNDO')
        let onlyDestroyed = events.every((event) => event.type === 'ITEM_DESTROYED')

        if (! hasUndo && !onlyDestroyed){
            for (let idx in events){
                let event = events[idx]
                if (event.type === 'ITEM_PURCHASED') {
                    this.applyItemPurchased(event)
                } else if ('ITEM_DESTROYED' === event.type || 'ITEM_SOLD' === event.type) {

                    this.applyItemDestroyed(event)
                } else if (event.type === 'ITEM_UNDO') {
                    this.applyItemUndo(event)

                }
            }
            this.events.push(events)
        }else if (hasUndo && !onlyDestroyed){
            this.restoreItems(events[0].beforeId)

        }
        if (!onlyDestroyed)
            this.events.push(events)


    }

    applyItemUndo(event) {
        let itemId = event.fromId
        if (this.itemExist(itemId)) {
            if (this.itemExist(itemId)) {
                let found = this.items.indexOf(itemId)

                if (found !== -1) {

                    this.items.splice(found, 1)
                } else {
                    this.toBuy.push(itemId)
                }
                if (event.afterId !== 0) {
                    this.applyItemPurchased({itemId: event.afterId}, true)
                }
            }
        }
    }

    applyItemPurchased(event) {
        let itemId = event.itemId
        if (this.itemExist(itemId)) {
            if (!this.toBuy.includes(itemId)) {
                this.items.push(itemId)
            } else {
                let found = this.items.indexOf(itemId)
                this.toBuy.splice(found, 1)

            }

        }
    }

    applyItemDestroyed(event) {
        let itemId = event.itemId
        if (this.itemExist(itemId)) {
            let found = this.items.indexOf(itemId)
            //console.log('destroy', itemId, this.toBuy, this.items)
            if (found !== -1) {
                this.items.splice(found, 1)
            } else {
                console.log('cantBuy', event, this.items)
                this.toBuy.push(itemId)
            }
        }

    }

}
