document.addEventListener('DOMContentLoaded', (event) => {
  let change = document.querySelectorAll('button[name="Change"]')
  change.forEach(change => {
    change.addEventListener('click', (event) => {
      event.preventDefault()
      let bannerImg = event.target.getAttribute('data-img-no')
      console.log("imageNo",bannerImg);
      let change = document.querySelector('div[name="bannerChange"]' )
      console.log(change);
      change.classList.toggle('d-none')
      let hiddenInput = document.querySelector('input[name="imageName"]' )
      hiddenInput.value = "image" + bannerImg
      console.log("hiddenInput.value",hiddenInput.value);
    })
  })
})