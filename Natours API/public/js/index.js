import { login, logout } from './login';
import { displayMap } from './mapbox';
import "@babel/polyfill";

const map = document.getElementById('map');
if (map) {
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
    displayMap(locations);
}

const loginForm = document.querySelector('.form');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login({ email, password });
    });
}

const logoutBtn = document.querySelector('.nav__el--logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}