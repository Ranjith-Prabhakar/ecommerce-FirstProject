document.addEventListener('DOMContentLoaded', (e) => {
  // price sort
  let priceSort = document.querySelector('select[name="price"]');

  priceSort.addEventListener('change', (e) => {
      e.preventDefault();
      let sortValue = priceSort.value; // Use "value" instead of "Value"
      let brand = priceSort.getAttribute('data-brand');
      window.location.href = `/userHomeSort?sortValue=${sortValue}&criteria=unitPrice&page=1`;
  });

//date sort
let dateSort = document.querySelector('select[name="date"]');

dateSort.addEventListener('change', (e) => {
    e.preventDefault();
    let sortValue = dateSort.value; // Use "value" instead of "Value"
    let brand = dateSort.getAttribute('data-brand');
    window.location.href = `/userHomeSort?sortValue=${sortValue}&criteria=createdAt&page=1`;
});


});
