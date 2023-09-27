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

                let cartSum = document.getElementById('cartSum')
                cartSum.innerText = singleProductUnitPrice.innerText

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

                let cartSum = document.getElementById('cartSum')
                cartSum.innerText = singleProductUnitPrice.innerText
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


    //address radio button  
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

    // select coupon

    let selectCoupon = document.querySelectorAll(".selectCoupon");
    let myModal = document.getElementById('staticBackdrop');
    let valueAfterCoupon = document.getElementById('valueAfterCoupon');
    let singleProductUnitPriceElement = document.getElementById('singleProductUnitPrice'); //single product before coupon
    let cartSumElement = document.getElementById('cartSum') //productList
    selectCoupon.forEach(selectCoupon => {
        selectCoupon.addEventListener('click', (event) => {
            event.preventDefault();
            let couponValue = event.target.getAttribute('data-coupon-value');
            let couponId = event.target.getAttribute('data-coupon-id')
            couponValue = parseFloat(couponValue);
            if (singleProductUnitPriceElement) {
                let singleProductUnitPrice = parseFloat(singleProductUnitPriceElement.innerText);
                let adjustedValue = singleProductUnitPrice - couponValue;
                valueAfterCoupon.innerText = adjustedValue.toFixed(2); // Convert to fixed decimal for display
                valueAfterCoupon.setAttribute('data-coupon-id', couponId)
                let hiddenCouponDiv = document.getElementById('hiddenCouponDiv')
                cartSumElement.innerText = adjustedValue.toFixed(2)
                hiddenCouponDiv.classList.remove('d-none')
                cartSumElement.setAttribute('data-coupon-id', couponId)
                cartSumElement.setAttribute('data-coupon-value', couponValue)
                let couponModalClickButton = document.querySelector('button[name="couponModalClickButton"]')
                couponModalClickButton.classList.add('d-none')
            } else if (cartSumElement) {
                let cartSum = parseFloat(cartSumElement.innerText)
                let adjustedValue = cartSum - couponValue;
                valueAfterCoupon.innerText = adjustedValue.toFixed(2);
                valueAfterCoupon.setAttribute('data-coupon-id', couponId)
                let hiddenCouponDiv = document.getElementById('hiddenCouponDiv')
                hiddenCouponDiv.classList.remove('d-none')
                cartSumElement.innerText = adjustedValue.toFixed(2)
                cartSumElement.setAttribute('data-coupon-id', couponId)
                cartSumElement.setAttribute('data-coupon-value', couponValue)
                let couponModalClickButton = document.querySelector('button[name="couponModalClickButton"]')
                couponModalClickButton.classList.add('d-none')
            }
            $(myModal).modal("hide");

        });
    });

    //click on wallet 
    const wallet = document.getElementById('wallet')
    let walletBalanceEl = document.getElementById('walletBalance')
    let payableAmountEl = document.getElementById('payableAmount')
    let balanceAmountEl = document.getElementById('balanceAmount')
    if (wallet) {
        console.log("wallet", wallet);
        let walletBalance = wallet.getAttribute('data-wallet-balance')
        console.log("walletBalance", walletBalance);
        wallet.addEventListener('click', (event) => {
            let singleProductSum = document.getElementById('singleProductUnitPrice')
            let singleProductPrice = 0
            if (singleProductSum) {
                singleProductPrice = parseFloat(singleProductUnitPriceElement.innerText) // single product
            }
            let price = parseFloat(valueAfterCoupon.innerText) // after coupon
            parseCartSum = parseFloat(cartSumElement.innerText) // productList
            walletBalanceEl.innerText = walletBalance
            if (price) {
                payableAmountEl.innerText = price
                if (walletBalance > price) {
                    balanceAmountEl.innerText = 0
                } else {
                    balanceAmountEl.innerText = Math.abs(parseFloat(walletBalance) - price)
                }
            } else if (parseCartSum) {
                payableAmountEl.innerText = parseCartSum
                if (walletBalance > parseCartSum) {
                    balanceAmountEl.innerText = 0
                } else {
                    balanceAmountEl.innerText = Math.abs(parseFloat(walletBalance) - parseCartSum)
                }
            }
            else if (singleProductPrice) {
                payableAmountEl.innerText = singleProductPrice
                if (walletBalance > singleProductPrice) {
                    balanceAmountEl.innerText = 0
                } else {
                    balanceAmountEl.innerText = Math.abs(parseFloat(walletBalance) - singleProductPrice)
                }
            }
            if (parseFloat(balanceAmountEl.innerText) > 0) {
                document.getElementById('balancePayment').classList.remove('d-none')
                document.getElementById('walletFooter').classList.add('d-none')
            }
        })
    }





    // click on pay using wallet button on wallet modal
    let walletModal = document.getElementById('walletModal')
    let paymentMethodRadioButtonWallet = document.getElementById('wallet')
    let payUsingWalletButton = document.getElementById('payUsingWalletButton')
    payUsingWalletButton.addEventListener('click', (event) => {
        event.preventDefault()
        paymentMethodRadioButtonWallet.checked = true

        cartSumElement.innerText = balanceAmountEl.innerText
        if (parseFloat(balanceAmountEl.innerText) !== 0) {
            console.log('inside balanceAmountEl !== 0');
            cartSumElement.setAttribute('data-wallet-money', `${walletBalanceEl.innerText}`)
        } else {
            console.log('else of inside balanceAmountEl !== 0');
            cartSumElement.setAttribute('data-wallet-money', `${payableAmountEl.innerText}`)
        }


        $(walletModal).modal('hide');

    })


    // click on cash on delivery button on wallet modal

    // let walletModal = document.getElementById('walletModal')
    let paymentMethodRadioButtonCashOnDelivery = document.getElementById('cashOnDelivery')
    let cashOnDeliveryWallet = document.getElementById('cashOnDeliveryWallet')
    cashOnDeliveryWallet.addEventListener('click', (event) => {
        event.preventDefault()
        paymentMethodRadioButtonCashOnDelivery.checked = true
        // valueAfterCoupon.innerText = balanceAmountEl.innerText
        // valueAfterCoupon.setAttribute('data-wallet-money', `${balanceAmountEl.innerText}`)

        // if(cartSumElement){
        //     cartSumElement.innerText = balanceAmountEl.innerText
        // }
        cartSumElement.innerText = balanceAmountEl.innerText
        if (parseFloat(balanceAmountEl.innerText) !== 0) {
            console.log('inside balanceAmountEl !== 0');
            cartSumElement.setAttribute('data-wallet-money', `${walletBalanceEl.innerText}`)
        } else {
            console.log('else of inside balanceAmountEl !== 0');
            cartSumElement.setAttribute('data-wallet-money', `${payableAmountEl.innerText}`)
        }

        wallet.classList.add('d-none')
        let walletLabel = document.getElementById('walletLabel')
        walletLabel.classList.add('d-none')
        $(walletModal).modal('hide');

    })

    //click on upi on delivery button on wallet modal
    let paymentMethodRadioButtonUpi = document.getElementById('onlinePayment')
    let onlinePaymentWallet = document.getElementById('onlinePaymentWallet')
    onlinePaymentWallet.addEventListener('click', (event) => {
        event.preventDefault()
        paymentMethodRadioButtonUpi.checked = true
        // valueAfterCoupon.innerText = balanceAmountEl.innerText
        // valueAfterCoupon.setAttribute('data-wallet-money', `${balanceAmountEl.innerText}`)
        // if(cartSumElement){
        //     cartSumElement.innerText = balanceAmountEl.innerText
        // }
        cartSumElement.innerText = balanceAmountEl.innerText
        if (parseFloat(balanceAmountEl.innerText) !== 0) {
            console.log('inside balanceAmountEl !== 0');
            cartSumElement.setAttribute('data-wallet-money', `${walletBalanceEl.innerText}`)
        } else {
            console.log('else of inside balanceAmountEl !== 0');
            cartSumElement.setAttribute('data-wallet-money', `${payableAmountEl.innerText}`)
        }
        wallet.classList.add('d-none')
        let walletLabel = document.getElementById('walletLabel')
        walletLabel.classList.add('d-none')
        $(walletModal).modal('hide');

    })





    ///order placement
    const placeOrder = document.querySelectorAll('input[name="paymentMethod"]')
    const paymentOptionForm = document.forms.paymentOption
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
                            let price = parseFloat(valueAfterCoupon.innerText)
                            newFormData.productData[0] = {
                                productId: productId,
                                price: productPrice,
                                orderQuantity: order_Quantity,
                                // 

                            }
                            //   couponId= cartSumElement.getAttribute('data-coupon-id')                               
                            newFormData.walletDebit = cartSumElement.getAttribute('data-wallet-money')
                            newFormData.balaceToPay = cartSumElement.innerText
                            if (price) {
                                newFormData.total = price
                                newFormData.couponId = valueAfterCoupon.getAttribute('data-coupon-id')
                                newFormData.couponValue = cartSumElement.getAttribute('data-coupon-value')
                            } else {
                                newFormData.total = productPrice
                            }
                            console.log("newFormData ====", newFormData);
                            console.log("cartSumElement ====", cartSumElement);
                        } else {
                            let productList = document.getElementsByClassName('productList')
                            let price = parseFloat(valueAfterCoupon.innerText)
                            for (i = 0; i < productList.length; i++) {
                                let head4 = document.getElementById('orderQuantity' + i)
                                newFormData.productData.unshift({
                                    productId: head4.getAttribute('data-productId'),
                                    price: head4.getAttribute('data-product-price'),
                                    orderQuantity: head4.firstElementChild.innerText
                                })
                                newFormData.walletDebit = cartSumElement.getAttribute('data-wallet-money')
                                newFormData.balaceToPay = cartSumElement.innerText
                                if (price) {
                                    newFormData.total = price
                                    newFormData.couponId = valueAfterCoupon.getAttribute('data-coupon-id')
                                    newFormData.couponValue = cartSumElement.getAttribute('data-coupon-value')
                                } else {
                                    newFormData.total += parseFloat(head4.getAttribute('data-product-price'))
                                }
                            }
                            console.log("newFormData-----", newFormData);

                        }
                        break
                    }
                }
            }
        }
        if (!newFormData.country) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'select an address for deliver ',
                footer: '<a href="">Why do I have this issue?</a>'
            })
        } else if (!newFormData.modeOfPayment) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'select the mode of payment ',
                footer: '<a href="">Why do I have this issue?</a>'
            })
        }
        else {
            try {
                if (newFormData.modeOfPayment === "onlinePayment") {
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
                } else if (newFormData.modeOfPayment !== "onlinePayment") {

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