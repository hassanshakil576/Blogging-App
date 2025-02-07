import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth } from "./firebaseconfig.js";



const form = document.querySelector('#form');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const fullname = document.querySelector("#fullname")


form.addEventListener('submit', event => {
    event.preventDefault()
    console.log(email.value);
    console.log(password.value);
    console.log(fullname.value);
    

    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location = "./index.html"
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage)
        });

})