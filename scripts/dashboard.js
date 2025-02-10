const form = document.querySelector("#form");
const username = document.querySelector("#userName")
const displayname = document.querySelector("#displayName")
const imagePreview = document.querySelector("#imagePreview")
const profileImage = document.querySelector("#profileImage")
form.addEventListener("submit" , (event)=>{
   event.preventDefault()
   console.log(username.value);
   displayname.innerHTML = username.value

   const file = profileImage.files[0]; // Get the uploaded file
   if (file) {
       imagePreview.src = URL.createObjectURL(file); // Generate temporary URL for preview
   } else {
       imagePreview.src = ""; // Reset image if no file is uploaded
   }
// console.log(profileImage.files[0])
})