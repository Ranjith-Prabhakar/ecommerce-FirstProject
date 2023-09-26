document.addEventListener('DOMContentLoaded', (event) => {
//datatable.net
$('#table').DataTable();
  // brand creation
  const createBrand = document.forms.createBrand
  createBrand.addEventListener('submit', async (event) => {
    event.preventDefault()
    let brandName = createBrand.elements.brandName.value

    try {
      const response = await fetch("/createBrand", {
        method: 'post',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ brandName })
      })
      let data = await response.json()
      if (data.brandCreation) {
        // alert(data.brandCreation)
        createBrand.elements.brandName.value = ''
        brandName = ''
      } else if (data.existingBrand) {
        // alert(data.existingBrand)
        createBrand.elements.brandName.value = ''
      }
    } catch (error) {
      console.log(error.message);

    }

  })

  //page reload

  const brandClose =document.querySelector('button[name="brandClose"]')
  brandClose.addEventListener('click',(event)=>{
    event.preventDefault()
    window.location.reload()
  }) 
})