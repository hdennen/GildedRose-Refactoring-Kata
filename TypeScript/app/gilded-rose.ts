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
    // set constants
    // make conditions functions
    
    static MAX_QUALITY = 50;
    static MIN_QUALITY = 0;
    static NORMAL_DEGRADATION = 1;
    static CONJURED_DEGRADATION = GildedRose.NORMAL_DEGRADATION * 2;
    items: Array<Item>;

    constructor(items = []) {
        this.items = items;
    }
    
    isBrie(item): boolean {
        return item.name === 'Aged Brie';
    }
    
    isBackStagePass(item): boolean {
        return item.name === 'Backstage passes to a TAFKAL80ETC concert';
    }
    
    isSulfuras(item): boolean {
        return item.name === 'Sulfuras, Hand of Ragnaros';
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
    
    isNoQuality(item): boolean {
        return item.quality === GildedRose.MIN_QUALITY;
    }
    
    isConjured(item): boolean {
        return item.name === 'Conjured';
    }

    updateQuality(): Array<Item> {
        return this.items.map(item => {
            if (this.isSulfuras(item)) return item;
            item.sellIn--;
            
            if (this.isQualityMax(item) || (this.isNoQuality(item) && !this.isBrie(item))) {
                return item;
            }
            
            if (this.isBrie(item)) {
                item.quality++;
                return item;
            }
            
            if (this.isBackStagePass(item)) {
                if (item.sellIn < 1) {
                    item.quality = 0;
                    return item;
                }
                item.quality++;
                
                if (item.quality === 50) return item; // cover this with unit test.
                
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
            
            if (this.isConjured(item)) {
                item.quality -= GildedRose.CONJURED_DEGRADATION;
                
                if (item.sellIn < 0) item.quality -= GildedRose.CONJURED_DEGRADATION;
                
                if (item.quality < 0) item.quality = 0;
                
                return item;
                
            }
            
            item.quality--;
            
            if (item.sellIn < 0 && item.quality !== 0) {
                item.quality--;
            }
            
            return item;
        });
    }
}
