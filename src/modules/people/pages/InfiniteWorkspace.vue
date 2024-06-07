<script setup lang="ts">
import { ref } from 'vue';
import PersonCard from '@/modules/people/components/PersonCard.vue';
import { usePeopleService } from '@/modules/people/composables/usePeopleService.ts';
import { useTreeService } from '@/modules/people/composables/useTreeService.ts';

/** @see: https://dev.to/iscorekin/infinite-workspace-without-canvas-107b */
const offset = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const zoom = ref<number>(1);

const previousTouch = ref<Touch>();
const isDragging = ref(false);
const initialPinchDistance = ref<number>();

function handleMouseMove(e: MouseEvent) {
	// This event should trigger only when isDragging === true
	if (!isDragging.value) {
		return;
	}

	// If the user releases the mouse button, stop dragging
	// This is useful when the user releases the mouse button outside the window
	if (e.buttons !== 1) {
		isDragging.value = false;
		return;
	}

	offset.value.x += e.movementX;
	offset.value.y += e.movementY;
}

function handleWheel(e: WheelEvent) {
	const delta = e.deltaY > 0 ? -0.1 : 0.1;
	zoom.value += delta;
	zoom.value = Math.max(0.1, zoom.value); // Prevent zoom from becoming 0 or negative
}

function handleTouchStart(e: TouchEvent) {
	isDragging.value = true;

	if (e.touches.length === 2) {
		initialPinchDistance.value = Math.hypot(
			e.touches[0].pageX - e.touches[1].pageX,
			e.touches[0].pageY - e.touches[1].pageY,
		);
	}
}

function handleTouchMove(e: TouchEvent) {
	// Handle dragging
	if (e.touches.length === 1) {
		const touch = e.touches[0];
		if (!previousTouch.value) {
			previousTouch.value = touch;
			return;
		}

		offset.value.x += touch.pageX - previousTouch.value?.pageX;
		offset.value.y += touch.pageY - previousTouch.value?.pageY;

		// Update the previous touch point after calculating the offset
		previousTouch.value = touch;
		return;
	}

	// Handle pinch to zoom
	if (e.touches.length === 2 && initialPinchDistance.value !== undefined) {
		const newPinchDistance = Math.hypot(
			e.touches[0].pageX - e.touches[1].pageX,
			e.touches[0].pageY - e.touches[1].pageY,
		);

		const delta = (newPinchDistance - initialPinchDistance.value) * 0.01;
		zoom.value += delta;
		zoom.value = Math.max(0.1, zoom.value); // Prevent zoom from becoming 0 or negative

		initialPinchDistance.value = newPinchDistance;
	}
}

function handleTouchEnd() {
	isDragging.value = false;
	previousTouch.value = undefined;
	initialPinchDistance.value = undefined;
}

const { loading, getPeople } = usePeopleService();
getPeople();
const { root } = useTreeService();
</script>

<template>
	<div
		class="workspace"
		@mousedown.passive="isDragging = true"
		@touchstart.passive="handleTouchStart($event)"
		@mouseup.passive="isDragging = false"
		@touchend.passive="handleTouchEnd()"
		@mousemove.passive="handleMouseMove($event)"
		@touchmove.passive="handleTouchMove($event)"
		@wheel.passive="handleWheel($event)"
	>
		<div class="container">
			<div
				v-if="!loading && root"
				class="nodes-container"
				:style="{
					transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
				}"
			>
				<PersonCard :person="root" />
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.workspace {
	overflow: hidden;
	width: 100%;
	height: 100%;
	position: relative;

	.container, .nodes-container  {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	.container {
		overflow: hidden;
	}
}
</style>
