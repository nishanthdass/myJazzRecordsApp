// Citation for the following function: addPerfForm, addRowToPerfTable, updatePerfForm, updatePerfRow, deletePerformance, deletePerfRow
// Date: 8/08/2022
// Adapted from: Developing in Node.JS Module OSU CS340
// Source URL: https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

// ADD
// Get the objects we need to modify
let addPerfForm = document.getElementById('add-performance');

// Modify the objects we need
if (addPerfForm) {
    addPerfForm.addEventListener("submit", function (e) {
        // Prevent the form from submitting
        e.preventDefault();

        // Get form fields we need to get data from
        let inputPerfFn = document.getElementById("input-perfFn");
        let inputPerfLn = document.getElementById("input-perfLn");
        let inputAlbName = document.getElementById("input-albName");

        // Get the values from the form fields
        let muscFnValue = inputPerfFn.value;
        let muscLnValue = inputPerfLn.value;
        let albNameValue = inputAlbName.value;

        // Put our data we want to send in a javascript object
        let data = {
            first_name: muscFnValue,
            last_name: muscLnValue,
            album_name: albNameValue
        }

        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/performances/add-performance", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                // Add the new data to the table
                addRowToPerfTable(xhttp.response);
                // Clear the input fields for another transaction
                inputPerfFn.value = '';
                inputPerfLn.value = '';
                inputAlbName.value = '';
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
};

addRowToPerfTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("performance-table");
    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let muscIDCell = document.createElement("TD");
    let muscFirstNameCell = document.createElement("TD");
    let muscLastNameCell = document.createElement("TD");
    let albIDCell = document.createElement("TD");
    let albNameCell = document.createElement("TD");
    let actionCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.performance_id;
    muscIDCell.innerText = newRow.musicians_musician_id;
    muscFirstNameCell.innerText = newRow.first_name;
    muscLastNameCell.innerText = newRow.last_name;
    albIDCell.innerText = newRow.albums_album_id;
    albNameCell.innerText = newRow.name;

    // render new buttons
    deleteCell = document.createElement("button");
    deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
    deleteCell.onclick = function () {
        deletePerformance(newRow.performance_id);
    };
    deleteCell.className = "btn btn-danger btn-small";

    editCell = document.createElement("button");
    editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
    editCell.className = "open-editPerf btn btn-warning btn-small";
    editCell.setAttribute("data-toggle", "modal");
    editCell.setAttribute("href", "#renderEditPerf");
    editCell.setAttribute("data-id", "{'id':" + newRow.performance_id + ", 'musician_id':" + newRow.musician_id + ", 'first_name':" + '"' + newRow.first_name + '"' + ", 'last_name':" + '"' + newRow.last_name + '"' + ", 'album_id':" + newRow.album_id + ", 'name':" + '"' + newRow.name + '"' + "}");
    $(editCell).modal('hide');

    actionCell.appendChild(deleteCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));

    var tableRef = document.getElementById('performance-table').getElementsByTagName('tbody')[0];

    row.appendChild(idCell);
    row.appendChild(muscIDCell);
    row.appendChild(muscFirstNameCell);
    row.appendChild(muscLastNameCell);
    row.appendChild(albIDCell);
    row.appendChild(albNameCell);
    row.appendChild(actionCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.performance_id);
    tableRef.appendChild(row);
}

//DELETE
// code for deletePerformance function using jQuery
function deletePerformance(performanceId) {
    let link = '/performances/delete-performance';
    let data = {
        id: performanceId
    };

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deletePerfRow(performanceId);
        }
    });
}

function deletePerfRow(performanceId) {

    let table = document.getElementById("performance-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == performanceId) {
            table.deleteRow(i);
            break;
        }
    }
}