document.addEventListener('DOMContentLoaded', () => {
    const brandButton = document.getElementById('brandButton')
    brandButton.addEventListener('click', (event) => {
        const brandBar = document.getElementById('brandBar')
        brandBar.classList.toggle('d-none')
    })

    // wallet 

    let wallet = document.getElementById('walletInNav')
    wallet.addEventListener('click', async (event) => {
        event.preventDefault()
        try {
            const response = await fetch("/wallet", { method: "post" }).then((wallet) => { return wallet.json() })
            if (response) {

                let walletMoneyBalance = document.getElementById("walletMoneyBalance")
                walletMoneyBalance.innerText = response.wallet[0].wallet.balance
            }

        } catch (error) {
            console.log(error.message);

        }
    })

    //click on add money
    document.addEventListener("click", event => {
        let addMoneyToWallet = document.getElementById('addMoneyToWallet');
        if (addMoneyToWallet) {
            addMoneyToWallet.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                let addWalletMoney = document.forms.addWalletMoney
                addWalletMoney.classList.toggle('d-none')
                addMoneyToWallet.classList.add('d-none')
            });
        }
    });

    // add to wallet form submission
    let addWalletMoney = document.forms.addWalletMoney
    addWalletMoney.addEventListener('submit', async (event) => {
        event.preventDefault()
        let formData = new FormData(addWalletMoney)
        let newFormData = {}
        for (let [key, value] of formData.entries()) {
            newFormData[key] = value
        }
        try {
            const response = await fetch('/addWalletMoney', {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ newFormData })
            })

            let data = await response.json()
            if (data.success) {
                Swal.fire(
                    `Your current wallet balance is : ${data.wallet[0].wallet.balance}`)
                setTimeout(() => {
                    window.location.reload()
                }, 2000)

            }
        } catch (error) {
            console.log(error.message);

        }
    })


})

