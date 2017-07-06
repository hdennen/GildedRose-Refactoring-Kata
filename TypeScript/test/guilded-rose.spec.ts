import { expect } from 'chai';
import { Item, GildedRose } from '../app/gilded-rose';

describe('Gilded Rose', function () {

    it('should foo', function() {
        const gildedRose = new GildedRose([ new Item('foo', 0, 0) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].name).to.equal('foo');
    });

    it('Once the sell by date has passed, Quality degrades twice as fast', function() {
        const gildedRose = new GildedRose([ new Item('foo', 0, 5) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(3);
    });

    it('The Quality of an item is never negative', function() {
        const gildedRose = new GildedRose([ new Item('foo', 0, 0) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.be.greaterThan(-1);
    });

    it('"Aged Brie" actually increases in Quality the older it gets', function() {
        const gildedRose = new GildedRose([ new Item('Aged Brie', 0, 0) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.be.greaterThan(0);
    });

    it('The Quality of an item is never more than 50', function() {
        const gildedRose = new GildedRose([ new Item('Aged Brie', 0, 50) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(50);
    });

    it('"Sulfuras", being a legendary item, never has to be sold', function() {
        const gildedRose = new GildedRose([ new Item('Sulfuras, Hand of Ragnaros', 10, 80) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].sellIn).to.equal(10);
    });

    it('"Sulfuras", being a legendary item, never decreases in Quality', function() {
        const gildedRose = new GildedRose([ new Item('Sulfuras, Hand of Ragnaros', 10, 80) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(80);
    });

    it('"Backstage passes" Quality increases by 2 when there are less than 11 days but more than 5', function() {
        const gildedRose = new GildedRose([ new Item('Backstage passes to a TAFKAL80ETC concert', 10, 4) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(6);
    });

    it('"Backstage passes" Quality increases by 3 when there are 5 days or less', function() {
        const gildedRose = new GildedRose([ new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(23);
    });

    it('"Backstage passes" Quality drops to 0 after the concert', function() {
        const gildedRose = new GildedRose([ new Item('Backstage passes to a TAFKAL80ETC concert', 0, 15) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(0);
    });




});
