import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {auth , db} from "./firebaseconfig.js"

const form = document.querySelector("#form")
const fullname = document.querySelector("#fullname")
const email = document.querySelector("#email")
const password = document.querySelector("#password")

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
    event.stopPropagation()
    myWidget.open();
    }, false);




form.addEventListener("submit" , (event)=>{
    event.preventDefault()
    console.log(fullname.value);
    console.log(email.value);
    console.log(password.value);

    createUserWithEmailAndPassword(auth, email.value, password.value)
  .then( async (userCredential) => {
    const user = userCredential.user;
    console.log(user);

    try {
      const docRef = await addDoc(collection(db, "users"), {
        fullname: fullname.value,
        email: email.value,
        // password: password.value, (we donot save password in database)
        profileImage: uploadPicUrl,
        uid: user.uid
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    
  })
  .catch((error) => {
    const errorMessage = error.message;
    console.log(errorMessage);
  });
})