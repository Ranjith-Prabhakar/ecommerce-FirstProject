document.addEventListener('DOMContentLoaded', () => {
//datatable.net
$('#table').DataTable();



  const submitDate = document.getElementsByName('submitDate')[0];
  let filter
  submitDate.addEventListener('click', (event) => {
    event.preventDefault();
    const delivered = document.getElementsByName('delivered')[0];
    let deliveredObj = delivered.getAttribute('data-object');
    deliveredObj = JSON.parse(deliveredObj);
    const fromDate = new Date(document.getElementById('fromDate').value);
    const toDate = new Date(document.getElementById('toDate').value);

    filter = deliveredObj.filter((item) => {
      const orderDate = new Date(item.orderDate);
      return orderDate >= fromDate && orderDate <= toDate;
    });

    let tableBody = document.getElementById('tableBody'); // Added 'document.'

    function addTableRow(count, orderDate, orderId, fullName, total) {
      const row = tableBody.insertRow();

      const cellCount = row.insertCell(0);
      cellCount.textContent = count;

      const cellOrderDate = row.insertCell(1);
      cellOrderDate.textContent = orderDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const cellOrderId = row.insertCell(2);
      cellOrderId.textContent = orderId;

      const cellFullName = row.insertCell(3);
      cellFullName.textContent = fullName;

      const cellTotal = row.insertCell(4);
      cellTotal.textContent = total;
    }

    // Clear existing rows in the table
    tableBody.innerHTML = '';

    let count = 1;
    filter.forEach((sales) => {
      const fullName = `${sales.firstName} ${sales.lastName}`;
      addTableRow(count, new Date(sales.orderDate), sales.orderId, fullName, sales.total); // Convert orderDate to Date object
      count++;
    });
  });

  let reset = document.getElementsByName('resetDate')[0]
  reset.addEventListener('click', (e) => {
    e.preventDefault()
    window.location.reload()
  })








  let exportFile = document.getElementById('export');

  exportFile.addEventListener('click', async(e) => {
    e.preventDefault();
    if (exportFile.value === 'excel') {
   
      exportAsExcel(); 
      exportFile.value = "default"
    } else if (exportFile.value === 'pdf') {
      await exportAsPDF(); 
      exportFile.value = "default"
    }
  });

  function exportAsExcel() {
    let table = document.getElementById('table');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Data');

    // Extract header row data
    const headerRow = table.rows[0];
    const headerData = [];
    for (let i = 0; i < headerRow.cells.length; i++) {
      headerData.push(headerRow.cells[i].innerText);
    }

    // Add the header row to the worksheet
    worksheet.addRow(headerData);

    // Extract and add data rows to the worksheet
    for (let i = 1; i < table.rows.length; i++) {
      const rowData = [];
      const row = table.rows[i];
      for (let j = 0; j < row.cells.length; j++) {
        rowData.push(row.cells[j].innerText);
      }
      worksheet.addRow(rowData);
    }

    // Create a buffer and save the Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'sales_report.xlsx'); // Download the file as 'sales_report.xlsx'
    });

    
  }



  async function exportAsPDF() {
    const { jsPDF } = window.jspdf; // Get jsPDF from the window object
    const doc = new jsPDF();
  
    // Define the table options
    const options = {
      html: '#table', // Use the table with id "table"
      startY: 20, // Set the starting Y position for the table
      theme: 'striped', // Apply a striped theme to the table
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }, // Header styles
    };
  
    // Generate the PDF with the table
    doc.autoTable(options);
  
    // Save the PDF with the specified name
    doc.save('sales_report.pdf');
  }
  

  
  
});
