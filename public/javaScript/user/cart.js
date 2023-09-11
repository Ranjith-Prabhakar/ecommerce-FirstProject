
document.addEventListener('DOMContentLoaded', () => {
    //global variables
    let selectedProducts = [];
    let sum = 0; // Initialize sum



    //add product to cart======================================================================
    let productCount = document.querySelectorAll(".productCount")

    productCount.forEach((productCount) => {
        productCount.addEventListener('click', async (event) => {
            event.preventDefault()

            let productId = productCount.getAttribute('data-product-id');
            let userId = productCount.getAttribute('data-user-id');
            if (!userId) {

                try {
                    location.href = '/userLogin'
                } catch (error) {
                    console.log(error.message);
                }
            } else {
                try {
                    const response = await fetch('/addToCart', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ productId, userId })
                    })
                    let data = await response.json()
                    if (data.success) {
                        productCount.innerText = 'Go To Cart'
                        let valueChanger = document.getElementById('valueChanger')
                        let parsedValue = parseInt(valueChanger.innerText)
                        parsedValue++
                        valueChanger.innerText = parsedValue
                    } if (!data.success) {
                        console.log('product already exist in cart');
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }



        })

    })

    //go to cart if already in cart
    productCount.forEach(productCount => {
        productCount.addEventListener('click', async (event) => {
            event.preventDefault()
            if (productCount.innerText === 'Go To Cart') {
                window.location.href = '/cart'
            }
        })
    })

    // edit product quantity===============================================================================
    // Edit product quantity - Increment

    let increaseButtons = document.querySelectorAll('.increase');
    for (let i = 0; i < increaseButtons.length; i++) {
        increaseButtons[i].addEventListener('click', async (event) => {
            try {
                event.preventDefault();
                let cartQuantity = document.getElementById('cartUpdate' + i);
                let parseCartQuantity = parseInt(cartQuantity.innerText, 10);
                let referenceParseCartQuantity = parseCartQuantity;
                let productQuantity = cartQuantity.getAttribute('data-product-quantity');
                let parseProductQuantity = parseInt(productQuantity, 10);
                if (parseProductQuantity > parseCartQuantity) {
                    parseCartQuantity++;
                    let productId = cartQuantity.getAttribute('data-product-id');
                    let findIfInSelectedProducts = selectedProducts.find(element => element.productId === productId);
                    console.log("findIfInSelectedProducts in increment", findIfInSelectedProducts);
                    if (findIfInSelectedProducts) {
                        sum += parseFloat(findIfInSelectedProducts.productPrice);
                        let selectedProductPrice = document.getElementById('selectedProductPrice');
                        selectedProductPrice.innerHTML = `<h5 class="mt-3">Total Value : ${sum}</h5> <button id="buySelectedProduct" class=" btn btn-success mb-3  bi bi-bag-fill"> Place Order </button>`;// Update the innerHTML


                        let cartPrice = document.getElementById('cartPrice');
                        let cartAmout = parseFloat(cartPrice.getAttribute('data-cartPrice'))
                        let productPrice = parseFloat(increaseButtons[i].getAttribute('data-product-price'))
                        cartPrice.innerHTML = `cart value :<span id="cartPriceSpan">${cartAmout + productPrice} </span>`
                        cartPrice.setAttribute('data-cartPrice', `${cartAmout + productPrice}`)


                        let price = document.getElementById('productPrice' + i)
                        let parsePrice = parseFloat(price.innerText)
                        parsePrice += productPrice
                        price.innerText = parsePrice
                    } else {

                        let cartPrice = document.getElementById('cartPrice');
                        let cartAmout = parseFloat(cartPrice.getAttribute('data-cartPrice'))
                        let productPrice = parseFloat(increaseButtons[i].getAttribute('data-product-price'))
                        cartPrice.innerHTML = `cart value :<span id="cartPriceSpan">${cartAmout + productPrice} </span>`
                        cartPrice.setAttribute('data-cartPrice', `${cartAmout + productPrice}`)
                        let price = document.getElementById('productPrice' + i)
                        let parsePrice = parseFloat(price.innerText)
                        parsePrice += productPrice
                        price.innerText = parsePrice
                    }
                }

                cartQuantity.innerText = parseCartQuantity;
                cartQuantity.value = parseCartQuantity

                let productId = cartQuantity.getAttribute('data-product-id');
                let response = await fetch('/updateCartProductQty', {
                    method: 'post',
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({ productId, quantity: parseCartQuantity })
                });

                let data = await response.json();

                if (data.success) {
                    console.log(data.success);
                } else if (!data) {
                    console.log(data.success);
                    cartQuantity.innerText = referenceParseCartQuantity;
                }
            } catch (error) {
                console.log(error);
            }
        });
    }

    // Edit product quantity - Decrement
    let decreaseButtons = document.querySelectorAll('.decrease');
    for (let i = 0; i < decreaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', async (event) => {
            event.preventDefault();
            let cartQuantity = document.getElementById('cartUpdate' + i);
            let parseCartQuantity = parseInt(cartQuantity.innerText, 10);
            let referenceParseCartQuantity = parseCartQuantity;
            if (parseCartQuantity > 1) {
                parseCartQuantity--;

                let productId = cartQuantity.getAttribute('data-product-id');
                let findIfInSelectedProducts = selectedProducts.find(element => element.productId === productId);
                console.log("findIfInSelectedProducts in decrement", findIfInSelectedProducts);
                if (findIfInSelectedProducts) {
                    sum -= parseFloat(findIfInSelectedProducts.productPrice);
                    let selectedProductPrice = document.getElementById('selectedProductPrice');
                    selectedProductPrice.innerHTML = `<h5 class="mt-3">Total Value : ${sum}</h5> <button id="buySelectedProduct" class=" btn btn-success mb-3  bi bi-bag-fill"> Place Order </button>`;// Update the innerHTML

                    let cartPrice = document.getElementById('cartPrice');
                    let cartAmout = parseFloat(cartPrice.getAttribute('data-cartPrice'))
                    let productPrice = parseFloat(increaseButtons[i].getAttribute('data-product-price'))
                    cartPrice.innerHTML = `cart value :<span id="cartPriceSpan">${cartAmout - productPrice} </span>`
                    cartPrice.setAttribute('data-cartPrice', `${cartAmout - productPrice}`)


                    let price = document.getElementById('productPrice' + i)
                    let parsePrice = parseFloat(price.innerText)
                    parsePrice -= productPrice
                    price.innerText = parsePrice







                    // selectedProductPrice.innerHTML = `<h5>Total Value : ${sum}</h5> <button id="buySelectedProduct"> Place Order </button>`;
                    // let cartPrice = document.getElementById('cartPrice');
                    // cartPrice.innerHTML = `cart value : <span id="cartPriceSpan"> ${sum} </span> `
                    // let price = document.getElementById('productPrice' + i)
                    // let parsePrice = parseFloat(price.innerText)
                    // parsePrice -= productPrice
                    // price.innerText = parsePrice
                } else {

                    let cartPrice = document.getElementById('cartPrice');
                    let cartAmout = parseFloat(cartPrice.getAttribute('data-cartPrice'))
                    let productPrice = parseFloat(increaseButtons[i].getAttribute('data-product-price'))
                    cartPrice.innerHTML = `cart value :<span id="cartPriceSpan">${cartAmout - productPrice}</span>`
                    cartPrice.setAttribute('data-cartPrice', `${cartAmout - productPrice}`)
                    let price = document.getElementById('productPrice' + i)
                    let parsePrice = parseFloat(price.innerText)
                    parsePrice -= productPrice
                    price.innerText = parsePrice
                }
            }
            cartQuantity.innerText = parseCartQuantity;
            cartQuantity.value = parseCartQuantity


            let productId = cartQuantity.getAttribute('data-product-id')
            let response = await fetch('/updateCartProductQty', {
                method: 'post',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ productId, quantity: parseCartQuantity })
            })
            let data = await response.json()
            if (data.success) {
                console.log(data.success);
            } else {
                cartQuantity.innerText = referenceParseCartQuantity
            }

        });
    }

    // ===========================================================================================================

    //remove item from cart


    let removeFromCart = document.getElementsByClassName('removeFromCart');

    for (let i = 0; i < removeFromCart.length; i++) {
        removeFromCart[i].addEventListener('click', async (event) => {
            event.preventDefault();
            const productId = event.target.getAttribute('data-product-id');

            try {
                const response = await fetch('/removeFromCart', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId })
                });

                const data = await response.json();

                if (data.success) {
                    window.location.reload()
                    // const cartProduct = removeFromCart[i].closest('.cartProducts'); // Find the parent .cartProducts element
                    // if (cartProduct) {
                    //     cartProduct.classList.toggle('d-none'); // Toggle the class on the parent element
                    //     let cartPriceSpan = document.getElementById('cartPriceSpan')
                    //     let parseCartPriceSpan = parseFloat(cartPriceSpan.innerText)

                    //     let productPrice = document.getElementById("productPrice" + i)
                    //     let parseProductPrice = parseFloat(productPrice.innerText)

                    //     cartPriceSpan.innerText = parseCartPriceSpan - parseProductPrice
                    //     ////
                    //     let cartPrice = document.getElementById('cartPrice');
                    //     let cartAmout = parseFloat(cartPrice.getAttribute('data-cartPrice'))
                    //     cartPrice.setAttribute('data-cartPrice', `${parseCartPriceSpan - parseProductPrice}`)
                    //     ///


                    // }
                } else {
                    console.log(data.success);
                }
            } catch (error) {
                console.log(error.message);
            }
        });
    }


    // Cart page load - products to select to purchase ====================================================================
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const productId = this.getAttribute('data-product-id');
            const productPrice = parseFloat(this.getAttribute('data-product-price')); // Convert to a float
            const productIndex = this.getAttribute('data-index');
            const productQuantity = document.getElementById('cartUpdate' + productIndex).value
            console.log("productQuantity", productQuantity);
            if (this.checked) {
                // Checkbox is checked, add the product to the selectedProducts array
                selectedProducts.push({ productId, productPrice, productQuantity });

                let selectedProductPrice = document.getElementById('selectedProductPrice');
                if (selectedProductPrice.classList.contains('d-none')) {
                    selectedProductPrice.classList.remove('d-none');
                }

                sum += productPrice * productQuantity; // Update the sum
                selectedProductPrice.innerHTML = `<h5 class="mt-3">Total Value : ${sum}</h5> <button id="buySelectedProduct" class=" btn btn-success mb-3  bi bi-bag-fill"> Place Order </button>`;// Update the innerHTML
            } else {
                // Checkbox is unchecked, remove the product from the selectedProducts array
                const index = selectedProducts.findIndex(product => product.productId === productId);
                if (index !== -1) {
                    sum -= productPrice * productQuantity; // Update the sum
                    selectedProducts.splice(index, 1);

                    let selectedProductPrice = document.getElementById('selectedProductPrice');
                    if (!selectedProducts.length) {
                        selectedProductPrice.classList.add('d-none');
                    }

                    selectedProductPrice.innerHTML = `<h5>Total Value : ${sum}</h5> <button id="buySelectedProduct"> Place Order </button>`; // Update the innerHTML
                }
            }
        });
    });


    // buySelectedProduct ========================================================================

    document.addEventListener("click", async (event) => {
        if (event.target && event.target.id === 'buySelectedProduct') {
            event.preventDefault();

            try {
                const response = await fetch('/buySelectedProducts', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ selectedProducts })
                });

                const data = await response.json();

                if (data.success) {
                    window.location.href = '/checkOutPage'

                } else {
                    console.log('Failed to process products.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    });


});




