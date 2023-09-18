document.addEventListener('DOMContentLoaded', (e) => {
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
      console.log(orderData);
      try {
        const response = await fetch('/confirmReturn', {
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
            setTimeout(()=>{window.location.reload()},2000)
          }else{
            window.location.reload()
          }
        }).catch((err) => console.log(err.message))
      } catch (error) {
        console.log(error.message)

      }
    })
  })

})