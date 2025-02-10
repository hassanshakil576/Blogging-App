import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { collection, addDoc , Timestamp , getDocs, query, orderBy , where ,doc, deleteDoc , updateDoc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {auth , db} from "./firebaseconfig.js"

const form = document.querySelector("#form");
const username = document.querySelector("#userName")
const displayname = document.querySelector("#displayName")
const imagePreview = document.querySelector("#imagePreview")
const profileImage = document.querySelector("#profileImage")
const addBtn = document.querySelector("#add-btn")
const div = document.querySelector(".parent")


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
            <img id="imagePreview" src="${item.profileImage}" class="profile-img mx-auto" alt="Profile"
            <h5 id="displayName" class="mt-2">${item.title}</h5>
            <div>
            <button type="button" id ="editbtn" class="btn btn-success w-25 mx-auto mt-4">Edit</button>
            <button type="button" id ="deletebtn" class="btn btn-danger  w-25 mx-auto mt-4">Delete</button>
            </div>
        </div> `
   })
   const deleteBtn = document.querySelectorAll("#deletebtn")
   const editBtn = document.querySelectorAll("#editbtn")

   deleteBtn.forEach((item , index) => {
    item.addEventListener('click', async (event) => {
      console.log("btn clicked");
      // console.log(allTodo[index]);
      await deleteDoc(doc(db, "blogs", dashboardData[index].id));
      console.log('blog deleted');
      dashboardData.splice(index, 1)
      renderData(dashboardData)
    })
  })
  
  editBtn.forEach((item, index) => {
    item.addEventListener('click', async (event) => {
      console.log("edit clicked");
      console.log(dashboardData[index]);
      const updatedTitle = prompt("Enter updated title")
      const todoRef = doc(db, "blogs", dashboardData[index].id);
      await updateDoc(todoRef, {
        title: updatedTitle,
      });
      console.log('todo updated successfully');
      dashboardData[index].title = updatedTitle
      renderData(dashboardData)
    })
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
//    displayname.innerHTML = username.value
  try {
        const docRef = await addDoc(collection(db, "blogs"), {
          title: username.value,
          profileImage: uploadPicUrl,
          date: Timestamp.fromDate(new Date()),
          uid: auth.currentUser.uid
        });
        console.log("Document written with ID: ", docRef.id);
        dashboardData.unshift({
          title: username.value,
          profileImage: uploadPicUrl,
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
})