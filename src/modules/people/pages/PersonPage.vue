<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const route = useRoute();
const ID = ref(route.params.id);
document.title = document.title.replace('{id}', `#${ID.value}`);
</script>

<template>
	{{ ID }}
</template>

<style scoped lang="scss">

</style>
