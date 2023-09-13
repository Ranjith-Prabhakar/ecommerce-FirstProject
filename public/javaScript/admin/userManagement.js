document.addEventListener('DOMContentLoaded', (event) => {
  //status
  let selectEl = document.querySelectorAll('select[name="status"]')
  
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
        
        }
      } catch (error) {
        console.log(error.message);
      }
    })
  })

  // //delete
  let deleteButtonEl = document.querySelectorAll('button[name="confirmDelete"]')
  deleteButtonEl.forEach(deleteButton=>{
    deleteButton.addEventListener('click',async(event)=>{
      // event.preventDefault()
      let userId = event.target.getAttribute('data-userId')
     

      try {
        const response = await fetch('/userDeleteConfirm',{
          method:'post',
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({userId})
        })
        let data = await response.json()
        if(data.success){
          window.location.reload()
         
        }
      } catch (error) {
        console.log(error.message);
        
      }
    })
  })
})