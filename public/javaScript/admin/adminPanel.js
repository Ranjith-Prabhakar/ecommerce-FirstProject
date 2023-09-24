document.addEventListener('DOMContentLoaded', () => {
  const canvasEl = document.getElementById('firstCan')
  let resultObj = canvasEl.getAttribute('data-result')
  resultObj = JSON.parse(resultObj)
  console.log('resultObj',resultObj);
  let brandLabels = resultObj.order.map(brands => brands._id)
  let brandOrderCount = resultObj.order.flatMap(brands => brands.totalSales);
  let brandSalesCount = resultObj.sold.flatMap(brands => brands.totalSales);

    // brand revenue
    (async function () {
   
      let brands = resultObj.brandRevenue.map(brands => brands._id)
      let brandCount = resultObj.brandRevenue.map(brands => brands.totalAmountReceived)
      new Chart(canvasEl,
        {
          type: 'doughnut',
          data: {
            labels: brands,
            datasets: [
              {
                label: 'No Of Products',
                data: brandCount
              }
            ]
          }
        }
      );
    })();

  //order and sale
  new Chart(document.getElementById('secondCan'), {
    type: 'bar',
    data: {
      labels: brandLabels,
      datasets: [{
        label: '# Total No Of Orders',
        data: brandOrderCount,
        borderWidth: 1
      },
      {
        label: '# Total No Of Sales',
        data: brandSalesCount,
        borderWidth: 1
      }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

//no of products and brand
  (async function () {
   
    let brands = resultObj.brandsAndProduct.map(brands => brands.brandName)
    let brandCount = resultObj.brandsAndProduct.map(brands => brands.noOfModels)
    new Chart(
      document.getElementById('thirdCan'),
      {
        type: 'line',
        data: {
          labels: brands,
          datasets: [
            {
              label: 'No Of Products',
              data: brandCount
            }
          ]
        }
      }
    );
  })();



})