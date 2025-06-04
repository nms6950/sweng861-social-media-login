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
        <button type="button" class="btn btn-primary">Submit</button>
      </div>

    </div>
  </div>
</div>
</template>

<script>
export default {
    name: 'CreateAccount',
    data() {
        return {
            name: '',
            email: '',
            password: ''
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