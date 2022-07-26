

// ADD
// Get the objects we need to modify
let addColForm = document.getElementById('add-collection');

// Modify the objects we need
if (addColForm) {
    addColForm.addEventListener("submit", function (e) {
        // console.log(e)

        // Prevent the form from submitting
        e.preventDefault();

        // Get form fields we need to get data from
        let inputColName = document.getElementById("input-colName");

        // Get the values from the form fields
        let colNameValue = inputColName.value;

        // Put our data we want to send in a javascript object
        let data = {
            name: colNameValue
        }


        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/add-collection", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {

            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                addRowToTable(xhttp.response);

                // Clear the input fields for another transaction
                inputColName.value = '';
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
};


addRowToTable = (data) => {
    // console.log(data)

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("collection-table");
    console.log(currentTable.className)
    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    // console.log(newRowIndex)

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    // console.log(parsedData)
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let collectionNameCell = document.createElement("TD");
    let actionCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.collection_id;
    collectionNameCell.innerText = newRow.name;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
    deleteCell.onclick = function () {
        deletePerson(newRow.collection_id);
    };
    deleteCell.className = "btn btn-danger btn-small";


    editCell = document.createElement("button");
    editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
    editCell.className = "open-editCol btn btn-warning btn-small";
    editCell.setAttribute("data-toggle", "modal");
    editCell.setAttribute("href", "#renderEditCol");
    editCell.setAttribute("data-id", "{'id':" + newRow.collection_id + ", 'name':" + '"' + newRow.name + '"' + "}");
    $(editCell).modal('hide');

    viewcell = document.createElement("button");
    viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
    viewcell.className = "btn btn-info btn-small"

    actionCell.appendChild(editCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));
    actionCell.appendChild(deleteCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));
    actionCell.appendChild(viewcell);

    var tableRef = document.getElementById('collection-table').getElementsByTagName('tbody')[0];

    row.appendChild(idCell);
    row.appendChild(collectionNameCell);
    row.appendChild(actionCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.collection_id);
    tableRef.appendChild(row);


    // // Start of new Step 8 code for adding new data to the dropdown menu for updating people

    // // Find drop down menu, create a new option, fill data in the option (full name, id),
    // // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    // let selectMenu = document.getElementById("mySelect");
    // let option = document.createElement("option");
    // option.text = newRow.fname + ' ' + newRow.lname;
    // option.value = newRow.id;
    // selectMenu.add(option);
    // // End of new step 8 code.
}


// EDIT

{/* <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script> */ }

// Helper function to move data from front end tables to bootstrap modal for Update/Edit
// https://stackoverflow.com/questions/10626885/passing-data-to-a-bootstrap-modal

$(document).on("click", ".open-editCol", function () {
    var myCol = $(this).data('id');

    if (typeof myCol === 'string') {
        var string = myCol
        eval('var obj=' + string);
        // console.log(obj.id)
        // console.log(obj.name)
        $(".modal-body #coleditId").val(obj.id);
        $(".modal-body #coleditName").val(obj.name);
    } else {
        // console.log(myCol.id)
        // console.log(myCol.name)
        $(".modal-body #coleditId").val(myCol.id);
        $(".modal-body #coleditName").val(myCol.name);
    }
});


// Get the objects we need to modify
let updateCollectionForm = document.getElementById('update-collection');


if (updateCollectionForm) {
    // Modify the objects we need
    updateCollectionForm.addEventListener("submit", function (e) {

        // Prevent the form from submitting
        e.preventDefault();

        // Get form fields we need to get data from
        let inputColId = document.getElementById("coleditId");
        let inputColName = document.getElementById("coleditName");

        // Get the values from the form fields
        let colIdValue = inputColId.value;
        let colNameValue = inputColName.value;

        // currently the database table for bsg_people does not allow updating values to NULL
        // so we must abort if being bassed NULL for collectionName

        if (isNaN(colIdValue)) {
            return;
        }

        // Put our data we want to send in a javascript object
        let data = {
            collectionId: colIdValue,
            collectionName: colNameValue,
        }

        console.log(data)

        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/put-person-ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                console.log(colIdValue)
                updateRow(xhttp.response, colIdValue, colNameValue);

            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
}


function updateRow(data, personID, colName) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("collection-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == personID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of collectionName value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign collectionName to our value we updated to
            td.innerHTML = parsedData[i - 1].name;

            // let actioncell = updateRowIndex.getElementsByTagName("td")[2];
            // console.log(actioncell)
            row.deleteCell(2)

            let actionCell = document.createElement("TD");

            viewcell = document.createElement("button");
            viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
            viewcell.className = "btn btn-info btn-small"

            editCell = document.createElement("button");
            editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
            editCell.className = "open-editCol btn btn-warning btn-small";
            editCell.setAttribute("data-toggle", "modal");
            editCell.setAttribute("href", "#renderEditCol");
            console.log(personID, colName)
            editCell.setAttribute("data-id", "{'id':" + personID + ", 'name':" + '"' + colName + '"' + "}");
            $(editCell).modal('hide');


            deleteCell = document.createElement("button");
            deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
            deleteCell.onclick = function () {
                deletePerson(personID);
            };
            deleteCell.className = "btn btn-danger btn-small";

            actionCell.appendChild(editCell)
            actionCell.appendChild(document.createTextNode('\u00A0'));
            actionCell.appendChild(deleteCell)
            actionCell.appendChild(document.createTextNode('\u00A0'));
            actionCell.appendChild(viewcell)
            row.appendChild(actionCell);

        }
    }
}






































//DELETE

// code for deletePerson function using jQuery
function deletePerson(personID) {
    // console.log("personID ", personID)

    let link = '/delcol';
    let data = {
        id: personID
    };

    // console.log(data)

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteRow(personID);
        }
    });
}


function deleteRow(personID) {

    let table = document.getElementById("collection-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // console.log(row)
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == personID) {
            table.deleteRow(i);
            break;

        }
    }
}
