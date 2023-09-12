// Bootstrap tooltip initialization
// $(document).ready(function () {
//   $('[data-bs-toggle="tooltip"]').tooltip();
// });

document.addEventListener("DOMContentLoaded", () => {

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
          alert('Order Has Been Cancelled Successfully')
          window.location.reload()
        }
      } catch (error) {
        console.log(error.message);

      }
    })
  })
})