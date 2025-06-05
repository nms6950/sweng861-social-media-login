<template>
    <div class="card" style="width: 30%;">
        <div class="card-body">
            <h5 class="card-title">Card Title</h5>
            <p class="card-text">Critics Score: XX/100</p>
            <p class="card-text">Audience Score: XX/100</p>
            <p class="card-text">Release Date: XXXXXXXXXXX</p>
            <div class="icons">
                <button class="btn btn-info" style="color:white">
                    <fa icon="pen-to-square" />
                </button>
                <button class="btn btn-danger">
                    <fa icon="trash" /> 
                </button>
                
            </div>
        </div>
    </div>
</template>

<style>
.icons {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    gap: 5%;
}
</style>

<script>
export default {
    name: 'Card',
    data() {
        return {

        }
    },
    methods: {

    }
}
</script>