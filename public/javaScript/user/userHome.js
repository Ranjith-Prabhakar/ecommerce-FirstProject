document.addEventListener('DOMContentLoaded', (event) => {
  // pagination count buttons
  let paginationCount = document.querySelectorAll('.paginationCount');
  for (let i = 0; i < paginationCount.length; i++) {
    paginationCount[i].addEventListener('click', async (event) => {
      event.preventDefault();
      const pageNumber = parseInt(paginationCount[i].innerText); // Parse the text as an integer
      console.log(`Clicked on page ${pageNumber}`);
      window.location.href = `/home/${pageNumber}`;
    });
  }

 ;

  console.log(paginationCount);

  //pagination prev button
  let prevButton = document.getElementById('prevButton')
  prevButton.addEventListener('click', (event) => {
    event.preventDefault()

  })
});
