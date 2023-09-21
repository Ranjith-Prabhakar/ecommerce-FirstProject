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
            console.log("response", response);
            if (response) {

                let walletMoneyBalance = document.getElementById("walletMoneyBalance")
                console.log('walletMoneyBal', walletMoneyBalance);
                walletMoneyBalance.innerText = response.wallet[0].wallet.balance


                // Swal.fire(
                //     `Balance In Your Wallet : ${response.wallet[0].wallet.balance}`)

                // Swal.fire({
                //     title: `Balance In Your Wallet : ${response.wallet[0].wallet.balance}`,
                //     icon: 'info',
                //     html: '<button id="addMoneyToWallet" type="button" class= "btn btn-primary text-white" >Add Money To Wallet</button>'
                //         + '<form action="" name="addWalletMoney" class="d-none mt-2 ">' +
                //         '<input class="form-control mt-1 " type="text" name="accountNo" placeholder="Account Number">' +
                //         '<input class="form-control mt-1 " type="text" name="ifsc" placeholder="IFSC">' +
                //         '<input class="form-control mt-1 " type="text" name="amount" placeholder="Amount">' +
                //         '<input class="form-control mt-1 " type="text" name="branch" placeholder="Branch">' +
                //         '<input class="form-control mt-1 " type="text" name="uId" placeholder="UID">' +
                //         '<input type="submit" class="btn btn-success mt-1 " >' +
                //         '</form>',


                // showCloseButton: true,
                // showCancelButton: true,
                // focusConfirm: false,
                // confirmButtonText:
                //     '<i class="fa fa-thumbs-up"></i> Great!',
                // confirmButtonAriaLabel: 'Thumbs up, great!',
                // cancelButtonText:
                //     '<i class="fa fa-thumbs-down"></i>',
                // cancelButtonAriaLabel: 'Thumbs down'
                // })
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
            console.log("newFormData", newFormData);
            const response = await fetch('/addWalletMoney', {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ newFormData })
            })

            let data = await response.json()
            if (data.success) {
                console.log(data);
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

