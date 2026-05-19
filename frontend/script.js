const loginForm=document.querySelector("#login-form");
const registrationForm=document.querySelector("#register-form");
const showRegister=document.querySelector("#show-register");
const showLogin=document.querySelector("#show-login");
const fullname=document.querySelector("#reg-name");
const password=document.querySelector("#reg-password");
const newpassword=document.querySelector("#reg-confirm");
const message=document.querySelector("#message");
const reGemail=document.querySelector("#reg-email");
showRegister.addEventListener("click",()=>{
    loginForm.classList.add("hide");
    registrationForm.classList.remove("hide");
});
showLogin.addEventListener("click",()=>{
    registrationForm.classList.add("hide");
    loginForm.classList.remove("hide");
});
registrationForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(fullname.value=== ""){
        message.textContent = "Please enter your full name.";
        message.style.color = "red";
    } else if(password.value.length < 6){
        message.textContent = "Password must be at least 6 characters long.";
        message.style.color = "red";
    } else if(password.value !== newpassword.value){
        message.textContent = "Passwords do not match.";
        message.style.color = "red";
    } else {
        fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullname: fullname.value,
                email: reGemail.value,
                password: password.value
            })
        })
        .then(response => response.json())
        .then(data=>{
            message.textContent = data.message;
            message.style.color="green";
        })
        .catch(error => {
            message.textContent = "An error occurred. Please try again.";
            message.style.color = "red";
        });
    }
});
loginForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const email=document.querySelector("#login-email").value;
    const password=document.querySelector("#login-password").value;
    const loginMessage=document.querySelector("#login-message");
    fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())  
    .then(data => {
        if(data.message === "Login successful!") {
            window.location.href = "dashboard.html";
        } else {
            loginMessage.textContent = data.message;
            loginMessage.style.color = "red";
        }
    })
    .catch(error => {
        loginMessage.textContent = "An error occurred. Please try again.";
        loginMessage.style.color = "red";
    });
});

