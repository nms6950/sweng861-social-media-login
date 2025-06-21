<template>
    <div class="container" id="Login">
        <div class="left-panel">
            <div class="msgs">
                <div class="welcome-msg">
                    >> {{ visibleWelcomeMsg }}
                    <div 
                    class="terminal-box" 
                    :class="flicker ? 'visible' : 'hidden'"
                    v-if="!signInVisible"
                    >_</div>
                </div>
                <div class="sign-in-msg" v-if="signInVisible" id="sign-in-msg">
                    >> {{ visibleSignInMsg }}
                    <div 
                      class="terminal-box" 
                      :class="flicker ? 'visible' : 'hidden'"
                      v-if="!thirdRowVisible"
                    >_</div>
                </div>
                <div class="sign-in-msg" v-if="thirdRowVisible">
                    >>
                    <div class="terminal-box" :class="flicker ? 'visible' : 'hidden'">_</div>
                </div>
            </div>
            <div class="form">
                <div class="login-input-container">
                    <label>Email</label>
                    <input type="text" placeholder="Email" v-model="email" class="login-input">
                </div>

                <div class="login-input-container">
                    <label>Password</label>
                    <input type="password" placeholder="Password" v-model="password" class="login-input">
                </div>

                <div class="login-btns-container">
                    <button class="btn btn-primary" @click="submit">Login</button>
                    <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#createAccountModal">Create Account</button>
                </div>

                <hr />
                <!-- <input type="text" placeholder="Username" v-model="username" class="login-input">
                <input type="password" placeholder="Password" v-model="password" class="login-input"> -->
                <div class="platforms">
                    <div class="platform" @click="googleLogin" id="googleBtn">
                        <img src="./../assets/Google_Favicon_2025.png">
                        <label>Google</label>
                    </div> 
                    <div class="platform" @click="linkedinLogin" id="linkedinBtn">
                        <img src="./../assets/linkedin_logo.png">
                        <label>LinkedIn</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="metaData">
            <span>Nathan Schweikhart // SWENG 861 // Summer 2025</span>
        </div>
        <CreateAccount></CreateAccount>
    </div>
</template>

<style>
@import url('https://fonts.cdnfonts.com/css/bubble-letters');

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 5vh;
    height: 100% !important;
    width: 100% !important;
    background-image: url('./../assets/login_image.jpg');
    max-width: none !important;
    position: relative;
}

.metaData {
    position: absolute;
    top: 0;
    left: 0;
    background-color: black;
    border-bottom: 2px white solid;
    color: white;
    text-align: left;
    padding-left: 10px;
    font-weight: 500;
    width: 36vw;
    height: 40px;
    visibility: hidden;
}
.login-input {
    height: 50px;
    width: 100%;
    background-color: lightgray;
    border: 3px solid black;
    border-radius: 10px;
    padding-left: 2%;
}

.login-input-container label {
    margin-left: 2%;
}

.login-input-container {
    height: 70px;
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-weight: 700;
}

hr {
    color: black !important;
    border-width: 3px !important;
    width: 65%;
    border-color: black !important;
    /* border-top: 5px black solid !important; */
    opacity: 1 !important;
}

.login-btns-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    gap: 10%;
    font-weight: 700;
}

.login-btns-container button {  
    min-width: 20%;
}

.left-panel {
    background-color: gray;
    position: absolute;
    left: 0;
    top: 0;
    width: 37vw;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 5%;
    border-right: 5px whitesmoke solid;
    gap: 5%;
}

.msgs {
    height: 20%;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-self: center;
    flex-direction: column;
    gap: 10px;
    width: 92%;
    background-color: black;
    border: 3px white solid;
    padding: 3%;
    border-radius: 10px;
}

.welcome-msg {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    font-weight: 900;
    /* font-family: 'Bubble Letters', sans-serif; */
    font-family: monospace;
    font-size: 1em;
    color: white;
}

.sign-in-msg {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    font-weight: 900;
    /* font-family: 'Bubble Letters', sans-serif; */
    font-family: monospace;
    font-size: 1em;
    color: white;
}

.visible {
    visibility: visible;
    /* border-bottom: 2px solid black;  */
}

.hidden {
    visibility: hidden;
}

.terminal-box {
    width: 10px;
    height: 70%;
}

.form {
    height: 50%;
    width: 100%;
    /* background-color: lightgray; */
    border: 5px solid gray;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 5%;
}

.platforms {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    gap: 10px;
    width: 100%;
}

.platform {
    width: 30%;
    height: 75px;
    border-radius: 50px;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    cursor: pointer;
    border: 2px black solid;
}

.platform img {
    /* height: 75px; */
    width: 30px;
}

.platform:hover {
    opacity: 0.7;
}

.platform label {
    font-size: 20px;
    font-weight: 700;
}
</style>

<script>
import CreateAccount from './CreateAccount.vue'
import axios from 'axios';
import { toast } from 'vue3-toastify'
export default {
    name: 'Login',
    components: {
        CreateAccount
    },
    data() {
        return {
            email: '',
            password: '',
            welcomeMsgWhole: 'Welcome!',
            signInMsgWhole: 'How would you like to sign in today?',
            visibleSignInMsg: '',
            visibleWelcomeMsg: '',
            flicker: true,
            welcomeInterval: null,
            signInInterval: null,
            signInVisible: false,
            thirdRowVisible: false,
            clientID: ''
        }
    },
    methods: {
        generateIntervals() {
            this.visibleWelcomeMsg = ''
            this.visibleSignInMsg = ''
            this.signInVisible = false;
            this.thirdRowVisible = false;

            clearInterval(this.welcomeInterval);
            clearInterval(this.signInInterval);

            this.welcomeInterval = setInterval(() => {
                if (this.visibleWelcomeMsg.length === this.welcomeMsgWhole.length) {
                    return;
                }
                let index = this.visibleWelcomeMsg.length;
                this.visibleWelcomeMsg += this.welcomeMsgWhole[index];
            }, 100)

            setTimeout(() => {
                this.signInVisible = true;
                this.signInInterval = setInterval(() => {
                    if (this.visibleSignInMsg.length === this.signInMsgWhole.length) {
                        this.thirdRowVisible = true;
                        return;
                    }
                    let index = this.visibleSignInMsg.length;
                    this.visibleSignInMsg += this.signInMsgWhole[index];
                }, 100)
            }, 2000)
        },
        googleLogin() {
            window.location.href = 'https://sweng861-nms6950-ashtchgecph5gkdx.eastus2-01.azurewebsites.net/auth/google';
        },
        linkedinLogin() {
            window.location.href = 'https://sweng861-nms6950-ashtchgecph5gkdx.eastus2-01.azurewebsites.net/auth/linkedin';
        },
        async submit() {  
            // Validate data
            let errMsg = 'The following fields are missing: ';
            let missingFields = []
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
                // Testing - localhost url
                //let url = `http://localhost:4000/login`
                const baseURL = import.meta.env.DEV ? 'http://localhost:4000' : '';
                console.log(baseURL)
                try {
                    const response = await axios.post(`${baseURL}/login`, {
                        email: this.email,
                        password: this.password
                    })

                    if (response.data.error) {
                        toast.error(response.data.error, {
                            position: "top-right",
                            timeout: 10000,
                        })
                    } else {
                        this.$router.push('/home')
                    }
                } catch (error) {
                    toast.error('Error logging in', {
                        position: "top-right",
                        timeout: 10000,
                    })
                }
            }
        },
        init() {
            this.generateIntervals();
            setInterval(() => {
                this.flicker = !this.flicker;
            }, 500)
            setInterval(() => {
                this.generateIntervals();
            }, 10000)
        }
    },
    mounted() {
        this.init();
    }
}
</script>