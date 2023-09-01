
document.addEventListener('DOMContentLoaded', () => {

    //toggle image
    let profilePhoto = document.getElementsByClassName('profile-photo-add-icon')[0]; // Get the first element
    if (profilePhoto) {


        profilePhoto.addEventListener('click', (event) => {
            event.preventDefault()
            let profilePhotoForm = document.getElementById('addProfilePhoto');
            profilePhotoForm.classList.toggle('d-none');

        })
    };

    //address form popUp
    let createAddress = document.getElementsByClassName('create-address')[0]
    if (createAddress) {
        createAddress.addEventListener('click', (event) => {
            event.preventDefault()
            let addAddress = document.getElementsByClassName('add-address')[0]
            addAddress.classList.toggle('d-none')
            if (createAddress.innerText === 'Create New Address') {
                createAddress.innerText = 'Cancel'
            } else if (createAddress.innerText === 'Cancel') {
                createAddress.innerText = 'Create New Address'
            }
        })
    }

    //address form submission
    let addressForm = document.forms.addressForm
    if (addressForm) {
        addressForm.addEventListener('submit', async (event) => {
            event.preventDefault()

            let formData = new FormData(addressForm);
            let formDataObject = {};

            for (let [key, value] of formData.entries()) {
                formDataObject[key] = value;
            }

            try {
                let response = await fetch('/createAddress', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ formDataObject })
                })

                let data = await response.json()
                if (data.success) {
                    window.location.href = `/profile?userId=${formDataObject.userId}`
                }

            } catch (err) {

            }


        })

    }

    //edit address
    let editButtons = document.querySelectorAll('.addressEdit');
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', (event) => {
            event.preventDefault();
            const addressIndex = editButton.getAttribute('data-address-index');
            let addressHiddenDiv = document.getElementById('addressHiddenDiv' + addressIndex);
            addressHiddenDiv.classList.toggle('d-none');
        });
    });


    // edit - address cancell


    // let cancellProfileEdit = document.querySelectorAll('.cancellProfileEdit')
    // if (cancellProfileEdit) {
    //     cancellProfileEdit.addEventListener('click', (event) => {
    //         event.preventDefault()
    //         const index = cancellProfileEdit.getAttribute('data-address-cancell')
    //         let addressHiddenDiv = document.getElementById('addressHiddenDiv' + index);
    //         addressHiddenDiv.classList.toggle('d-none');
    //     })
    // }

    let cancellProfileEdit = document.querySelectorAll('.cancellProfileEdit')

    cancellProfileEdit.forEach((cancellProfileEdit) => {
        cancellProfileEdit.addEventListener('click', (event) => {
            event.preventDefault()
            const index = cancellProfileEdit.getAttribute('data-address-cancell-index')
            console.log(index);
            let addressHiddenDiv = document.getElementById('addressHiddenDiv' + index);
            addressHiddenDiv.classList.toggle('d-none');
        })
    })






    //edit-address submit

    let editButtonsNew = document.querySelectorAll('.addressEdit')
    editButtonsNew.forEach(editButtonsNew => {
        let index = editButtonsNew.getAttribute('data-address-index')

        let formName = document.forms['editAddress' + index]
        formName.addEventListener('submit', async (event) => {

            event.preventDefault()
            let newAddressForm = new FormData(formName)
            let newAddressFormData = {}

            for (let [key, value] of newAddressForm.entries()) {
                newAddressFormData[key] = value;
            }
           try {let response = await fetch('/editAddress', {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newAddressFormData, index })
            })

            let data = await response.json()
            if (data.success) {
                window.location.href = `/profile?userId=${newAddressFormData.userId}`

            }}catch(error){
                console.log(error.message)
            }
        })
    })
    // delete-address 

    let addressDelete = document.querySelectorAll('.addressDelete')
    addressDelete.forEach((addressDelete) => {
        addressDelete.addEventListener('click',async (event) => {
            event.preventDefault()
            let userId = addressDelete.getAttribute('data-userId')
            let index = addressDelete.getAttribute('data-address-index')
            let objectId = addressDelete.getAttribute('data-objectId')

           try {let response = await fetch('/deleteAddress',{
                method:'post',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({userId,index,objectId})
                
            })
            let data = await response.json()

            if(data.success){
                window.location.href=`/profile?userId=${userId}`
            }}catch(error){
                console.log(error.message)
            }
        })
    })





});
