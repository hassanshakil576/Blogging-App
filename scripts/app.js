import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth, db } from "./firebaseconfig.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


const loginBtn = document.querySelector('#login-btn')
const loginUser = document.querySelector('#login-user')
const userName = document.querySelector('#user-profile-name')
const userProfileImage = document.querySelector('#user-profile-img')



onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid);
        let users = await getDataFromFirestore()
        console.log(users);
        loginBtn.classList.add('d-none') //This means when a user is logged in, the login button is hidden.
        loginUser.classList.remove('d-none') //This ensures that after login, the user's profile information (name & picture) is visible instead of the login button

        userName.innerHTML = users.fullname

        userProfileImage.src = users.profileImage

    } else {
        window.location = "login.html"
    }
});


async function getDataFromFirestore() {
    let user = null
    const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        user = doc.data()
    });

    return user
}


