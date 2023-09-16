document.addEventListener("DOMContentLoaded", () => {


    //single product increament
    let increamentButton = document.getElementById('increament')
    console.log("increamentButton", increamentButton);
    let orderQuantity = document.querySelector('button[name="orderQuantity"]');
    if (increamentButton) {
        increamentButton.addEventListener('click', async (event) => {
            event.preventDefault()
            let increase = parseInt(orderQuantity.innerText)
            console.log("increase", increase);
            let data_stock_availability = orderQuantity.getAttribute("data-stock-availability")
            increase++
            if (parseFloat(data_stock_availability) >= increase) {
                orderQuantity.innerText = increase
                let singleProductUnitPrice = document.getElementById('singleProductUnitPrice')
                let productPrice = orderQuantity.getAttribute('data-product-price')

                singleProductUnitPrice.innerText = increase * parseInt(productPrice)

            }
        })
    }

    //single product decreament
    let decreamentButton = document.getElementById('decreament')
    console.log("decreamentButton", decreamentButton);
    if (decreamentButton) {
        decreamentButton.addEventListener('click', async (event) => {
            event.preventDefault()
            let decrease = parseInt(orderQuantity.innerText);// took from above
            decrease--
            console.log("decrease", decrease);
            // let data_stock_availability = orderQuantity.getAttribute("data-stock-availability")

            if (decrease > 0) {
                orderQuantity.innerText = decrease
                let singleProductUnitPrice = document.getElementById('singleProductUnitPrice')
                let productPrice = orderQuantity.getAttribute('data-product-price')
                singleProductUnitPrice.innerText = decrease * parseInt(productPrice)
            }
        })
    }


    // 
    let addressEdit = document.getElementsByClassName('addressEdit')
    for (let i = 0; i < addressEdit.length; i++) {

        addressEdit[i].addEventListener('click', (event) => {
            event.preventDefault()
            let addressForm = document.forms['addressList' + i];
            let formElements = addressForm.elements;

            for (let j = 0; j < formElements.length; j++) {
                if (formElements[j].hasAttribute('readonly')) {
                    addressEdit[i].innerText = "Cancell"
                    formElements[j].removeAttribute('readonly');
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

    // const placeOrder = document.querySelectorAll('input[name="paymentMethod"]')

    // const paymentOptionForm = document.forms.paymentOption

    // console.log("paymentOptionForm", paymentOptionForm);
    // paymentOptionForm.addEventListener('submit', async (event) => {
    //     event.preventDefault()
    //     let newFormData = {}
    //     for (let i = 0; i < radioButtons.length; i++) { // radioButtons is the variable created above
    //         if (radioButtons[i].checked === true) {

    //             for (let j = 0; j < placeOrder.length; j++) {
    //                 let formData = document.forms["addressList" + i]
    //                 let formObject = new FormData(formData)
    //                 for (let [key, value] of formObject) {
    //                     newFormData[key] = value
    //                 }
    //                 if (placeOrder[j].checked === true) {


    //                     newFormData.modeOfPayment = placeOrder[j].id
    //                     newFormData.productData = []
    //                     newFormData.total = 0
    //                     if (increamentButton) {//took from above
    //                         let productId = orderQuantity.getAttribute("data-productId")
    //                         let singleProductUnitPrice = document.getElementById('singleProductUnitPrice')
    //                         let productPrice = parseFloat(singleProductUnitPrice.innerText)
    //                         let order_Quantity = parseFloat(orderQuantity.innerText)
    //                         newFormData.productData[0] = {
    //                             productId: productId,
    //                             price: productPrice,
    //                             orderQuantity: order_Quantity
    //                         }
    //                         newFormData.total = productPrice

    //                     } else {
    //                         let productList = document.getElementsByClassName('productList')

    //                         for (i = 0; i < productList.length; i++) {
    //                             let head4 = document.getElementById('orderQuantity' + i)
    //                             newFormData.productData.unshift({
    //                                 productId: head4.getAttribute('data-productId'),
    //                                 price: head4.getAttribute('data-product-price'),
    //                                 orderQuantity: head4.firstElementChild.innerText
    //                             })
    //                             newFormData.total += parseFloat(head4.getAttribute('data-product-price'))
    //                             console.log("newFormData.productData", newFormData.productData);
    //                         }

    //                     }
    //                     console.log("newFormData", newFormData);

    //                     break
    //                 }

    //             }

    //         }
    //     }
    //     if (!newFormData.country) {
    //         // alert("select an address for deliver ")
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Oops...',
    //             text: 'select an address for deliver ',
    //             footer: '<a href="">Why do I have this issue?</a>'
    //         })
    //     } else if (!newFormData.modeOfPayment) {
    //         // alert("select the mode of payment ")
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Oops...',
    //             text: 'select the mode of payment ',
    //             footer: '<a href="">Why do I have this issue?</a>'
    //         })
    //     }
    //     else {
    //         try {
    //             const response = await fetch('/orderPlacement', {
    //                 method: 'post',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify({ newFormData })
    //             })
    //             const data = await response.json();
    //             if (data.success) {
    //                 // alert('the order has been placed')
    //                 Swal.fire({
    //                     icon: 'success',
    //                     title: 'the order has been placed',
    //                     footer: '<a href="">Why do I have this issue?</a>'
    //                 })
    //                 // Schedule an anonymous function to run after 1000 milliseconds (1 second)
    //                 setTimeout(function () {
    //                     window.location.href = '/orders'
    //                 }, 2000);


    //             }
    //         } catch (error) {
    //             console.log(error.message);
    //         }

    //     }


    // })


    const placeOrder = document.querySelectorAll('input[name="paymentMethod"]')

    const paymentOptionForm = document.forms.paymentOption

    console.log("paymentOptionForm", paymentOptionForm);
    paymentOptionForm.addEventListener('submit', async (event) => {
        event.preventDefault()
        let newFormData = {}
        for (let i = 0; i < radioButtons.length; i++) { // radioButtons is the variable created above
            if (radioButtons[i].checked === true) {

                for (let j = 0; j < placeOrder.length; j++) {
                    let formData = document.forms["addressList" + i]
                    let formObject = new FormData(formData)
                    for (let [key, value] of formObject) {
                        newFormData[key] = value
                    }
                    if (placeOrder[j].checked === true) {


                        newFormData.modeOfPayment = placeOrder[j].id
                        newFormData.productData = []
                        newFormData.total = 0
                        if (increamentButton) {//took from above
                            let productId = orderQuantity.getAttribute("data-productId")
                            let singleProductUnitPrice = document.getElementById('singleProductUnitPrice')
                            let productPrice = parseFloat(singleProductUnitPrice.innerText)
                            let order_Quantity = parseFloat(orderQuantity.innerText)
                            newFormData.productData[0] = {
                                productId: productId,
                                price: productPrice,
                                orderQuantity: order_Quantity
                            }
                            newFormData.total = productPrice

                        } else {
                            let productList = document.getElementsByClassName('productList')

                            for (i = 0; i < productList.length; i++) {
                                let head4 = document.getElementById('orderQuantity' + i)
                                newFormData.productData.unshift({
                                    productId: head4.getAttribute('data-productId'),
                                    price: head4.getAttribute('data-product-price'),
                                    orderQuantity: head4.firstElementChild.innerText
                                })
                                newFormData.total += parseFloat(head4.getAttribute('data-product-price'))
                                console.log("newFormData.productData", newFormData.productData);
                            }

                        }
                        console.log("newFormData", newFormData);

                        break
                    }

                }

            }
        }
        if (!newFormData.country) {
            // alert("select an address for deliver ")
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'select an address for deliver ',
                footer: '<a href="">Why do I have this issue?</a>'
            })
        } else if (!newFormData.modeOfPayment) {
            // alert("select the mode of payment ")
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'select the mode of payment ',
                footer: '<a href="">Why do I have this issue?</a>'
            })
        }
        else {
            try {

                console.log("newFormData", newFormData);
                if (newFormData.modeOfPayment === "onlinePayment") {




                    // $('.pay-form').submit(function(e){
                    //     e.preventDefault();

                    // var formData = $(this).serialize();

                    $.ajax({
                        url: "/razorPayCreateOrder",
                        type: "POST",
                        data: newFormData,
                        success: function (res) {
                            if (res.success) {
                                var options = {
                                    "key": "" + res.key_id + "",
                                    "amount": "" + res.amount + "",
                                    "currency": "INR",
                                    // "name": ""+res.product_name+"",
                                    // "description": ""+res.description+"",
                                    "image": "https://dummyimage.com/600x400/000/fff",
                                    "order_id": "" + res.order_id + "",
                                    "handler": async function (response) {

                                        
                                        newFormData.razorpay_payment_id = response.razorpay_payment_id
                                        newFormData.razorpay_order_id = response.razorpay_order_id

                                        console.log("newFormData",newFormData);
                                        const success = await fetch('/orderPlacement', {
                                            method: 'post',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({ newFormData })
                                        })
                                        const data = await success.json();
                                        if (data.success) {
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'the order has been placed',
                                                footer: '<a href="">Why do I have this issue?</a>'
                                            })
                                            setTimeout(function () {
                                                window.location.href = '/orders'
                                            }, 2000);


                                        }


                                    },
                                    "prefill": {
                                        "contact": "" + res.contact + "",
                                        "name": "" + res.name + "",
                                        "email": "" + res.email + ""
                                    },
                                    "notes": {
                                        "description": "" + res.description + ""
                                    },
                                    "theme": {
                                        "color": "#2300a3"
                                    }
                                };
                                const razorpayObject = new Razorpay(options);
                                razorpayObject.on('payment.failed', function (response) {
                                    alert("Payment Failed");
                                });
                                razorpayObject.open();
                            }
                            else {
                                alert(res.msg);
                            }
                        }
                    })

                    // });





                } else if (newFormData.modeOfPayment === "cashOnDelivery") {
                    const response = await fetch('/orderPlacement', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ newFormData })
                    })
                    const data = await response.json();
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'the order has been placed',
                            footer: '<a href="">Why do I have this issue?</a>'
                        })
                        setTimeout(function () {
                            window.location.href = '/orders'
                        }, 2000);


                    }
                }


            } catch (error) {
                console.log(error.message);
            }

        }


    })

})