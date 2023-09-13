document.addEventListener('DOMContentLoaded', (event) => {
  let selectEl = document.querySelectorAll('select[name="status"]')
  console.log(selectEl);
  selectEl.forEach(selectEl => {
    selectEl.addEventListener('change', async(event) => {
      event.preventDefault()
      const userData ={
      status:event.target.value,
      userId :event.target.getAttribute('data-userId')
      }
      

      try {
        const response = await fetch('/userEditConfirm',{
          method:'post',
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({userData})
        })
        let data = await response.json()
        if(data.success){
          window.location.reload()
          console.log("success");
          console.log("userData", userData);
        }
      } catch (error) {
        console.log(error.message);
      }
    })
  })
})