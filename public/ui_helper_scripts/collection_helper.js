// Citation for the following function: addColForm, addRowToColTable, updateColForm, updateColRow, deleteCollection, deleteColRow
// Date: 8/08/2022
// Adapted from: Developing in Node.JS Module OSU CS340
// Source URL: https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461


// Citation for the Below function: 
// Date: 8/08/2022
// Adapted from: getbootstrap.com components page
// Source URL: https://getbootstrap.com/docs/4.0/components/modal/
// below function allows a POST Request to be made if user clicks the view button in collections page
$('#myModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var viewCol = button.data('id') // Extract info from data-* attributes
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/view-collection", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            sendViewColtoModal(xhttp.response, viewCol);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(viewCol));

    //  Below function renders data in view modal
    sendViewColtoModal = (data, viewCol) => {
        var modal = $(this)
        let jsonData = JSON.parse(data)
        if (jsonData.length > 2) {
            let musicianOne = jsonData[0]
            let musicianOneFirstName = musicianOne.first_name
            let musicianOneLastName = musicianOne.last_name
            let musicianOneRating = musicianOne.rating
            let collectionListener = musicianOne.ListName

            let musicianTwo = jsonData[1]
            let musicianTwoFirstName = musicianTwo.first_name
            let musicianTwoLastName = musicianTwo.last_name
            let musicianTwoRating = musicianTwo.rating

            let musicianThree = jsonData[2]
            let musicianThreeFirstName = musicianThree.first_name
            let musicianThreeLastName = musicianThree.last_name
            let musicianThreeRating = musicianThree.rating

            modal.find('.modal-title').text('Description of ' + viewCol.name)
            modal.find('.modal-body').text("This Collection belongs to " + collectionListener + ". Their top 3 Musicians are " + musicianOneFirstName + " " + musicianOneLastName + ", who has a rating of " + musicianOneRating + ", " + musicianTwoFirstName + " " + musicianTwoLastName + ", who has a rating of " + musicianTwoRating + ", and " + musicianThreeFirstName + " " + musicianThreeLastName + ", who has a rating of " + musicianThreeRating + ".");
        } else {
            modal.find('.modal-title').text('Description of ' + viewCol.name)
            modal.find('.modal-body').text("This Collection needs more performance ratings");
        }
    }
});


// ADD
// Get the objects we need to modify
let addColForm = document.getElementById('add-collection');

// Modify the objects we need
if (addColForm) {
    addColForm.addEventListener("submit", function (e) {
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
                addRowToColTable(xhttp.response);
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


addRowToColTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("collection-table");
    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 3 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let collectionNameCell = document.createElement("TD");
    let actionCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.collection_id;
    collectionNameCell.innerText = newRow.name;

    // render new buttons in new action cell
    deleteCell = document.createElement("button");
    deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
    deleteCell.onclick = function () {
        deleteCollection(newRow.collection_id);
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
    viewcell.className = "open-viewCol btn btn-info btn-small"
    viewcell.setAttribute("data-toggle", "modal");
    viewcell.setAttribute("data-target", "#myModal");
    viewcell.setAttribute("href", "#renderViewCol");
    viewcell.setAttribute("data-id", "{'id':" + newRow.collection_id + ", 'name':" + '"' + newRow.name + '"' + "}");
    $(viewcell).modal('hide');

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

}

// EDIT
// Bellow helper function to move data from front end tables to bootstrap modal for Update/Edit
// Citation for the below function:
// Date: 8/08/2022
// Adapted from: Stackoverflow answer by mg1075
// Source URL:  https://stackoverflow.com/questions/10626885/passing-data-to-a-bootstrap-modal
$(document).on("click", ".open-editCol", function () {
    var myCol = $(this).data('id');
    if (typeof myCol === 'string') {
        var string = myCol
        eval('var obj=' + string);
        $(".modal-body #coleditId").val(obj.id);
        $(".modal-body #coleditName").val(obj.name);
    } else {
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
        // close modal after submit
        $(".modal-header button").click();

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

        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/edit-collection", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                updateCollectionRow(xhttp.response, colIdValue, colNameValue);

            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
}


function updateCollectionRow(data, collectionID, colName) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("collection-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == collectionID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of collectionName value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign collectionName to our value we updated to
            td.innerHTML = parsedData[i - 1].name;

            // delete current Action cell
            row.deleteCell(2)

            // render new buttons in new action cell
            let actionCell = document.createElement("TD");

            viewcell = document.createElement("button");
            viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
            viewcell.className = "btn btn-info btn-small"

            editCell = document.createElement("button");
            editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
            editCell.className = "open-editCol btn btn-warning btn-small";
            editCell.setAttribute("data-toggle", "modal");
            editCell.setAttribute("href", "#renderEditCol");
            editCell.setAttribute("data-id", "{'id':" + collectionID + ", 'name':" + '"' + colName + '"' + "}");
            $(editCell).modal('hide');

            deleteCell = document.createElement("button");
            deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
            deleteCell.onclick = function () {
                deleteCollection(collectionID);
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
// code for deleteCollection function using jQuery
function deleteCollection(collectionID) {
    let link = '/delcol';
    let data = {
        id: collectionID
    };

    deleteCell = document.getElementById('deleteColBtn')

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteColRow(collectionID);
        },
        error: function (textStatus, errorThrown) {
            let delColErrRes = textStatus.responseText
            let parsedData = JSON.parse(delColErrRes);
            let errorMsg = parsedData.sqlMessage
            showCollectionDelError(errorMsg, collectionID)
            Success = false;
        }
    });
}

// render error function if cannot delete
function showCollectionDelError(delColErrRes, collectionID) {
    let table = document.getElementById("collection-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == collectionID) {

            // Get the location of the row where we found the matching person ID
            let deleteRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of collectionName value
            let td = deleteRowIndex.getElementsByTagName("td")[2];

            // popover configuration and content rendering
            // Citation for the below function:
            // Date: 8/08/2022
            // Adapted from: Stackoverflow answer by zim
            // Source URL:  https://stackoverflow.com/questions/68194421/how-do-you-create-and-modify-popover-in-bootstrap-5-using-jquery
            const bsPopover = new bootstrap.Popover(deleteRowIndex.querySelector('#deleteColBtn'), {
                placement: 'left',
                trigger: 'manual',
                html: true
            })
            bsPopover._config.content = delColErrRes
            bsPopover.show();
            $(document).click(function (e) {
                bsPopover.hide();
            })
        }
    }
}

// delete row render function
function deleteColRow(collectionID) {
    let table = document.getElementById("collection-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == collectionID) {
            table.deleteRow(i);
            break;
        }
    }
}
