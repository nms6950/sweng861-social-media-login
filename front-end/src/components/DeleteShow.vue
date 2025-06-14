<template>
    <div class="modal fade" id="deleteConfirmationModal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          
          <div class="modal-header">
            <h5 class="modal-title" id="myModalLabel">Delete Show Confirmation</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          
          <div class="modal-body" v-if="show">
            <span>Are you sure you want to delete show with title <strong style="color: maroon">{{show.title}}</strong>?</span>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="submit">Delete</button>
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

        }
    },
    methods: {
        async submit() {  
            // Submit data
            // Testing - localhost url
            // let url = `http://localhost:4000/deleteShow/${this.show.id}`
            let url = `https://sweng861-social-media-login.onrender.com/deleteShow/${this.show.id}`
            try {
                const response = await axios.delete(url)

                if (response.data.error) {
                    toast.error(response.data.error, {
                        position: "top-right",
                        timeout: 10000,
                    })
                } else {
                    toast.success('Show deleted successfully', {
                        position: "top-right",
                        timeout: 5000,
                    })
                    this.$emit('refresh')
                    const modalEl = document.getElementById('deleteConfirmationModal')
                    const modalInstance = bootstrap.Modal.getInstance(modalEl)
                                        || new bootstrap.Modal(modalEl)
                    modalInstance.hide()

                    document.getElementById('Home')?.focus()
                }
            } catch (error) {
                toast.error('Error deleting account', {
                    position: "top-right",
                    timeout: 10000,
                })
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
    
    #deleteConfirmationModal .modal-header {
        background: maroon;
        color: white;
    }
    
    #deleteConfirmationModal .modal-footer {
        justify-content: flex-start !important;
        background: lightpink;
        color: white;
        padding-left: calc(1rem + 5%);
    }
    
    .btn-close {
        color: white !important;
        opacity: 1 !important;
    }
    
    #deleteConfirmationModal .modal-body {
        background: lightpink;
        color: black;
    }
</style>