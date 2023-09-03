
document.addEventListener('DOMContentLoaded', () => {

    //add product to cart
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
                        productCount.innerText = "Go To Cart"
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

    // edit product quantity===============================================================================
    // Edit product quantity - Increment
    let increaseButtons = document.querySelectorAll('.increase');
    for (let i = 0; i < increaseButtons.length; i++) {
        increaseButtons[i].addEventListener('click', async (event) => {
            try {
                event.preventDefault();

                let cartQuantity = document.getElementById('cartUpdate' + i);
                let parseCartQuantity = parseInt(cartQuantity.innerText, 10);
                let referenceParseCartQuantity = parseCartQuantity
                let productQuantity = cartQuantity.getAttribute('data-product-quantity')
                let parseProductQuantity = parseInt(productQuantity, 10)

                if (parseProductQuantity > parseCartQuantity) {
                    parseCartQuantity++;
                }

                cartQuantity.innerText = parseCartQuantity;
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
                } else if (!data) {
                    console.log(data.success)
                    cartQuantity.innerText = referenceParseCartQuantity
                }
            } catch (error) {
                console.log(error)
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
            if (parseCartQuantity > 0) {
                parseCartQuantity--;
            }
            cartQuantity.innerText = parseCartQuantity;

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

    // let removeFromCart = document.getElementsByClassName('removeFromCart')
    // for (i = 0; i < removeFromCart.length; i++) {
    //     removeFromCart[i].addEventListener('click', async (event) => {
    //         event.preventDefault()
    //         const productId = event.target.getAttribute('data-product-id')
    //        try{ const response = await fetch('/removeFromCart',{
    //             method:'post',
    //             headers:{
    //                 'Content-Type':'application/json'
    //             },
    //             body:JSON.stringify({productId})
    //         })
    //         const data = await response.json()
    //         if(data.success){
    //             const cartProducts = removeFromCart[i].closest('.cartProducts'); // Find the parent .cartProducts element
                
    //             console.log('hello',cartProducts);
    //             if (cartProducts) {
    //                 cartProducts.classList.toggle('d-none'); // Toggle the class on the parent element
    //             }
    //         }else{
    //             console.log(data.success)
    //         } }catch(error){
    //             console.log(error.message);
    //         }
    //     })
    // }

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
                const cartProduct = removeFromCart[i].closest('.cartProducts'); // Find the parent .cartProducts element
                if (cartProduct) {
                    cartProduct.classList.toggle('d-none'); // Toggle the class on the parent element
                }
            } else {
                console.log(data.success);
            }
        } catch (error) {
            console.log(error.message);
        }
    });
}


//cart page load - - products to select to purchase


})

