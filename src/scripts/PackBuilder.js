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
            .splice(0, this.series * this.parallels);

        this.amps = sum(this.cells.map(c=>c.amps)) / this.series;
    }


    build() {
        const packs = []

        const queues = [...Array(this.parallels).keys()].map(i => {
            return this.cells.slice(this.series * i, this.series * (i + 1));
        });

        for (let i = 0; i < this.series; i++) {
            const pack = [];

            for (let j = 0; j < this.parallels; j++) {
                let target = this.amps

                if (j < this.parallels - 1) {
                    const max = queues[j][0].amps
                    const min = queues[j][queues[j].length - 1].amps
                    target -= (min + max) / 2
                }

                const errors = queues[j].map(cell => {
                    const amps = pack.concat(cell).map(c => c.amps);
                    return (target - sum(amps)) ** 2;
                });

                const index = errors.indexOf(Math.min(...errors));
                
                pack.push(queues[j].splice(index, 1)[0]);
            }

            packs.push(pack);
        }

        return packs;

    }
}