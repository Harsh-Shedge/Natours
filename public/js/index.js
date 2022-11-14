import { login } from './login';
import '@babel/polyfill';
import { displayMap } from './leaflet';
import { logout } from './login';
import { updateSettings } from './updateSettings';
import { signup } from './signup';

// DOM ELEMENTS
const leaflet = document.getElementById('map');

const logoutBtn = document.querySelector('.nav__el--logout');

const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const signupForm = document.querySelector('.form--signup');

if (leaflet) {
  const locations = JSON.parse(
    document.getElementById('map')?.dataset.locations
  );

  displayMap(locations);
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

document.querySelector('.form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email')?.value;
  const password = document.getElementById('password')?.value;

  const name = document.getElementById('name')?.value;
  if (!name) {
    login(email, password);
  }
});

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name')?.value);
    form.append('email', document.getElementById('email')?.value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });
}
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current')?.value;
    const password = document.getElementById('password')?.value;
    const passwordConfirm = document.getElementById('password-confirm')?.value;
    updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    signup(name, email, password, confirmPassword);
  });
}
