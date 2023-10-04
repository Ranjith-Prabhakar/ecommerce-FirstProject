document.addEventListener('DOMContentLoaded', (event) => {
  let change = document.querySelectorAll('button[name="Change"]')
  change.forEach(change => {
    change.addEventListener('click', (event) => {
      event.preventDefault()
      let bannerImg = event.target.getAttribute('data-img-no')
      let bannerId = event.target.getAttribute('data-bannerId')
      let changeImageName = document.getElementById('changeImageName')
      let changeBannerId = document.getElementById('bannerId')
      changeImageName.value = "image" + bannerImg
      changeBannerId.value = bannerId
    })
  })
})