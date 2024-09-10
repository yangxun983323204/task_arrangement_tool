<script setup lang="ts">

defineEmits(['confirm', 'cancel']);
const props = defineProps({
    dialog: Boolean,
});

</script>

<template>
    <v-dialog :model-value="dialog" max-width="290px" attach="body" retain-focus>
        <template v-slot:default="{ dialog }">
            <v-card title="确认操作">
                <v-card-text>你确定要执行这个操作吗？</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text="true" @click="$emit('cancel', $event)">取消</v-btn>
                    <v-btn color="green darken-1" text="true" @click="$emit('confirm', $event)">确定</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>