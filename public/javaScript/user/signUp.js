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
            console.log('inside if');

            confirm_password_label.innerText = 'password not matching'
            confirm_password_label.classList.replace('text-white', 'text-danger')

            submitButton.setAttribute('disabled', 'disabled')
        } else {
            console.log('inside else');
            confirm_password_label.innerText = confirm_password_label.getAttribute("data-value")
            confirm_password_label.classList.replace('text-danger', 'text-white')
            submitButton.removeAttribute('disabled')
        }
    })

    
})