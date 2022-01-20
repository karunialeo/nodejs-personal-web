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

function toggleConfirmVisibility() {
    const confirmPassword = document.getElementById('confirmPassword')
    const toggleButton = document.getElementById('toggleVisibleConfirm')
    const toggleIcon = document.getElementById('toggleVisibilityIconConfirm')
    
    
    toggleButton.addEventListener('click', () => {
        toggleIcon.classList.toggle('bi-eye-slash-fill')
        toggleIcon.classList.toggle('bi-eye-fill')
        if(confirmPassword.type === 'password') {
            confirmPassword.type = 'text'
        } else {
            confirmPassword.type = 'password'
        }
    })
}

togglePasswordVisibility()
toggleConfirmVisibility()