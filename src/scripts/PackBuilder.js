export function sum(array) {
    return array.reduce((acc, val) => acc + val, 0);
}

export function takeRight(arr, n = 1) {
    return  n === 0 ? [] : arr.slice(-n);
}

class Cell {
    constructor(amp, slot=-1) {
        this.amp = amp;
        this.slot = slot;
    }
}

class ParallelPack {
    constructor(cells=null) {
        this.cells = cells || [];
    }
    addCell(cell) {
        this.cells.push(cell);
    }
    length() {
        return this.cells.length;
    }
    getCapacities() {
        return this.cells.map(cell => cell.amp);
    }
    getTotalCapacity() {
        return sum(this.getCapacities());
    }
    getDesviation() {
        const mean = this.getTotalCapacity() / this.length();
        const capacities = this.getCapacities();

        return Math.sqrt(sum(capacities.map(capacity => (capacity - mean) ** 2)) / this.length());
    }
}

export class PackBuilder {
    constructor(cells, series, parallel) {
        this.parallel = parallel;
        this.series = series;
        this.cells = this.getCells(cells);
        this.optimalCells = this.getOptimalCells(this.cells, this.series, this.parallel);

        this.meanParallelAmp = sum(this.optimalCells.map(cell => cell.amp)) / series;
        this.meanBatteryAmp = this.meanParallelAmp / parallel;
    }
    getCells(cells) {
        return cells.map((amp, index) => new Cell(amp, index + 1));
    }
    getOptimalCells(cells, series, parallel) {
        return cells.sort((a, b) => a.amp - b.amp).reverse().slice(0, series * parallel);
    }
    getParallelError(parallelPack) {
        const n = parallelPack.length();
        const capacity = parallelPack.getTotalCapacity();

        return this.optimalCells.map((cell) => {
            const mean = this.meanBatteryAmp * (n+1);
            const newCapacity = capacity + cell.amp;
            return Math.abs((mean - newCapacity));
        });
    }
    extractBattery(index) {
        return this.optimalCells.splice(index, 1)[0];
    }
    build() {
        const parallelPacks = [];

        for (let i=0; i < this.series; i++) {
            const parallelPack = new ParallelPack([this.extractBattery(0)]);

            for (let i=0; i < this.parallel - 1; i++) {
                const errors = this.getParallelError(parallelPack);
                const minErrorIndex = errors.indexOf(Math.min(...errors));
                parallelPack.addCell(this.extractBattery(minErrorIndex));
            }

            parallelPacks.push(parallelPack);
        }

        return parallelPacks;
    } 
}