<template>
    <div class="container">
        <div class="welcome-msg">
            >> {{ visibleWelcomeMsg }}
            <div class="terminal-box" :class="flicker ? 'visible' : 'hidden'"></div>
        </div>
        <div class="form">
            
        </div>
    </div>
</template>

<style>
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
}

.welcome-msg {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    font-weight: 900;
    font-family: 'Courier New, Courier, monospace';
    font-size: 40px;
    width: 27.5vw;
}

.visible {
    visibility: visible;
    border-bottom: 4px solid black; 
}

.hidden {
    visibility: hidden;
}

.terminal-box {
    width: 25px;
    height: 70%;
}

.form {
    height: 50vh;
    width: 30vw;
    background-color: lightgray;
    border: 5px solid gray;
    border-radius: 10px;
}
</style>

<script>
export default {
    name: 'Login',
    data() {
        return {
            username: '',
            password: '',
            welcomeMsgWhole: 'Welcome! Please sign in...',
            visibleWelcomeMsg: '',
            flicker: true
        }
    },
    methods: {

    },
    mounted() {
        this.visibleWelcomeMsg = ''
        setInterval(() => {
            if (this.visibleWelcomeMsg.length === this.welcomeMsgWhole.length) {
                return;
            }
            let index = this.visibleWelcomeMsg.length;
            this.visibleWelcomeMsg += this.welcomeMsgWhole[index];
        }, 100)
        setInterval(() => {
            this.flicker = !this.flicker;
        }, 500)
        setInterval(() => {
            this.visibleWelcomeMsg = '';
        }, 10000)
    }
}
</script>