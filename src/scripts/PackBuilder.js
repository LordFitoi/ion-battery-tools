import { sum } from './utils.js';

class Cell {
    constructor(amps, slot=-1) {
        this.amps = amps;
        this.slot = slot;
    }
}

export class PackBuilder {
    constructor(cells, series, parallels) {
        this.parallels = parallels;
        this.series = series;
        this.cells = cells.map((amp, index) => new Cell(amp, index + 1))
            .sort((a, b) => a.amps - b.amps)
            .reverse()
            .slice(0, this.series * this.parallels);
        this.amps = sum(this.cells.map(c=>c.amps)) / this.series;
    }
    build() {
        const packs = []

        for (let i = 0; i < this.series; i++) {
            const pack = this.cells.splice(0, this.parallels);


            for (let j = 0; j < this.parallels; j++) {
                this.cells.push(pack.splice(0, 1)[0]);

                const target = this.amps - sum(pack.map(c=>c.amps));
                const errors = this.cells.map(c=>(target - c.amps)**2);
                const index = errors.indexOf(Math.min(...errors));

                pack.push(this.cells.splice(index, 1)[0]);
            }
           
            packs.push(pack);
        }

        return packs;

    }
}