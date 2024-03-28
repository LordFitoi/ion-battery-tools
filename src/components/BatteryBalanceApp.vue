<template>
    <section class="container max-w-[1000px] mx-auto px-[20px] py-[60px] flex flex-col gap-[40px]">
        <h1 class="block text-2xl lg:text-5xl text-[#111322] mb-1">Pack Builder</h1>
        <div class="flex flex-col gap-[16px]">
            <div class="mb-[16px]">
                <label class="block text-md text-[#667085] mb-[16px]">Provide a list of cells</label>
                <div class="flex flex-wrap gap-[8px]">
                    <div class="flex flex-col group" v-for="cell, i in cells" :key="cell" draggable="true" @dragstart="dragstart">
                        <div class="w-full flex justify-between items-center">
                            <span class="text-xs text-[#667085] ml-[4px]">Slot {{ i + 1 }}</span>
                        </div>
                        <div class="w-max flex gap-[8px] items-center rounded-[16px] h-[22px] px-[8px] py-[2px] text-sm bg-[#F2F4F7] text-[#344054]" >
                            <img src="/icons/trash-01.svg" class="cursor-pointer w-[14px] h-[14px] hidden group-hover:block" @click="removeCell(i)">
                            <span>{{ cell }} mAh</span>
                        </div>
                    </div>
                </div>

                <div class="flex gap-2 mt-[16px]">
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
            <button
                class="w-full bg-[#111322] text-white rounded-lg px-[14px] py-[10px] text-sm text-center hover:bg-[#50575E] cursor-pointer"
                @click="buildPack()"    
            >
                Build Pack
            </button>
        </div>
        <div v-if="pack" class="flex flex-col gap-4">
            <div class=" border-[1px] border-[#D0D5DD] rounded-lg p-[16px] bg-[#FFF] shadow-md">
                <span class="block text-lg text-[#667085] mb-4 font-bold">BATTERY CHARACTERISTICS</span>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
                    <div>
                        <span class="block text-md text-[#667085] mb-1">Voltage ({{ series }} nominal)</span>
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
                <ParallelPack v-for="(parallel, i) in pack" :key="parallel" :data="parallel" :index="i" />
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
        voltage: null,
        capacity: null,
        power: null,
        pack: null
    }),
    methods: {
        addCell() {
            this.cells.push(Number(this.cellInput));
            this.cellInput = null;
        },
        removeCell(i) {
            this.cells.splice(i, 1);
        },
        dragstart(e) {
            console.log(e.target)
            e.target.classList.add('dragging');
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
            this.pack = packBuilder.build();

            this.voltage = this.nominalVoltage * this.series;
            this.capacity = packBuilder.meanParallelAmp / 1000;
            this.power = this.voltage * this.capacity;
        }
    }
}
</script>