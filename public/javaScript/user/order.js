// Bootstrap tooltip initialization
// $(document).ready(function () {
//   $('[data-bs-toggle="tooltip"]').tooltip();
// });

document.addEventListener("DOMContentLoaded", () => {
  //cancell
  let cancellButtonEl = document.querySelectorAll('button[name="CancellButton"]')
  cancellButtonEl.forEach(CancellButton => {
    CancellButton.addEventListener('click', async (event) => {
      event.preventDefault()
      let orderId = event.target.getAttribute('data-orderid')
      try {
        const response = await fetch('/cancellOrder', {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ orderId })
        })
        let data = await response.json()
        if (data.success) {
          // alert('Order Has Been Cancelled Successfully')
          Swal.fire({
            icon: 'success',
            title: 'Order Has Been Cancelled Successfully',
            footer: '<a href="">Why do I have this issue?</a>'
          })
          setTimeout(() => {

            window.location.reload()
          }, 2000)
        }
      } catch (error) {
        console.log(error.message);

      }
    })
  })
  //return request
  let returnRequestEl = document.querySelectorAll('button[name="Delivered"]')
  returnRequestEl.forEach(returnRequest => {
    returnRequest.addEventListener('click', (event) => {
      console.log('========');
      event.preventDefault()
      let orderId = event.target.getAttribute('data-orderid')
      let submitReturnInputEl = document.getElementById('submitReturnInput')
      submitReturnInputEl.value = orderId
      console.log("submitReturnInputEl", submitReturnInputEl);

    })
  })

  let submitReturnEl = document.forms["submitReturn"]
  console.log("submitReturnEl>>>>>", submitReturnEl);
  submitReturnEl.addEventListener("submit", async (event) => {
    console.log("inside submit return");
    event.preventDefault()
    let formData = new FormData(submitReturnEl)
    let newFormData = {}
    for (let [key, value] of formData.entries()) {
      newFormData[key] = value
    }
    console.log("newFormData", newFormData);
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
  // let returnRequestEl = document.querySelectorAll('button[name="Delivered"]')
  // returnRequestEl.forEach(returnRequest=>{
  //   returnRequest.addEventListener('click',async(event)=>{
  //     event.preventDefault()
  //     let orderId = event.target.getAttribute('data-orderid')
  //     try {
  //       const response = await fetch('/orderReturnRequest',{
  //         method:'post',
  //         headers:{
  //           "content-type":"application/json"
  //         },
  //         body:JSON.stringify({orderId})
  //       }).then((success)=>{
  //         Swal.fire({
  //           icon: 'success',
  //           title: 'Order Cancellation Request Has Been Recorded Successfully',
  //           // footer: '<a href="">Why do I have this issue?</a>'
  //       })
  //         window.location.reload()
  //       }).catch(err=>{
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Order Cancellation Request Has Been Failed',
  //           // footer: '<a href="">Why do I have this issue?</a>'
  //       })
  //       })
  //     } catch (error) {
  //       console.log(error.message);

  //     }
  //   })
  // })
})