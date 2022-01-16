function submitData() {
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const number = document.getElementById('number').value
    const skill = document.querySelector('[name="skill"]:checked').value
    const subject = document.getElementById('subject').value
    const message = document.getElementById('message').value

    const redirectMessage = document.getElementById('form-redirect')

    const alertMessage = new bootstrap.Modal(document.getElementById('alertMessage'))

    if(name == '' || number == '' || skill == '' || subject == '' || message == '') {
        alertMessage.show()
    } else {
        const emailReceiver = 'karunialeo@mail.com'
        const nameReceiver = 'Karunia Leo Gultom'
        const a = document.createElement('a')
        a.href = `mailto:${emailReceiver}?subject=${subject}&body=Hi, ${nameReceiver}!%0AMy name is ${name}%0A%0A${message}%0A%0APlease call me on ${number}.%0AYou can also contact me through ${email}.%0AThank you.`

        function toggleRedirect() {
            redirectMessage.classList.toggle("d-none")
        }
        toggleRedirect()
        setTimeout(toggleRedirect, 5000)

        a.click()
        
        let dataObject = {
            name,
            email,
            number,
            skill,
            subject,
            message,
        }

        console.log(dataObject)

    }
    
}

function onlyOne(checkbox) {
    const checkboxes = document.getElementsByName('skill')
    const defaultCB = document.querySelector('.cb-hidden')
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false
        if (checkbox.checked == false) defaultCB.checked = true
    })
}

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})