document.addEventListener("DOMContentLoaded", () => {
  //cancell request
  let cancellButtonEl = document.querySelectorAll('button[name="CancellButton"]')
  cancellButtonEl.forEach(CancellButton => {
    CancellButton.addEventListener('click', async (event) => {
      event.preventDefault()
      let orderId = event.target.getAttribute('data-orderid')
      let modeOfPayment = event.target.getAttribute("data-modeOfPayment")
      let submitCancellInput = document.getElementById('submitCancellInput')
      submitCancellInput.value = orderId
      if (modeOfPayment !== "cashOnDelivery") {
        let refundNeed = document.getElementById('refundNeed')
        refundNeed.classList.remove('d-none')
      }
    })
  })

  //cancel submit 
  let submitCancelEl = document.forms["submitCancell"]
  submitCancelEl.addEventListener("submit", async (event) => {
    event.preventDefault()
    let formData = new FormData(submitCancelEl)
    let newFormData = {}
    for (let [key, value] of formData.entries()) {
      newFormData[key] = value
    }
    try {
      const response = await fetch('/cancellOrder', {
        method: 'post',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ newFormData })
      }).then((success) => {
        Swal.fire({
          icon: 'success',
          title: 'Order Has Been Cancelled Successfully',
          // footer: '<a href="">Why do I have this issue?</a>'
        })
        setTimeout(() => {
          window.location.reload()
        }, 2000)

      }).catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Order Cancellation Request Has Been Failed',
          // footer: '<a href="">Why do I have this issue?</a>'
        })
      })
    } catch (error) {
      console.log(error.message);

    }

  })


  //return request
  let returnRequestEl = document.querySelectorAll('button[name="Delivered"]')
  returnRequestEl.forEach(returnRequest => {
    returnRequest.addEventListener('click', (event) => {
      event.preventDefault()
      let orderId = event.target.getAttribute('data-orderid')
      let submitReturnInputEl = document.getElementById('submitReturnInput')
      submitReturnInputEl.value = orderId

    })
  })
  //return submit
  let submitReturnEl = document.forms["submitReturn"]
  submitReturnEl.addEventListener("submit", async (event) => {
    event.preventDefault()
    let formData = new FormData(submitReturnEl)
    let newFormData = {}
    for (let [key, value] of formData.entries()) {
      newFormData[key] = value
    }
    try {
      const response = await fetch('/orderReturnRequest', {
        method: 'post',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ newFormData })
      }).then((success) => {
        Swal.fire({
          icon: 'success',
          title: 'Order Cancellation Request Has Been Recorded Successfully',
          // footer: '<a href="">Why do I have this issue?</a>'
        })
        setTimeout(() => {
          window.location.reload()
        }, 2000)

      }).catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Order Cancellation Request Has Been Failed',
          // footer: '<a href="">Why do I have this issue?</a>'
        })
      })
    } catch (error) {
      console.log(error.message);

    }

  })
})