<script setup lang="ts">
import { MyTask } from '@/data/MyTask';
import { computed, onMounted, ref, useTemplateRef } from 'vue';

const props = defineProps({
    left: ref(Number),
    top: ref(Number),
    event: ref(MyTask)
})

const inst = useTemplateRef('editor');
let height = ref(500);

onMounted(()=>{
    if (inst.value != null && inst.value.height != undefined) {
        height.value =  Number.parseInt(inst.value.height.toString());
    }
});

let styleObj = computed(() => {
    let sh = window.innerHeight;
    let mt = Math.min(props.top, sh - height.value - 100);
    return {
        'z-index': 10000,
        'position': 'fixed',
        'width': '500px',
        'margin-left': props.left + 'px',
        'margin-top': mt + 'px',
    };
});

let showColorPicker = ref(false);
</script>

<template>
    <v-card ref="editor" title="任务详情" rounded :style="styleObj" :elevation=20>
        <v-text-field label="标题" v-model="event.title" hide-details></v-text-field>
        <v-textarea label="描述" v-model="event.desc" placeholder="请输入任务描述" hide-details></v-textarea>
        <v-btn :color="event.color" @click="showColorPicker = !showColorPicker">选择颜色</v-btn>
        <v-color-picker v-if="showColorPicker" hide-inputs v-model="event.color"></v-color-picker>
        <v-text-field label="任务天数" v-model.number="event.duration" type="number" hide-details></v-text-field>
        <v-switch color="primary" v-model="event.forceWork" :label="`是否在休息日劳动:${event.forceWork}`"></v-switch>
        <v-text-field label="任务起始偏移天数" v-model.number="event.offset" type="number" hide-details></v-text-field>

        <div><i disabled style="padding-left:10px; color:#000000DE;">开始时间:{{ event?.GetStartDay().format('YYYY-MM-DD')
                }}</i></div>
        <div><i disabled style="padding-left:10px; color:#000000DE;">结束时间:{{ event?.GetStopDay().format("YYYY-MM-DD")
                }}</i></div>
        <div><i disabled style="padding-left:10px; color:#000000DE;">createId:{{ event?.createId }}</i></div>
    </v-card>
</template>