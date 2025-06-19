<template>
    <div class="modal fade" id="newShowModal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          
          <div class="modal-header">
            <h5 class="modal-title" id="myModalLabel">Add New Show</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          
          <div class="modal-body">
            <div class="info-form">
                <div class="create-input-container">
                    <label>Title *</label>
                    <input type="text" v-model="title" class="create-input">
                </div>
                <div class="create-input-container">
                    <label>Critics Score</label>
                    <input type="number" min="0" max="100" v-model="critics_score" class="create-input">
                </div>
    
                <div class="create-input-container">
                    <label>Audience Score</label>
                    <input type="number" min="0" max="100" v-model="audience_score" class="create-input">
                </div>

                <div class="create-input-container">
                    <label>Release Date</label>
                    <input type="text" v-model="release_date" class="create-input">
                </div>
    
                <div class="create-input-container">
                    <label>Image URL</label>
                    <input type="text" v-model="image_url" class="create-input">
                </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="submit">Submit</button>
          </div>
    
        </div>
      </div>
    </div>
</template>
    
<script>
import axios from 'axios';
import { toast } from 'vue3-toastify'
import * as bootstrap from 'bootstrap'
export default {
    name: 'NewShow',
    props: ['show'],
    data() {
        return {
            title: '',
            critics_score: null,
            audience_score: null,
            release_date: '',
            image_url: ''
        }
    },
    methods: {
        async submit() {  
            // Validate data
            let errMsg = 'The following fields are missing: ';
            let missingFields = []
            if (!this.title) {
                missingFields.push('Title')
            } 
            if (missingFields.length > 0) {
                errMsg += missingFields.join(', ')
                toast.error(errMsg, {
                    position: "top-right",
                    timeout: 5000,
                })
            } else {
                // Submit data
                // Testing - localhost url
                // let url = `http://localhost:4000/createShow`
                let url = 'https://sweng861-social-media-login.onrender.com/createShow'
                try {
                    const response = await axios.post('/createShow', {
                        title: this.title,
                        critics_score: this.critics_score,
                        audience_score: this.audience_score,
                        release_date: this.release_date,
                        image_url: this.image_url
                    })

                    if (response.data.error) {
                        toast.error(response.data.error, {
                            position: "top-right",
                            timeout: 10000,
                        })
                    } else {
                        toast.success('Show created successfully', {
                            position: "top-right",
                            timeout: 5000,
                        })
                        this.title = ''
                        this.critics_score = null
                        this.audience_score = null
                        this.release_date = ''
                        this.image_url = ''
                        const modalEl = document.getElementById('newShowModal')
                        const modalInstance = bootstrap.Modal.getInstance(modalEl)
                                            || new bootstrap.Modal(modalEl) 
                        modalInstance.hide()

                        this.$emit('refresh')
                        document.getElementById('Home')?.focus()
                    }
                } catch (error) {
                    toast.error('Error creating show', {
                        position: "top-right",
                        timeout: 10000,
                    })
                }
            }
        }
    },
}
</script>
    
<style>
    .info-form {
        height: 50%;
        width: 100%;
        /* background-color: lightgray; */
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;
    }
    
    .create-input-container label {
        margin-left: 2%;
    }
    
    .create-btns-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 50px;
        gap: 10%;
        font-weight: 700;
    }
    
    .create-input {
        height: 50px;
        width: 100%;
        background-color: white;
        color: black;
        border: 3px solid black;
        border-radius: 10px;
        padding-left: 2%;
    }
    
    .create-input-container {
        height: 70px;
        width: 90%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        font-weight: 700;
    }
    
    #newShowModal .modal-header {
        background: gray;
        color: white;
    }
    
    #newShowModal .modal-footer {
        justify-content: flex-start !important;
        background: lightgray;
        color: white;
        padding-left: calc(1rem + 5%);
    }
    
    .btn-close {
        color: white !important;
        opacity: 1 !important;
    }
    
    #newShowModal .modal-body {
        background: lightgray;
        color: black;
    }
</style>