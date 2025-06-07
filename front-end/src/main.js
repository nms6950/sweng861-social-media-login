import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Master CSS file
import './components/main.css'

// Bootstrap 5
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import 'vue3-toastify/dist/index.css'

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Choose icons you want
import { 
    faUser, 
    faHome, 
    faBars, 
    faRightFromBracket, 
    faPenToSquare,
    faTrash,
    faPlus
} from '@fortawesome/free-solid-svg-icons';
import { faVuejs } from '@fortawesome/free-brands-svg-icons';

library.add(
    faUser, 
    faHome, 
    faBars, 
    faVuejs, 
    faRightFromBracket,
    faPenToSquare,
    faTrash,
    faPlus
);

const app = createApp(App)

app.component('fa', FontAwesomeIcon);
app.use(router)

app.mount('#app')
