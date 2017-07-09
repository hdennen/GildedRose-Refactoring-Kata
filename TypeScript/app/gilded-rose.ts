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

export class GildedRose {
    
    static MAX_QUALITY = 50;
    static MIN_QUALITY = 0;
    static NORMAL_DEGRADATION = 1;
    static CONJURED_DEGRADATION = GildedRose.NORMAL_DEGRADATION * 2;
    items: Array<Item>;
    handlers: any;

    constructor(items = []) {
        this.items = items;
        this.handlers = this.createItemHandlers();
    }
    
    createItemHandlers() {
        let obj = {};
        
        obj['default'] = (item) => {
            item.sellIn--;
            if (item.quality === GildedRose.MIN_QUALITY) return item;
            item.quality--;
    
            if (item.sellIn < 0 && item.quality !== GildedRose.MIN_QUALITY) {
                item.quality--;
            }
    
            return item;
        }
        
        obj['Aged Brie'] = (item) => {
            item.sellIn--;
            if (this.isQualityMax(item)) return item;
            item.quality++;
            return item;
        }
        
        obj['Sulfuras, Hand of Ragnaros'] = (item) => {
            return item;
        }
        
        obj['Backstage passes to a TAFKAL80ETC concert'] = (item) => {
            item.sellIn--;
            if (item.sellIn < 1) {
                item.quality = GildedRose.MIN_QUALITY;
                return item;
            }
            item.quality++;
    
            if (item.quality === GildedRose.MAX_QUALITY) return item;
    
            if (this.isWithinFiveDays(item)) {
                item.quality++;
                if (this.isQualityMax(item)) return item;
                item.quality++;
                return item;
            }
    
            if (this.isWithinTenDays(item)) {
                item.quality++;
                return item;
            }
        }
        
        obj['Conjured'] = (item) => {
            item.sellIn--;
            item.quality -= GildedRose.CONJURED_DEGRADATION;
    
            if (item.sellIn < 0) item.quality -= GildedRose.CONJURED_DEGRADATION;
    
            if (item.quality < 0) item.quality = 0;
    
            return item;
        }
        
        return obj;
    }
    
    isWithinFiveDays(item): boolean {
        if (item.sellIn > 0 && item.sellIn < 6) return true;
    }
    
    isWithinTenDays(item): boolean {
        if (item.sellIn > 5 && item.sellIn < 11) return true;
    }
    
    isQualityMax(item): boolean {
        return item.quality === GildedRose.MAX_QUALITY;
    }

    updateQuality(): Array<Item> {
        return this.items.map(item => {
            if (this.handlers.hasOwnProperty(item.name)) {
                return this.handlers[item.name](item);
            }
            
            return this.handlers.default(item);
        });
    }
}
