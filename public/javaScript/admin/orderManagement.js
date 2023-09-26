document.addEventListener('DOMContentLoaded', (event) => {
  //datatable.net
  $('#table').DataTable();
  // order status
  let status = document.querySelectorAll('select')
  console.log(status);
  status.forEach(status => {
    status.addEventListener('change', async (event) => {
      event.preventDefault()
      let orderData = {
        status: event.target.value,
        userId: event.target.getAttribute('data-userId'),
        orderId: event.target.getAttribute('data-orderId'),
      }
      try {
        const response = await fetch('/orderStatusEdit', {
          method: 'post',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ orderData })
        })
        let data = await response.json()
        if (data.success) {
          console.log('success');
        }
      } catch (error) {
        console.log(error.message)

      }
    })
  })



})