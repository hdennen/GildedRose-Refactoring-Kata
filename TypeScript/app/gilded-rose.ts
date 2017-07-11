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

Item.prototype['increaseQuality'] = function(amount = 1) {
    this.quality += amount;
}

Item.prototype['decreaseQuality'] = function(amount = 1) {
    this.quality -= amount;
}

Item.prototype['isWithinSellRange'] = function (low, high) {
    return this.sellIn >= low && this.sellIn <= high;
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
            return this.normalizeQuality(this.defaultLogic(item));
        }
        
        obj['Aged Brie'] = (item) => {
            return this.normalizeQuality(this.cheeseLogic(item));
        }
        
        obj['Sulfuras, Hand of Ragnaros'] = (item) => {
            return this.legendaryLogic(item);
        }
        
        obj['Backstage passes to a TAFKAL80ETC concert'] = (item) => {
            return this.normalizeQuality(this.backstagePassLogic(item));
        }
        
        obj['Conjured'] = (item) => {
            return this.normalizeQuality(this.defaultLogic(this.defaultLogic(item)));
        }
        
        return obj;
    }

    legendaryLogic(item): Item {
        item.sellIn = 0;
        return item;
    }

    defaultLogic(item): Item {
        if (item.isWithinSellRange(GildedRose.MIN_QUALITY + 1, GildedRose.MAX_QUALITY)) item.decreaseQuality();
        if (item.isExpired()) item.decreaseQuality(2);
        return item;
    }

    cheeseLogic(item): Item {
        item.increaseQuality();
        return item;
    }

    backstagePassLogic(item): Item {
        if (item.isExpired()) item.quality = GildedRose.MIN_QUALITY;
        if (item.isWithinSellRange(11, 50)) item.increaseQuality();
        if (item.isWithinSellRange(6,10)) item.increaseQuality(2);
        if (item.isWithinSellRange(0,5)) item.increaseQuality(3);
        return item;
    }
    
    normalizeQuality(item): Item {
        if (item.quality > GildedRose.MAX_QUALITY) item.quality = GildedRose.MAX_QUALITY;
        if (item.quality < GildedRose.MIN_QUALITY) item.quality = GildedRose.MIN_QUALITY;
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
