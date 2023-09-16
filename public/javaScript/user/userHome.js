document.addEventListener('DOMContentLoaded', (event) => {
  // pagination count buttons
  let pageNumber = 1
  let paginationCount = document.querySelectorAll('.paginationCount');
  for (let i = 0; i < paginationCount.length; i++) {
    paginationCount[i].addEventListener('click', async (event) => {
      event.preventDefault();
      pageNumber = parseInt(paginationCount[i].innerText); // Parse the text as an integer
      window.location.href = `/home/${pageNumber}`;
    })
  }




  //pagination prev button
  let prevButton = document.getElementById('prevButton')
  prevButton.addEventListener('click', (event) => {
    event.preventDefault()
    console.log(prevButton);
    let productsCount = prevButton.getAttribute('data-products-count')
    productsCount = parseInt(productsCount)
    if (pageNumber > 1) {
      pageNumber--
      window.location.href = `/home/${pageNumber}`;
    }


  })

  //pagination forward button
  let forwardButton = document.getElementById('forwardButton')
  forwardButton.addEventListener('click', (event) => {
    event.preventDefault()
    let productsCount = forwardButton.getAttribute('data-products-count')


    productsCount = parseInt(productsCount)

    if (pageNumber <productsCount) {
   
      pageNumber++
      window.location.href = `/home/${pageNumber}`;
      
      
   
    }


  })
});
// console.log("productsCount before ++", productsCount);
// console.log("pageNumber before ++", pageNumber);
// console.log("productsCount after ++", productsCount);
// console.log("pageNumber after ++", pageNumber);