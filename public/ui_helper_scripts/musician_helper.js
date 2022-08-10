// Citation for the following function: addMuscForm, addRowToMuscTable, updateMuscForm, updateMuscRow, deleteMusician, deleteMuscRow
// Date: 8/08/2022
// Adapted from: Developing in Node.JS Module OSU CS340
// Source URL: https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

// ADD
// Get the objects we need to modify
let addMuscForm = document.getElementById('add-musician');

// Modify the objects we need
if (addMuscForm) {
    addMuscForm.addEventListener("submit", function (e) {
        // Prevent the form from submitting
        e.preventDefault();

        // Get form fields we need to get data from
        let inputMuscFn = document.getElementById("input-musFn");
        let inputMuscLn = document.getElementById("input-musLn");
        let inputMuscInstr = document.getElementById("input-musInst");

        // Get the values from the form fields
        let muscFnValue = inputMuscFn.value;
        let muscLnValue = inputMuscLn.value;
        let muscInstrValue = inputMuscInstr.value;

        // Put our data we want to send in a javascript object
        let data = {
            first_name: muscFnValue,
            last_name: muscLnValue,
            instrument: muscInstrValue
        }


        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/musicians/add-musician", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                // Add the new data to the table
                addRowToMuscTable(xhttp.response);
                // Clear the input fields for another transaction
                inputMuscFn.value = '';
                inputMuscLn.value = '';
                inputMuscInstr.value = '';
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
};


addRowToMuscTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("musician-table");
    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 5 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let muscFirstNameCell = document.createElement("TD");
    let muscLastNameCell = document.createElement("TD");
    let muscInstrCell = document.createElement("TD");
    let actionCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.musician_id;
    muscFirstNameCell.innerText = newRow.first_name;
    muscLastNameCell.innerText = newRow.last_name;
    muscInstrCell.innerText = newRow.instrument;

    // render new buttons
    deleteCell = document.createElement("button");
    deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
    deleteCell.onclick = function () {
        deleteMusician(newRow.musician_id);
    };
    deleteCell.className = "btn btn-danger btn-small";

    editCell = document.createElement("button");
    editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
    editCell.className = "open-editMusc btn btn-warning btn-small";
    editCell.setAttribute("data-toggle", "modal");
    editCell.setAttribute("href", "#renderEditMusc");
    editCell.setAttribute("data-id", "{'id':" + newRow.musician_id + ", 'first_name':" + '"' + newRow.first_name + '"' + ", 'last_name':" + '"' + newRow.last_name + '"' + ", 'instrument':" + '"' + newRow.instrument + '"' + "}");
    $(editCell).modal('hide');

    // viewcell = document.createElement("button");
    // viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
    // viewcell.className = "btn btn-info btn-small"

    actionCell.appendChild(editCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));
    actionCell.appendChild(deleteCell);
    // actionCell.appendChild(document.createTextNode('\u00A0'));
    // actionCell.appendChild(viewcell);

    var tableRef = document.getElementById('musician-table').getElementsByTagName('tbody')[0];

    row.appendChild(idCell);
    row.appendChild(muscFirstNameCell);
    row.appendChild(muscLastNameCell);
    row.appendChild(muscInstrCell);
    row.appendChild(actionCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.musician_id);
    tableRef.appendChild(row);

}


// EDIT
// Bellow helper function to move data from front end tables to bootstrap modal for Update/Edit
// Citation for the below function:
// Date: 8/08/2022
// Adapted from: Stackoverflow answer by mg1075
// Source URL:  https://stackoverflow.com/questions/10626885/passing-data-to-a-bootstrap-modal
$(document).on("click", ".open-editMusc", function () {
    var myMusc = $(this).data('id');
    if (typeof myMusc === 'string') {
        var string = myMusc
        eval('var obj=' + string);
        $(".modal-body #musceditId").val(obj.id);
        $(".modal-body #musceditFn").val(obj.first_name);
        $(".modal-body #musceditLn").val(obj.last_name);
        $(".modal-body #musceditInst").val(obj.instrument);
    } else {

        $(".modal-body #musceditId").val(myMusc.id);
        $(".modal-body #musceditFn").val(myMusc.first_name);
        $(".modal-body #musceditLn").val(myMusc.last_name);
        $(".modal-body #musceditInst").val(myMusc.instrument);
    }

});

// Get the objects we need to modify
let updateMuscForm = document.getElementById('update-musician');

if (updateMuscForm) {
    // Modify the objects we need
    updateMuscForm.addEventListener("submit", function (e) {
        // Prevent the form from submitting
        e.preventDefault();
        $(".modal-header button").click();

        // Get form fields we need to get data from
        let inputMuscId = document.getElementById("musceditId");
        let inputMuscFn = document.getElementById("musceditFn");
        let inputMuscLn = document.getElementById("musceditLn");
        let inputMuscInstr = document.getElementById("musceditInst");

        // Get the values from the form fields
        let musIdValue = inputMuscId.value;
        let musFnValue = inputMuscFn.value;
        let musLnValue = inputMuscLn.value;
        let musInstrValue = inputMuscInstr.value;

        if (isNaN(musIdValue)) {
            return;
        }

        // Put our data we want to send in a javascript object
        let data = {
            musician_id: musIdValue,
            first_name: musFnValue,
            last_name: musLnValue,
            instrument: musInstrValue
        }

        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/musicians/edit-musician", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                updateMuscRow(xhttp.response, musIdValue, musFnValue, musLnValue, musInstrValue);
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
}

function updateMuscRow(data, muscId, muscFn, muscLn, muscInstr) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("musician-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == muscId) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of collectionName value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            let td2 = updateRowIndex.getElementsByTagName("td")[2];

            let td3 = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign collectionName to our value we updated to
            td.innerHTML = parsedData[i - 1].first_name;

            td2.innerHTML = parsedData[i - 1].last_name;

            td3.innerHTML = parsedData[i - 1].instrument;

            // delete current action cell
            row.deleteCell(4)

            let actionCell = document.createElement("TD");

            // viewcell = document.createElement("button");
            // viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
            // viewcell.className = "btn btn-info btn-small"

            editCell = document.createElement("button");
            editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
            editCell.className = "open-editMusc btn btn-warning btn-small";
            editCell.setAttribute("data-toggle", "modal");
            editCell.setAttribute("href", "#renderEditMusc");
            editCell.setAttribute("data-id", "{'id':" + muscId + ", 'first_name':" + '"' + muscFn + '"' + ", 'last_name':" + '"' + muscLn + '"' + ", 'instrument':" + '"' + muscInstr + '"' + "}");
            $(editCell).modal('hide');


            deleteCell = document.createElement("button");
            deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
            deleteCell.onclick = function () {
                deleteMusician(muscId);
            };
            deleteCell.className = "btn btn-danger btn-small";

            actionCell.appendChild(editCell)
            actionCell.appendChild(document.createTextNode('\u00A0'));
            actionCell.appendChild(deleteCell)
            // actionCell.appendChild(document.createTextNode('\u00A0'));
            // actionCell.appendChild(viewcell)
            row.appendChild(actionCell);
        }
    }
}


//DELETE

// code for deletePerson function using jQuery
function deleteMusician(musicianId) {
    let link = '/musicians/delete-musician';
    let data = {
        id: musicianId
    };

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteMuscRow(musicianId);
        }
    });
}

function deleteMuscRow(musicianId) {
    let table = document.getElementById("musician-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == musicianId) {
            table.deleteRow(i);
            break;
        }
    }
}