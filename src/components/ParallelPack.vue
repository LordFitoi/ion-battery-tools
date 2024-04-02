<template>
    <div class="flex flex-col gap-[24px] border-[1px] border-[#D0D5DD] rounded-lg p-[16px] bg-[#FFF] shadow-md">
        <div>
            <span class="block text-lg text-[#667085] mb-4 font-bold">PARALLEL PACK {{ index + 1 }}</span>
            <div class="mb-2">
                <span class="block text-md text-[#667085] mb-1">Total Capacity</span>
                <div class="w-full rounded-lg border-[1px] border-[#D0D5DD] shadow-sm px-[12px] py-[8px] text-sm text-[#667085]" >
                    {{ capacity }} mAh
                </div>
            </div>
            <div>
                <span class="block text-md text-[#667085] mb-1">Desviation (Between cells in pack)</span>
                <div class="w-full rounded-lg border-[1px] border-[#D0D5DD] shadow-sm px-[12px] py-[8px] text-sm text-[#667085]" >
                    {{ desviation }} mAh
                </div>
            </div>
        </div>
        <div>
            <span class="block text-base text-[#667085] mb-1">Cells</span>
            <div class="flex flex-wrap gap-[8px] cells">
                <label class="select-none" v-for="cell in data.cells" :key="cell">
                    <input type="checkbox" class="hidden" />
                    <div class="w-max rounded-lg border-[1px] border-[#D0D5DD] shadow-sm p-[8px] text-xs text-[#667085] cell" >
                        <span class="block font-bold">{{ cell.amp }} mAh</span>
                        <span class="block">Slot {{ cell.slot }}</span>
                    </div>
                </label>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        data: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            desviation: Math.floor(this.data.getDesviation()),
            capacity: this.data.getTotalCapacity()
        }
    }
}
</script>