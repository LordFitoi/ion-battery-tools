<template>
    <section class="container max-w-[1000px] mx-auto px-[20px] py-[60px] flex flex-col gap-[40px]">
        <h1 class="block text-2xl lg:text-5xl text-[#111322] mb-1">Pack Builder</h1>
        <div class="flex flex-col gap-[16px]">
            <div class="mb-[16px] flex flex-col gap-[16px]">
                <label class="block text-md text-[#667085]">Provide a list of cells</label>
                <div class="grid grid-cols-4 sm:grid-cols-6  lg:grid-cols-10 gap-[8px]">
                    <div class="flex flex-col group" v-for="cell, i in cells" :key="cell">
                        <div class="w-full flex justify-between items-center mb-1">
                            <span class="text-xs text-[#667085] ml-[4px]">Slot {{ i + 1 }}</span>
                            <img :src="getIcon('/icons/trash-01.svg')" class="cursor-pointer w-[14px] h-[14px] block lg:hidden group-hover:block" @click="removeCell(i)">
                        </div>
                        <div class="grow flex gap-[8px] items-center rounded-[16px] min-h-[22px] px-[8px] py-[2px] text-sm bg-[#F2F4F7] text-[#344054]" >
                            <span class="break-words w-full ">{{ cell }} mAh</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="flex gap-2">
                        <input
                            class="grow rounded-lg border-[1px] border-[#D0D5DD] shadow-sm px-[14px] py-[10px] text-sm text-[#667085]"
                            type="number" min="1" placeholder="9823 mAh" ref="cellInput" v-model="cellInput" @keydown.enter="addCell"
                        />
                        <button
                            class="w-max bg-[#111322] text-white rounded-lg px-[14px] py-[10px] text-sm text-center hover:bg-[#50575E] cursor-pointer"
                            @click="addCell"
                        >
                            Add Cell
                        </button>
                        <button
                            class="w-[42px] bg-[#111322] text-white rounded-lg flex items-center justify-center hover:bg-[#50575E] cursor-pointer" @click="removeAllCells()"
                        >
                            <img :src="getIcon('/icons/trash-01.svg')" alt="" class="w-[20px] h-[20px] filter-white">
                        </button>
                    </div>
                    <span class="block text-xs text-[#667085] mt-1 ml-2">Tip: Press enter to quickly add the cell</span>
                </div>
            </div>
            <div>
                <label class="block text-md text-[#667085] mb-4">Specify pack dimensions</label>
                <div class="flex flex-col gap-[8px]">
                    <div class="flex gap-[8px]">
                        <div class="grow">
                            <span class="block text-xs text-[#667085] mb-1">Cells in Series</span>
                            <input
                                class="w-full rounded-lg border-[1px] border-[#D0D5DD] shadow-sm px-[14px] py-[10px] text-sm text-[#667085]"
                                id="series" type="number" min="1" placeholder="Series" v-model="series"
                            />
                        </div>
                        <div class="grow">
                            <span class="block text-xs text-[#667085] mb-1">Capacity (Parallels)</span>
                            <input
                                class="w-full rounded-lg border-[1px] border-[#D0D5DD] shadow-sm px-[14px] py-[10px] text-sm text-[#667085]"
                                id="parallels" type="number" min="1" placeholder="Parallel" v-model="parallels"
                            />
                        </div>
    
                    </div>
                    <div>
                        <span class="block text-xs text-[#667085] mb-1">Nominal Voltage</span>
                        <input
                            class="w-full rounded-lg border-[1px] border-[#D0D5DD] shadow-sm px-[14px] py-[10px] text-sm text-[#667085]"
                            id="parallels" type="number" min="1" placeholder="3.6v" v-model="nominalVoltage"
                        />
                    </div>

                </div>
            </div>
            <div class="flex gap-[4px]">
                <button
                    class="w-full bg-[#111322] text-white rounded-lg px-[14px] py-[10px] text-sm text-center hover:bg-[#50575E] cursor-pointer"
                    @click="buildPack()"    
                >
                    Build Pack
                </button>
                <button
                    class="w-[42px] bg-[#111322] text-white rounded-lg flex items-center justify-center hover:bg-[#50575E] cursor-pointer" @click="buildPackFromUnused()"
                >
                    <img :src="getIcon('/icons/reverse-right.svg')" alt="" class="w-[20px] h-[20px] filter-white">
                </button>
            </div>
        </div>
        <div v-if="packs" class="flex flex-col gap-4">
            <div class=" border-[1px] border-[#D0D5DD] rounded-lg p-[16px] bg-[#FFF] shadow-md">
                <span class="block text-lg text-[#667085] mb-4 font-bold">BATTERY CHARACTERISTICS</span>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
                    <div>
                        <span class="block text-md text-[#667085] mb-1">Voltage ({{ nominal }} nominal)</span>
                        <div class="w-full rounded-lg border-[1px] border-[#D0D5DD] shadow-sm px-[12px] py-[8px] text-sm text-[#667085]" >
                            {{ voltage }}V
                        </div>
                    </div>
                    <div>
                        <span class="block text-md text-[#667085] mb-1">Amps Hours</span>
                        <div class="w-full rounded-lg border-[1px] border-[#D0D5DD] shadow-sm px-[12px] py-[8px] text-sm text-[#667085]" >
                            {{ capacity }} Ah
                        </div>
                    </div>
                    <div>
                        <span class="block text-md text-[#667085] mb-1">Watt Hours</span>
                        <div class="w-full rounded-lg border-[1px] border-[#D0D5DD] shadow-sm px-[12px] py-[8px] text-sm text-[#667085]" >
                            {{ power }} Wh
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                <ParallelPack v-for="(pack, i) in packs" :key="pack" :data="pack" :index="i" />
            </div>
        </div>
    </section>
</template>
<script>
import ParallelPack from './ParallelPack.vue';
import { PackBuilder } from "../scripts/PackBuilder"

export default {
    name: "BatteryBalanceApp",
    components: {
        ParallelPack
    },
    data: () => ({
        cells: [],
        cellInput: null,
        series: 1,
        parallels: 1,
        nominalVoltage: 3.6,
        nominal: null,
        voltage: null,
        capacity: null,
        power: null,
        packs: null,
    }),
    mounted() {
        this.load();
    },
    watch: {
        cells: {
            handler() {
                this.save();
            },
            deep: true
        }
    },
    methods: {
        save() {
            localStorage.setItem('cells', JSON.stringify(this.cells));
        },
        load() {
            this.cells = JSON.parse(localStorage.getItem('cells')) || [];
        },
        removeAllCells() {
            this.cells = [];
        },
        addCell() {
            this.cells.push(Number(this.cellInput));
            this.cellInput = null;
        },
        removeCell(i) {
            this.cells.splice(i, 1);
        },
        buildPackFromUnused() {
            const useCells = this.cells.sort((a, b) => a - b)
                .reverse()
                .slice(0, this.series * this.parallels);

            useCells.forEach(cell => {
                this.cells.splice(this.cells.indexOf(cell), 1);
            });

            this.buildPack();
        },
        buildPack() {
            if (this.cells.length < 1) {
                alert('You must provide at least one cell');
                return;
            }

            if (this.cells.length < this.series * this.parallels) {
                alert('You must provide at least the same amount of cells as the product of series and parallels');
                return;
            }
   
            const packBuilder = new PackBuilder(this.cells, this.series, this.parallels);

            this.packs = packBuilder.build();
            this.voltage = this.nominalVoltage * this.series;
            this.capacity = packBuilder.amps / 1000;
            this.power = this.voltage * this.capacity;
            this.nominal = this.series;
        },
        getIcon(path) {
            const base = process.env.NODE_ENV != "development" ? '/ion-battery-tools' : "";
            return base + path;
        }
    }
}
</script>