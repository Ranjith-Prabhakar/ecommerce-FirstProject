document.addEventListener('DOMContentLoaded', () => {
    const brandButton = document.getElementById('brandButton')
    brandButton.addEventListener('click', (event) => {
        const brandBar = document.getElementById('brandBar')
        brandBar.classList.toggle('d-none')
    })

    // wallet 

    let wallet = document.getElementById('wallet')
    wallet.addEventListener('click', async (event) => {
        event.preventDefault()
        try {
            const response = await fetch("/wallet", { method: "post" }).then((wallet) => { return wallet.json() })
            console.log("response", response);
            if (response) {
                Swal.fire(`Cart Balance : ${response.wallet.wallet.balance}`)
            }

        } catch (error) {
            console.log(error.message);

        }
    })
})

// let data = await response.json()
// if (data.wallet) {
//     Swal.fire(`Cart Balance : ${wallet.balance}`)
// }