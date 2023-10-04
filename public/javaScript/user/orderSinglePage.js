
document.addEventListener('DOMContentLoaded', () => {

  //rating
  const index = document.querySelectorAll('div[name="index"]');
  index.forEach((div, index) => {
    let rate = document.querySelectorAll(`i[name=rate${index}]`);
    let reviewRateUserId = document.getElementById(`reviewRateUserId${index}`)
    rate.forEach((star, index) => {
      star.addEventListener('click', async (e) => {
        e.preventDefault();
        // Find the index of the clicked star within the NodeList
        const index = Array.from(rate).indexOf(star);


        // Toggle the filled star class for the clicked star and preceding siblings
        for (let i = 0; i <= index; i++) {
          rate[i].classList.replace("bi-star", "bi-star-fill");
        }

        // Remove the filled star class for the stars after the clicked star
        for (let i = index + 1; i < rate.length; i++) {
          rate[i].classList.replace("bi-star-fill", "bi-star");
        }

        let rating = {
          userId: reviewRateUserId.value,
          rating: index + 1,
          orderId: reviewRateUserId.getAttribute('data-orderId'),
          productId: reviewRateUserId.getAttribute('data-productId'),
          userName: reviewRateUserId.getAttribute('data-userName')
        }
        try {
          let response = await fetch('/rateProduct', {
            method: "post",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({ rating })
          })
          let data = await response.json()
          if (data.success) {
            console.log('success');
          }
        } catch (error) {
          console.log(error.message);

        }
      });
    });
  })



  //review

  index.forEach((div, index) => { //taken from above
    let reviewMessage = document.getElementById(`reviewMessage${index}`);
    //* making the button visible and invisible
    let submitReview = document.getElementById(`submitReview${index}`);
    reviewMessage.addEventListener('input', () => {
      if (reviewMessage.value.trim() !== '') {
        submitReview.classList.remove('d-none');
      } else {
        submitReview.classList.add('d-none');
      }
    });
  })

  //submitting the review
  index.forEach((div, index) => { //taken from above
    let submitReview = document.getElementById(`submitReview${index}`);
    submitReview.addEventListener('click', async (e) => {
      e.preventDefault()
      let reviewMessage = document.getElementById(`reviewMessage${index}`);
      if (reviewMessage.value.trim() !== "") {
        let reviewRateUserId = document.getElementById(`reviewRateUserId${index}`)
        let review = {
          userId: reviewRateUserId.value,
          orderId: reviewRateUserId.getAttribute('data-orderId'),
          productId: reviewRateUserId.getAttribute('data-productId'),
          userName: reviewRateUserId.getAttribute('data-userName'),
          review: reviewMessage.value
        }


        try {
          let response = await fetch('/reviewProduct', {
            method: "post",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({ review })
          })
          let data = await response.json()
          if (data.message) {
            Swal.fire('review has been updated')
          }
        } catch (error) {
          console.log(error.message);

        }
      }
    })
  })




});
