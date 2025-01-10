<template>
    <div
        :style="`
        background-image: url('/icons/${name}.svg');
        background-repeat: no-repeat;
        background-position: center;
        width: ${size.split('x')[1] || 10}px;
        height: ${size.split('x')[0] || 10}px;
        filter: invert(1);
        `"
    />
</template>

<script>
export default {
    props: ['name', 'size']
}
</script>