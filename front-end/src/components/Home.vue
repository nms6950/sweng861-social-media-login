<!-- views/Home.vue or similar -->
<template>
    <div class="home-screen" id="Home">
        <NavBar />
        <div class="container">
            <div class="welcome-container">
                <h4>Rotten Tomatoes - Today's Trending Shows!</h4>
                <div class="operations-container">
                    <div class="search-container">
                        <input type="text" placeholder="Search show by title..." v-model="title_input" class="show-input">
                    </div>
                    <button class="btn btn-primary pointer min-width-150" @click="initNewShowModal">
                        <fa icon="plus" />
                        <label class="ms-2 pointer">Add Show</label>
                    </button>
                </div>
            </div>
            <div class="shows-container">
                <Card 
                  v-for="show in filteredShows" 
                  :show="show"    
                  :key="show.show_id"
                  @updateShow="initUpdateModal($event)"
                  @deleteShow="initDeleteModal($event)"
                />
            </div>
        </div>
        <UpdateShow :show="updatedShow" @refresh="getAllShows()"></UpdateShow>
        <DeleteShow :show="deletedShow" @refresh="getAllShows()"></DeleteShow>
        <NewShow @refresh="getAllShows()"></NewShow>
    </div>
</template>

<style scoped>
.min-width-150 {
    min-width: 150px !important;
}
.operations-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40%;
    flex-direction: row;
    gap: 10%;
}
.pointer {
    cursor: pointer !important;
}
.show-input {
    height: 50px;
    width: 100%;
    background-color: lightgray;
    border: 3px solid black;
    border-radius: 10px;
    padding-left: 2%;
}

.search-container {
    height: 70px;
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-weight: 700;
}

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
    background-color: rgb(211, 211, 211, 0.5);
    gap: 10%;
    overflow-y: scroll;
    padding: 2%;
    border-radius: 10px;
}

.welcome-container {
    width: 80%;
    height: 15%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: row;
    border: 2px gray solid;
    background-color: rgb(128, 128, 128, 0.5);
    border-radius: 10px;
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
import axios from 'axios';
import Card from './Card.vue';
import NavBar from './NavBar.vue';
import UpdateShow from './UpdateShow.vue';
import DeleteShow from './DeleteShow.vue';
import NewShow from './NewShow.vue';
import { Modal } from 'bootstrap'
export default {
    name: 'Home',
    components: {
        NavBar,
        Card,
        UpdateShow,
        NewShow,
        DeleteShow
    },
    data() {
        return {
            shows: [],
            title_input: '',
            updatedShow: {},
            deletedShow: {}
        }
    },
    methods: {
        async getAllShows() {
            // Testing - localhost url
            // let url = 'http://localhost:4000/getAllShows'
            let url = 'https://sweng861-social-media-login.onrender.com/getAllShows'
            try {
                let response = await axios.get(url);
                this.shows = response.data;
            } catch (error) {
                console.log(error)
            }
        },
        initUpdateModal(show) {
            this.updatedShow = show;
            // Get the modal element by ID
            const modalEl = document.getElementById('updateShowModal')

            // Initialize and show the modal
            const modalInstance = new Modal(modalEl)
            modalInstance.show()
        },
        initDeleteModal(show) {
            this.deletedShow = show;
            // Get the modal element by ID
            const modalEl = document.getElementById('deleteConfirmationModal')

            // Initialize and show the modal
            const modalInstance = new Modal(modalEl)
            modalInstance.show()
        },
        initNewShowModal() {
            // Get the modal element by ID
            const modalEl = document.getElementById('newShowModal')

            // Initialize and show the modal
            const modalInstance = new Modal(modalEl)
            modalInstance.show()
        }
    },
    mounted() {
        this.getAllShows();
    },
    computed: {
        filteredShows() {
            return this.shows.filter(show => show.title.toLowerCase().includes(this.title_input.toLowerCase()))
        }
    }
}
</script>