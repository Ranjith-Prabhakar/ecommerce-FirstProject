document.addEventListener('DOMContentLoaded', (e) => {
  //criteria selection
  let criteria = document.getElementById('criteria');
  criteria.addEventListener('change', (event) => {
    event.preventDefault();
    let criteriaValue = criteria.value;
    console.log(criteriaValue);

    // Get all the divs with class 'hiddenDiv'
    let hiddenDivs = document.querySelectorAll('.hiddenDiv');

    // Loop through the hiddenDivs and hide them
    hiddenDivs.forEach((div) => {
      div.classList.add('d-none');
    });

    // Find the div with the ID equal to the selected criteriaValue and show it
    let unhiddenDiv = document.getElementById(criteriaValue);
    if (unhiddenDiv) {
      unhiddenDiv.classList.remove('d-none');
    }
  });


  //coupon form sending
  let couponForm = document.forms.couponForm

  couponForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    let formData = new FormData(couponForm)
    let newFormData = {}
    for (let [key, value] of formData) {
      newFormData[key] = value
    }



    try {
      const response = await fetch("/createCoupon", {
        method: 'POST',
        body: JSON.stringify({ newFormData }), // You may want to JSON.stringify the data if your server expects JSON
        headers: {
          "Content-Type": "application/json" // Set the content type if needed
        }
      })
      let data = await response.json()
      if (data.success) {
        window.location.reload()
      }
    } catch (error) {
      console.log(error.message);

    }

  })

  // cancell
  let cancell = document.querySelectorAll('button[name="cancell"]')
  cancell.forEach(cancell => {
    cancell.addEventListener('click', async (event) => {
      event.preventDefault()
      let button = event.target
      console.log("button", button);
      let couponData = {
        couponId: button.getAttribute('data-coupon-id'),
        value: button.innerText
      }
      console.log("couponData", couponData);

      if (button.innerText === "Cancell") {
        try {
          const response = await fetch('/couponCancell', {
            method: 'post',
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({ couponData })
          }).then(data => {
            console.log("fetch success");
            button.innerText = "Expired"
            button.setAttribute('disabled', 'true');
            button.classList.add('bg-danger')
          }).catch(err => console.log(err.message))
        } catch (error) {
          console.log(error.message);

        }
      }
    })
  })
})

// let couponUl = document.getElementById('couponUl')
// let childEl = document.createElement('tr')
// let td1 = document.createElement('td')
// td1.innerText = newFormData.couponCode
// childEl.appendChild(td1)
// couponUl.prepend(childEl)