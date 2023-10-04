document.addEventListener('DOMContentLoaded', (e) => {
  //datatable.net
  $('#table').DataTable();
  //read reason 
  const returnMessageButton = document.querySelectorAll('button[name="returnMessage"]')
  const modalMessageDiv = document.getElementById('returnMessageModalDiv')
  returnMessageButton.forEach(returnMessage => {
    returnMessage.addEventListener('click', (event) => {
      event.preventDefault()
      let message = event.target.getAttribute('data-returnMessage')
      modalMessageDiv.innerText = message

    })
  })

  //confirm
  const confirmReturn = document.querySelectorAll('button[name="confirmReturn"]')
  confirmReturn.forEach(confirmReturn => {
    confirmReturn.addEventListener('click', async (event) => {
      event.preventDefault()
      let orderData = {
        userId: event.target.getAttribute('data-userId'),
        orderId: event.target.getAttribute('data-orderId'),
        modeOfRefund: event.target.getAttribute('data-mode-of-refund'),
        amount: event.target.getAttribute('data-amout')
      }
      try {
        //

        let newFormData = { balaceToPay: orderData.amount }
        $.ajax({

          url: "/returnRazorPay", //it will goes to user router and controller
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
                  const success = await fetch('/confirmReturn', {
                    headers: {
                      "content-type": 'application/json'
                    },
                    method: 'post',
                    body: JSON.stringify({ orderData })
                  }).then(() => {
                    if (orderData.modeOfRefund !== "addToWallet") {
                      Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Refunded To The Client Account',
                      })
                      setTimeout(() => { window.location.reload() }, 2000)
                    } else {
                      window.location.reload()
                    }
                  }).catch((err) => console.log(err.message))


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
                Swal.fire('Payment Failed')
              });
              razorpayObject.open();
            }
            else {
              alert(res.msg);
            }
          }
        })
        // 
      } catch (error) {
        console.log(error.message)

      }
    })
  })

})