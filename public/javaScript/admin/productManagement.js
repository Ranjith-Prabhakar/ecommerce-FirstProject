document.addEventListener('DOMContentLoaded', () => {
    //datatable.net
    $('#table').DataTable();

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


    //modal data updation while clicking on stock data edit 

    let productEditButton = document.querySelectorAll('button[name="productEditButton"]')
    productEditButton.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            let product = button.getAttribute('data-product');
            let parsedProduct = JSON.parse(product);
            let editFormId = document.getElementById('editFormId')
            editFormId.value = parsedProduct._id
            editFormId.placeholder = parsedProduct._id
            let editProductName = document.getElementById('editProductName')
            editProductName.value = parsedProduct.productName
            editProductName.placeholder = parsedProduct.productName
            let editQuantity = document.getElementById('editQuantity')
            editQuantity.value = parsedProduct.quantity
            editQuantity.placeholder = parsedProduct.quantity
            let editUnitPrice = document.getElementById('editUnitPrice')
            editUnitPrice.value = parsedProduct.unitPrice
            editUnitPrice.placeholder = parsedProduct.unitPrice
            let editFrontCamera = document.getElementById('editFrontCamera')
            editFrontCamera.value = parsedProduct.specification.frontCamera
            editFrontCamera.placeholder = parsedProduct.specification.frontCamera
            let editBackCamera = document.getElementById('editBackCamera')
            editBackCamera.value = parsedProduct.specification.backCamera
            editBackCamera.placeholder = parsedProduct.specification.backCamera
            let editRam = document.getElementById('editRam')
            editRam.value = parsedProduct.specification.ram
            editRam.placeholder = parsedProduct.specification.ram
            let editInternalStorage = document.getElementById('editInternalStorage')
            editInternalStorage.value = parsedProduct.specification.internalStorage
            editInternalStorage.placeholder = parsedProduct.specification.internalStorage
            let editBattery = document.getElementById('editBattery')
            editBattery.value = parsedProduct.specification.battery
            editBattery.placeholder = parsedProduct.specification.battery
            let editProcessor = document.getElementById('editProcessor')
            editProcessor.value = parsedProduct.specification.processor
            editProcessor.placeholder = parsedProduct.specification.processor
            let editChargerType = document.getElementById('editChargerType')
            editChargerType.value = parsedProduct.specification.chargerType
            editChargerType.placeholder = parsedProduct.specification.chargerType
        })
    })



    // stock edit 
    const productEditForm = document.getElementById('productEditform')
    productEditForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        let formRawObj = document.forms.productEdit;
        let formObj = new FormData(formRawObj);
        let finalformObj = {};

        for (let [key, value] of formObj) {
            finalformObj[key] = value;
        }

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
                // alert('success')
            }
        } catch (error) {
            console.log(error.message);
        }

    });

    //image edit modal
    const images = document.getElementsByClassName("tableProductImages");
    let deleteButton = document.getElementsByName('deleteImage')[0]
    for (let i = 0; i < images.length; i++) {
        images[i].addEventListener('click', (event) => {
            event.preventDefault()
            let imageName = images[i].getAttribute('data-image-name');
            let productId = images[i].getAttribute('data-product-id');
            let tableImageModal = document.getElementById('tableImageModal')
            tableImageModal.setAttribute('src', `/productImages/${imageName}`)

            deleteButton.setAttribute('data-product-id', productId)
            deleteButton.setAttribute('data-product-img', imageName)

            let oldImage = document.querySelector('input[name="oldImage"]')
            oldImage.value = imageName

            let ImgUploadButton = document.getElementsByName('hiddenDivImgUpload')[0]
            ImgUploadButton.setAttribute('data-product-id', productId)
            ImgUploadButton.setAttribute('data-product-img', imageName)
        })
    }

    //image change button
    let changeImageButton = document.getElementsByName('changeImage')[0]
    let modalFooter = document.getElementsByName('modalFooter')[0]
    let hiddenDiv = document.getElementsByName('hiddenDiv')[0]
    changeImageButton.addEventListener('click', (event) => {
        hiddenDiv.classList.toggle('d-none')
        modalFooter.classList.toggle('d-none')
    })

    //image upload cancell button
    let hiddenDivImgCancell = document.getElementsByName('hiddenDivImgCancell')[0]
    hiddenDivImgCancell.addEventListener('click', (event) => {
        event.preventDefault()
        modalFooter.classList.toggle('d-none')
        hiddenDiv.classList.toggle('d-none')
    })

    //image delete 
    deleteButton.addEventListener('click', async (event) => {
        event.preventDefault()
        let productData = {
            productId: deleteButton.getAttribute('data-product-id'),
            imageName: deleteButton.getAttribute('data-product-img'),
        }
        const response = await fetch('/deleteImage', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ productData })
        }).then(data => {
            console.log(data);
            window.location.reload()
        }).catch(error => console.log(error.message))
        try {

        } catch (error) {
            console.log(error.message);

        }
    })

    //new product image validation
    let newProductImages = document.getElementById('newProductImages')
    newProductImages.addEventListener('change', (e) => {
        e.preventDefault()
        let newProductImagesList = newProductImages.files
        const imageFormats = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/bmp',
            'image/webp',
            'image/tiff',
            'image/svg+xml',
            'image/avif',
            'image/heif',
            'image/heic',
        ];
        for (let i = 0; i < newProductImagesList.length; i++) {
            if (!imageFormats.includes(newProductImagesList[i].type)) {
                let invalidImages = document.getElementById('invalidImages')
                console.log(invalidImages);
                invalidImages.classList.remove('d-none')
                console.log("fail")
                let newProductSubmitButton = document.getElementById('newProductSubmitButton')
                newProductSubmitButton.setAttribute('disabled',true)
                break
            } else {
                let invalidImages = document.getElementById('invalidImages')
                invalidImages.classList.add('d-none')
                let newProductSubmitButton = document.getElementById('newProductSubmitButton')
                newProductSubmitButton.removeAttribute('disabled');
            }
        }

    });


});
