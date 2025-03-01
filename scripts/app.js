import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth, db } from "./firebaseconfig.js";
import { collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


const loginBtn = document.querySelector('#login-btn')
const logoutBtn = document.querySelector(".logout-btn")
const loginUser = document.querySelector('#login-user')
const userName = document.querySelector('#user-profile-name')
const userProfileImage = document.querySelector('#user-profile-img')
const div = document.querySelector(".parent")
// const readMoreBtn = document.querySelector("#readMore-btn");


onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        // console.log(uid);
        let users = await getDataFromFirestore()
        console.log(users);
        loginBtn.classList.add('d-none') //This means when a user is logged in, the login button is hidden.
        loginUser.classList.remove('d-none') //This ensures that after login, the user's profile information (name & picture) is visible instead of the login button

        userName.innerHTML = users.fullname
        userProfileImage.src = users.profileImage

    } else {
        window.location = "./login.html"
    }
});


logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location = "./login.html"
    }).catch((error) => {
        console.log(error);
    });

})

//calling data for users 
async function getDataFromFirestore() {
    let user = null
    const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        user = doc.data()
    });

    return user
}

//calling data for All blogs

let allBlogData = [];
async function getDataFromFSForBlogs() {
    const q = query(collection(db, "blogs"), orderBy("date", "desc"))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // console.log(doc.id);
        allBlogData.push(doc.data())
    });
    renderData(allBlogData)
    console.log(allBlogData);
}

getDataFromFSForBlogs()


function renderData(allBlogData) {
    div.innerHTML = ""
    allBlogData.map((item) => {
        div.innerHTML +=
        `<div class="card text-center p-3 mt-3">
            <img src="${item.profileImage}" class="profile-img mx-auto" alt="Profile">
            <h2 class ="mt-2 title mx-auto">${item.title}</h2><br>
            <div class = "d-flex justify-content-center align-items-center gap-3">
              <p class = "fw-bold mt-4">Description: ${item.description}</p>
            </div>
        </div> `
    })
}

