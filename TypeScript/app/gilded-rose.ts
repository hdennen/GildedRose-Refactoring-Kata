export class Item {
    name: string;
    sellIn: number;
    quality: number;
    
    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

Item.prototype['increaseQuality'] = function() {
    this.quality++;
}

Item.prototype['decreaseQuality'] = function() {
    this.quality--;
}

Item.prototype['isWithinRange'] = function (low, high) {
    return this.sellIn > low && this.sellIn < high;
}

Item.prototype['isExpired'] = function () {
    return this.sellIn < 0;
}

Item.prototype['hasQuality'] = function(number) {
    return this.quality === number;
}

export class GildedRose {
    
    static MAX_QUALITY = 50;
    static MIN_QUALITY = 0;
    items: Array<Item>;
    handlers: any;

    constructor(items = []) {
        this.items = items;
        this.handlers = this.createItemHandlers();
    }
    
    createItemHandlers() {
        let obj = {};
        
        obj['default'] = (item) => {
            return this.defaultLogic(item);
        }
        
        obj['Aged Brie'] = (item) => {
            return this.cheeseLogic(item);
        }
        
        obj['Sulfuras, Hand of Ragnaros'] = (item) => {
            return this.legendaryLogic(item);
        }
        
        obj['Backstage passes to a TAFKAL80ETC concert'] = (item) => {
            return this.backstagePassLogic(item);
        }
        
        obj['Conjured'] = (item) => {
            return this.defaultLogic(this.defaultLogic(item));
        }
        
        return obj;
    }

    legendaryLogic(item): Item {
        item.sellIn = 0;
        return item;
    }

    defaultLogic(item): Item {
        if (item.hasQuality(GildedRose.MIN_QUALITY)) return item;
        item.decreaseQuality();

        if (item.isExpired() && !item.hasQuality(GildedRose.MIN_QUALITY)) {
            item.decreaseQuality();
        }

        return item;
    }

    cheeseLogic(item): Item {
        if (item.hasQuality(GildedRose.MAX_QUALITY)) return item;

        item.increaseQuality();
        return item;
    }

    backstagePassLogic(item): Item {
        if (item.sellIn < 1) {
            item.quality = GildedRose.MIN_QUALITY;
            return item;
        }

        item.increaseQuality();
        if (item.hasQuality(GildedRose.MAX_QUALITY)) return item;

        if (item.isWithinRange(0,11)) item.increaseQuality();
        if (item.hasQuality(GildedRose.MAX_QUALITY)) return item;

        if (item.isWithinRange(0,6)) item.increaseQuality();
        return item;
    }

    updateQuality(): Array<Item> {
        return this.items.map(item => {
            item.sellIn--;
            if (this.handlers.hasOwnProperty(item.name)) {
                return this.handlers[item.name](item);
            }
            
            return this.handlers.default(item);
        });
    }
}
