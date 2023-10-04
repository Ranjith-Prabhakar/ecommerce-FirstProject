document.addEventListener('DOMContentLoaded', (event) => {
    //password matching

    let confirmPassword = document.getElementById('Confirm_Password')

    confirmPassword.addEventListener('change', (event) => {
        event.preventDefault()
        let password = document.getElementById('password')
        let passwordValue = password.value
        let confirmPasswordValue = confirmPassword.value
        let confirm_password_label = document.getElementById('confirm_password_label')
        let submitButton = document.getElementById("submitButton")
        if (passwordValue !== confirmPasswordValue) {
            confirm_password_label.innerText = 'password not matching'
            confirm_password_label.classList.replace('text-white', 'text-danger')
            submitButton.setAttribute('disabled', 'disabled')
        } else {
            confirm_password_label.innerText = confirm_password_label.getAttribute("data-value")
            confirm_password_label.classList.replace('text-danger', 'text-white')
            submitButton.removeAttribute('disabled')
        }
    })

    //email checking

    let email = document.getElementById("email")
    email.addEventListener('change', async (e) => {
        e.preventDefault()
        try {
            let response = await fetch('/checkMail', {
                method: 'post',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({ email: email.value })
            });
            
            if (response.ok) { // Check if the response status is OK (status code 200)
                let result = await response.json(); // Parse the JSON response
                
                if (result.mailExist) {
                    let emailLabel = document.getElementById('emailLabel')
                    emailLabel.innerText = "email already exists"

                    emailLabel.classList.replace('text-white','text-danger')
                }
            } else {
                console.log('Response not OK');
            }
        } catch (error) {
            console.log(error.message)
        }
    });
    
})