export function sum(array) {
    return array.reduce((acc, val) => acc + val, 0);
}

export class PackBuilder {
    constructor(batteries, series, parallel) {
        this.batteries = batteries.sort().slice(-series * parallel);
        this.meanParallelAmp = sum(this.batteries) / series;
        this.meanBatteryAmp = this.meanParallelAmp / parallel;
        this.parallel = parallel;
        this.series = series;
    }
    getParallelError(parallelPack) {
        const n = parallelPack.length;
        const amp = sum(parallelPack);

        return this.batteries.map((batteryAmp) => {
            return ((this.meanBatteryAmp * (n+1)) - (amp + batteryAmp)) ** 2;
        });
    }
    extractBattery(index) {
        return this.batteries.splice(index, 1)[0];
    }
    build() {
        const parallelPacks = [];

        for (let i=0; i < this.series; i++) {
            const parallelPack = [];

            for (let i=0; i < this.parallel; i++) {
                const errors = this.getParallelError(parallelPack);
                const minErrorIndex = errors.indexOf(Math.min(...errors));
                parallelPack.push(this.extractBattery(minErrorIndex));
            }

            parallelPacks.push(parallelPack);
        }

        return parallelPacks;
    } 
}