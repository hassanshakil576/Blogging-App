import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { collection, addDoc , Timestamp , getDocs, query, orderBy , where ,doc, deleteDoc , updateDoc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {auth , db} from "./firebaseconfig.js"

const form = document.querySelector("#form");
const username = document.querySelector("#userName")
const description = document.querySelector("#description")
const div = document.querySelector(".parent")
const backBtn = document.querySelector("#backToHomePageBtn")


let uploadPicUrl = ""
let myWidget = cloudinary.createUploadWidget({
    cloudName: 'dxhncn62r', 
    uploadPreset: 'blogging-app'}, (error, result) => { 
      if (!error && result && result.event === "success") { 
        console.log('Done! Here is the image info: ', result.info); 
        uploadPicUrl = result.info.secure_url
      }
    }
  )
  
  document.getElementById("upload_widget").addEventListener("click", (event)=>{
    event.preventDefault()
    myWidget.open();
    }, false);


    let dashboardData = [];
    async function getDataFromFS(){
        const q = query(collection(db, "blogs"), orderBy("date", "desc") ,where("uid", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        dashboardData.push({...doc.data() , id: doc.id})
    })
    renderData(dashboardData)
    console.log(dashboardData);
    }


function renderData(dashboardData){
  div.innerHTML = ""
    dashboardData.map((item)=>{
        div.innerHTML += 
        `<div class="card text-center p-3 mt-3">
            <img src="${item.profileImage}" class="profile-img mx-auto" alt="Profile">
            <h2 class ="mt-2 title fw-bold mx-auto">${item.title}</h2><br>
            <p class = "fw-bold">Description: ${item.description}</p>
        </div> `
   })
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
    getDataFromFS()
  } else {
    window.location = "./login.html"
    
  }
});

form.addEventListener("submit" ,async (event)=>{
  event.preventDefault()
  console.log(username.value);
  console.log(description.value);
  
  try {
        const docRef = await addDoc(collection(db, "blogs"), {
          title: username.value,
          profileImage: uploadPicUrl,
          description: description.value,
          date: Timestamp.fromDate(new Date()),
          uid: auth.currentUser.uid
        });
        console.log("Document written with ID: ", docRef.id);
        dashboardData.unshift({
          title: username.value,
          profileImage: uploadPicUrl,
          description: description.value,
          date: Timestamp.fromDate(new Date()),
          uid: auth.currentUser.uid,
          id: docRef.id, //purpose of saving id is to delete and edit data through it.
        })
        renderData(dashboardData)
        console.log(dashboardData);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      username.value = ""
      description.value = ""
})


backBtn.addEventListener("click" , ()=>{
  window.location = "./index.html"
})