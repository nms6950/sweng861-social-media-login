<template>
<div class="modal fade" id="createAccountModal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      
      <div class="modal-header">
        <h5 class="modal-title" id="myModalLabel">Create Account</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      
      <div class="modal-body">
        <div class="info-form">
            <div class="create-input-container">
                <label>Name</label>
                <input type="text" placeholder="Full Name" v-model="name" class="create-input">
            </div>

            <div class="create-input-container">
                <label>Email</label>
                <input type="text" placeholder="Email" v-model="email" class="create-input">
            </div>

            <div class="create-input-container">
                <label>Password</label>
                <input type="password" placeholder="Password" v-model="password" class="create-input">
            </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" @click="submit" data-bs-dismiss="modal">Submit</button>
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
    name: 'CreateAccount',
    data() {
        return {
            name: '',
            email: '',
            password: ''
        }
    },
    methods: {
       async submit() {  
            // Validate data
            let errMsg = 'The following fields are missing: ';
            let missingFields = []
            if (!this.name) {
                missingFields.push('Name')
            } 
            if (!this.email) {
                missingFields.push('Email')
            }
            if (!this.password) {
                missingFields.push('Password')
            }
            if (missingFields.length > 0) {
                errMsg += missingFields.join(', ')
                toast.error(errMsg, {
                    position: "top-right",
                    timeout: 5000,
                })
            } else {
                // Submit data
                try {
                    const response = await axios.post('/createAccount', {
                        name: this.name,
                        email: this.email,
                        password: this.password
                    })

                    if (response.data.error) {
                        toast.error(response.data.error, {
                            position: "top-right",
                            timeout: 10000,
                        })
                    }

                    if (response.status === 201) {
                        toast.success('Account created successfully', {
                            position: "top-right",
                            timeout: 5000,
                        })
                        this.name = ''
                        this.email = ''
                        this.password = ''
                        const modalEl = document.getElementById('createAccountModal')
                        const modalInstance = bootstrap.Modal.getInstance(modalEl)
                                            || new bootstrap.Modal(modalEl)
                        modalInstance.hide()

                        document.getElementById('Login')?.focus()
                    } 
                } catch (error) {
                    toast.error('Error creating account', {
                        position: "top-right",
                        timeout: 10000,
                    })
                }
            }
        }
    }
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

#createAccountModal .modal-header {
    background: gray;
    color: white;
}

#createAccountModal .modal-footer {
    justify-content: flex-start !important;
    background: lightgray;
    color: white;
    padding-left: calc(1rem + 5%);
}

.btn-close {
    color: white !important;
    opacity: 1 !important;
}

#createAccountModal .modal-body {
    background: lightgray;
    color: black;
}
</style>