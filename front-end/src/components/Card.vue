<template>
    <div 
      class="card" 
      :style="show.image_url ? 'width: 40%' : 'width: 25%; margin-right: 15%;'"
      v-if="show"
    >
        <div class="card-body">
            <h5 class="card-title">{{ show.title }}</h5>
            <div class="card-row mt-3">
                <div>
                    <p class="card-text">Critics Score: {{ show.critics_score ? `${show.critics_score}/100` : 'N/A' }}</p>
                    <p class="card-text">Audience Score: {{ show.audience_score ? `${show.audience_score}/100` : 'N/A' }}</p>
                    <p class="card-text">{{ show.release_date ? show.release_date : 'TBD' }}</p>
                    <div class="icons">
                        <button class="btn btn-info" style="color: white" @click="$emit('updateShow', show)">
                            <fa icon="pen-to-square" />
                        </button>
                        <button class="btn btn-danger" @click="$emit('deleteShow', show)">
                            <fa icon="trash" /> 
                        </button>
                    </div>
                </div>
                <img :src="show.image_url" v-if="show.image_url" />
            </div>
        </div>
    </div>
</template>

<style>
@media (max-width: 1500px) {
    h5 {
        font-size: 1rem !important;
    }
}
.card-body {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
}

.card-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
}

.card-body img {
    width: 100px;
}
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
    props: ['show'],
    components: {
        
    },
    data() {
        return {

        }
    },
    methods: {

    }
}
</script>