<template>
    <div class="container">
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
                <div class="sign-in-msg" v-if="signInVisible">
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
                <div class="platform" @click="googleLogin">
                    <img src="./../assets/Google_Favicon_2025.png">
                    <label>Google</label>
                </div> 
                <div class="platform" @click="linkedinLogin">
                    <img src="./../assets/linkedin_logo.png">
                    <label>LinkedIn</label>
                </div>
            </div>
        </div>
        <div class="metaData">
            <span>Nathan Schweikhart // SWENG 861 // Summer 2025</span>
        </div>
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
    width: 90%;
    /* background-color: lightgray; */
    border: 5px solid gray;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 5%;
}

.platform {
    width: 50%;
    height: 100px;
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
    width: 50px;
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
export default {
    name: 'Login',
    data() {
        return {
            username: '',
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
            window.location.href = 'https://sweng861-social-media-login.onrender.com/auth/google';
        },
        linkedinLogin() {
            window.location.href = 'https://sweng861-social-media-login.onrender.com/auth/linkedin';
        }
    },
    mounted() {
        this.generateIntervals();
        setInterval(() => {
            this.flicker = !this.flicker;
        }, 500)
        setInterval(() => {
            this.generateIntervals();
        }, 10000)
    }
}
</script>