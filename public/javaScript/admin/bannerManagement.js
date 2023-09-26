document.addEventListener('DOMContentLoaded', (event) => {
  let change = document.querySelectorAll('button[name="Change"]')
  console.log("change", change);
  change.forEach(change => {
    change.addEventListener('click', (event) => {
      event.preventDefault()
      let bannerImg = event.target.getAttribute('data-img-no')
      let bannerId = event.target.getAttribute('data-bannerId')
      console.log("bannerImg", bannerImg);
      console.log("bannerId", bannerId);
     
      let changeImageName = document.getElementById('changeImageName')
      let changeBannerId = document.getElementById('bannerId')
      changeImageName.value = "image" + bannerImg
      changeBannerId.value = bannerId

      
    })
  })
})





// let changeDiscription = document.getElementById('changeDiscription')
      // let changeUnitPrice = document.getElementById('changeUnitPrice')
      // let changeLaunchDate = document.getElementById('changeLaunchDate')
      // let changeImage = document.getElementById('changeImage')


      // changeDiscription.value = parseBannerData.discription
      // changeUnitPrice.value = parseBannerData.unitPrice
      // changeLaunchDate.value = parseBannerData.launchDate
      // console.log("parseBannerData", parseBannerData);
      // console.log("imageNo",bannerImg);
      // let change = document.querySelector('div[name="bannerChange"]' )
      // console.log(change);
      // change.classList.toggle('d-none')
      // let hiddenInput = document.querySelector('input[name="imageName"]' )

      // console.log("hiddenInput.value",hiddenInput.value);