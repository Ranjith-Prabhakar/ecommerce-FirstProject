document.addEventListener('DOMContentLoaded', (e) => {
  // price sort
  let priceSort = document.querySelector('select[name="price"]');

  priceSort.addEventListener('change', (e) => {
      e.preventDefault();
      let sortValue = priceSort.value; // Use "value" instead of "Value"
      let brand = priceSort.getAttribute('data-brand');
      window.location.href = `/brandSort?brand=${brand}&sortValue=${sortValue}&criteria=unitPrice`;
  });

//date sort
let dateSort = document.querySelector('select[name="date"]');

dateSort.addEventListener('change', (e) => {
    console.log('inside the listener');
    e.preventDefault();
    let sortValue = dateSort.value; // Use "value" instead of "Value"
    let brand = dateSort.getAttribute('data-brand');
    console.log("sortValue", sortValue);
    console.log("brand", brand);
    window.location.href = `/brandSort?brand=${brand}&sortValue=${sortValue}&criteria=createdAt`;
});


});
