document.addEventListener("DOMContentLoaded", () => {

    let addressEdit = document.getElementsByClassName('addressEdit')
    for (let i = 0; i < addressEdit.length; i++) {

        addressEdit[i].addEventListener('click', (event) => {
            event.preventDefault()

            // let addressForm = document.forms['addressList' + (addressEdit.length - 1 - i)];
            let addressForm = document.forms['addressList' + i];
            let formElements = addressForm.elements;

            for (let j = 0; j < formElements.length; j++) {
                if (formElements[j].hasAttribute('readonly')) {
                    addressEdit[i].innerText = "Cancell"
                    formElements[j].removeAttribute('readonly');

                    // let siblingElement = addressEdit[i].nextElementSibling;

                    // while (siblingElement) {
                    //     if (siblingElement.classList.contains('updateAddress')) {
                    //          break;
                    //     }
                    //     siblingElement = siblingElement.nextElementSibling;
                    // }
                    // siblingElement.classList.toggle('d-none')
                    if (formElements[j].classList.contains("updateAddress")) {
                        formElements[j].classList.toggle('d-none')
                    }
                } else {
                    formElements[j].value = formElements[j].getAttribute('data-original-value')
                    formElements[j].setAttribute('readonly', 'true');
                    addressEdit[i].innerText = "Edit"
                    if (formElements[j].classList.contains("updateAddress")) {
                        formElements[j].classList.toggle('d-none')
                    }
                }
            }
        })
    }

    document.addEventListener('click', (event) => {
        let updateAddress = document.getElementsByClassName('updateAddress')

        for (let i = 0; i < updateAddress.length; i++) {
            updateAddress[i].addEventListener('click', async (event) => {
                event.preventDefault()
                let addressForm = document.forms['addressList' + i]

                let newAddressForm = new FormData(addressForm)
                let newAddressFormData = {}

                for (let [key, value] of newAddressForm.entries()) {
                    newAddressFormData[key] = value
                }

                console.log(newAddressFormData);
                try {
                    let response = await fetch('/editAddress', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            newAddressFormData,
                            index: i
                        })
                    })
                    let data = await response.json()
                    if (data.success) {
                        window.location.reload()

                    }
                } catch (error) {
                    console.log(error.message);
                }

                console.log(addressForm);


            })
        }
    })


    //create new address(its only for toggling the buttons)

    let createNewAddress = document.getElementById('createNewAddress')
    createNewAddress.addEventListener("click", (event) => {
        event.preventDefault()
        let formData = document.getElementById('formData')
        formData.classList.toggle('d-none')
        let createButton = document.getElementById('create')
        createButton.classList.toggle('d-none')
        if (createNewAddress.innerText === "Create New Address") {
            createNewAddress.innerText = "Cancell"
        } else {

            createNewAddress.innerText = "Create New Address"
            window.location.reload()

        }

    })




    // delete address ============
    let addressDelete = document.getElementsByClassName('addressDelete')
    for (let i = 0; i < addressDelete.length; i++) {
        addressDelete[i].addEventListener('click', async (event) => {
            event.preventDefault()
            let data_objectId = addressDelete[i].getAttribute('data-objectId')
            console.log(data_objectId);

            try {
                let response = await fetch('/deleteAddress', {
                    method: 'post',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({
                        objectId: data_objectId
                    })
                })
                let data = await response.json()
                if (data.success) {
                    window.location.reload()
                }
            } catch (error) {
                console.log(error.message);
            }

        })
    }





    //create adddress (real )


    let createAddress = document.forms.createAddress
    createAddress.addEventListener('submit', async (event) => {
        event.preventDefault();
        let newAddressForm = new FormData(createAddress);
        let formDataObject = {};

        // Convert the FormData object to a JavaScript object
        for (let [key, value] of newAddressForm.entries()) {
            formDataObject[key] = value;
        }

        try {
            let response = await fetch('/createAddress', {
                method: 'post',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    formDataObject
                })

            })

            let data = await response.json()
            if (data.success) {
                window.location.reload()
            }
        } catch (error) {
            console.log(error.message);
        }

    });


    //radio button 
    const radioButtons = document.querySelectorAll('input[name="selectAddress"]');

    radioButtons.forEach((radioButton) => {
        radioButton.addEventListener('change', (event) => {
            if (event.target.checked) {
                // Deselect all other radio buttons
                radioButtons.forEach((rb) => {
                    if (rb !== event.target) {
                        rb.checked = false;
                    }
                });
            }
        });
    });


    ///order placement

    const placeOrder = document.querySelectorAll('input[name="paymentMethod"]')
    let address_confirm = false
    let newFormData = {}
    const paymentOptionForm = document.forms.paymentOption
    paymentOptionForm.addEventListener('submit', async (event) => {
        event.preventDefault()
        for (let i = 0; i < radioButtons.length; i++) { // radioButtons is the variable created above
            if (radioButtons[i].checked === true) {

                for (let j = 0; j < placeOrder.length; j++) {
                    if (placeOrder[j].checked === true) {
                        let formData = document.forms["addressList" + i]
                        let formObject = new FormData(formData)
                        for (let [key, value] of formObject) {
                            newFormData[key] = value
                        }
                        newFormData.modeOfPayment = placeOrder[j].id
                    }

                }
                if (!newFormData.country) {
                    alert("select a payment mode ")
                    address_confirm = true
                    break;
                }
            }
        }
        if (!address_confirm) {
            alert("select an address for deliver ")

        } else {

            ///here i have to retreive the product data and have to create route ,controller update db and have to redirect or show a order confirmation here
            /// modal has updated for user 
        }


    })

})