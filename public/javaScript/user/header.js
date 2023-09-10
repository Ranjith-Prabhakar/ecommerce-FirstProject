document.addEventListener('DOMContentLoaded', () => {
    const brandButton = document.getElementById('brandButton')
    brandButton.addEventListener('click', (event) => {
        const brandBar = document.getElementById('brandBar')
        brandBar.classList.toggle('d-none')
    })
})

