function togglePasswordVisibility() {
    const inputPassword = document.getElementById('inputPassword')
    const toggleButton = document.getElementById('toggleVisiblePassword')
    const toggleIcon = document.getElementById('toggleVisibilityIcon')
    
    
    toggleButton.addEventListener('click', () => {
        toggleIcon.classList.toggle('bi-eye-slash-fill')
        toggleIcon.classList.toggle('bi-eye-fill')
        if(inputPassword.type === 'password') {
            inputPassword.type = 'text'
        } else {
            inputPassword.type = 'password'
        }
    })
}

togglePasswordVisibility()