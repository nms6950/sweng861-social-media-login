<!-- views/Home.vue or similar -->
<template>
    <div class="home-screen">
        <NavBar />
        <div class="container">
            <div class="welcome-container">

            </div>
            <div class="shows-container">
                <!-- TODO: Change this to a v-for -->
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
            </div>
        </div>
    </div>
</template>

<style scoped>
.home-screen {
    display: flex;
    gap: 5%;
}

.shows-container {
    width: 80%;
    height: 70%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    border: 2px gray solid;
    gap: 10%;
    overflow-y: scroll;
}

.welcome-container {
    width: 80%;
    height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px gray solid;
}
  
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 5vh;
    height: 100vh !important;
    width: calc(100% - 220px); /* subtract sidebar width */
    margin-left: 220px; /* push content beside the sidebar */
    background-image: url('./../assets/login_image.jpg');
    background-size: cover;
    position: relative;
}
</style>

<script>
import Card from './Card.vue';
import NavBar from './NavBar.vue';
export default {
    name: 'Home',
    components: {
        NavBar,
        Card
    },
    data() {
        return {
            
        }
    },
    methods: {
        

         
    },
    mounted() {
        
    },
    
}
</script>