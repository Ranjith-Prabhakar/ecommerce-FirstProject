document.addEventListener('DOMContentLoaded', () => {
    // stock updation
    const quantityForms = document.querySelectorAll('.quantity-form');

    quantityForms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const productId = formData.get('productId');
            const newQuantity = formData.get('quantity');
            const tableRow = form.closest('tr'); // Get the parent row of the form

            try {
                const response = await fetch('/productAddOrRemove', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId, quantity: newQuantity })
                });

                const data = await response.json();

                if (data.success) {
                    // Update the stock quantity in the table cell
                    const quantityCell = tableRow.querySelector('.quantity');
                    quantityCell.textContent = newQuantity;
                } else {
                    console.error('Failed to update stock:', data.error);
                }
            } catch (error) {
                console.error('Error updating stock:', error);
            }
        });
    });

    //    soft delete

    const freezForms = document.querySelectorAll('.softDelete')

    freezForms.forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const productId = form.productId.value
            const freezValue = form.freez.value

            try {
                const response = await fetch('/productSoftDelete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId, freezValue })
                })
                const data = await response.json()
                if (data.success) {
                    form.freez.value = data.newFreezValue
                }
            } catch (error) {
                console.log(error.message);
            }
        })
    })


    // stock edit 
    const productEditForm = document.getElementById('productEditform')
    console.log(productEditForm);
    productEditForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        let formRawObj = document.forms.productEdit;
        let formObj = new FormData(formRawObj);
        let finalformObj = {};

        for (let [key, value] of formObj) {
            finalformObj[key] = value;
        }
        console.log(finalformObj);

        try {
            const response = await fetch('/productEditConfirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ finalformObj })
            })
            const data = await response.json()
            if (data.success) {
                window.location.reload()
                alert('success')
            }
        } catch (error) {
            console.log(error.message);
        }

    });

    //image edit
    const images = document.getElementsByClassName("tableProductImages");

    for (let i = 0; i < images.length; i++) {
    images[i].addEventListener('click',(event)=>{
        let imageName = images[i].getAttribute('data-image-name');
        console.log('Image Name:', imageName);
        let tableImageModal = document.getElementById('tableImageModal')
        tableImageModal.setAttribute('src',`/productImages/${imageName}`)
    })
        

    }





});
