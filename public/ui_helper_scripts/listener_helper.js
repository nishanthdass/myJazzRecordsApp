// Citation for the following function: addListForm, addRowToListTable, updateListenerForm, updateListenerRow, deleteListener, deleteListRow
// Date: 8/08/2022
// Adapted from: Developing in Node.JS Module OSU CS340
// Source URL: https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

// URL is refrences so that we can trigger a the below event listener when we are on the listeners page only
let newURL = window.location.protocol + "//" + window.location.host + '/listeners'

// event listener is used to indicate if the check box to create a new collection for the listener is checked
if (window.location.href == newURL) {
    window.addEventListener("load", function () {
        document.getElementById("collection-check").addEventListener("change", function () {
            var selectobject;
            selectobject = document.getElementById("input-listColName")
            selectobject.disabled = this.checked;
            if (this.checked) {
                document.getElementById("input-listColName").style.backgroundColor = "#A0A0A0";
                document.getElementById("input-listColName").value = ''
                $("#input-listColName").selectpicker('refresh');
            } else {
                document.getElementById("input-listColName").style.backgroundColor = "white";
                $("#input-listColName").selectpicker('refresh');
            }
        });
    });
};


// ADD
// Get the objects we need to modify
let addListForm = document.getElementById('add-listener');

// Modify the objects we need
if (addListForm) {
    addListForm.addEventListener("submit", function (e) {

        // Prevent the form from submitting
        e.preventDefault();

        // Get form fields we need to get data from
        let inputListName = document.getElementById("input-listName");
        let inputListEmail = document.getElementById("input-listEmail");
        let inputListColName = document.getElementById("input-listColName");
        let checkNewCollection = document.getElementById("collection-check");

        // Get the values from the form fields
        let listNameValue = inputListName.value;
        let listEmailalue = inputListEmail.value;
        let listColNameValue = inputListColName.value;
        let listCheckNewColValue = checkNewCollection.checked;

        // Put our data we want to send in a javascript object
        let data = {
            name: listNameValue,
            email: listEmailalue,
            colName: listColNameValue,
            colCheck: listCheckNewColValue
        }

        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/listeners/add-listener", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                addRowToListTable(xhttp.response, listCheckNewColValue);

                // Clear the input fields for another transaction
                inputListName.value = '';
                inputListEmail.value = '';
                checkNewCollection.checked = false
                document.getElementById("input-listColName").disabled = false
                $("#input-listColName").val('default').selectpicker("refresh");
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
};

// render newly added rows
addRowToListTable = (data, colCheck) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("listener-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let listenerNameCell = document.createElement("TD");
    let listenerEmailCell = document.createElement("TD");
    let listenerColIdCell = document.createElement("TD");
    let listenerColNameCell = document.createElement("TD");
    let actionCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.listeners_id;
    listenerNameCell.innerText = newRow.name;
    listenerEmailCell.innerText = newRow.email;
    listenerColIdCell.innerText = newRow.collections_collection_id;
    listenerColNameCell.innerText = newRow.collection_name;

    // render new buttons in new action cell
    deleteCell = document.createElement("button");
    deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
    deleteCell.onclick = function () {
        deleteListener(newRow.listeners_id);
    };
    deleteCell.className = "btn btn-danger btn-small";


    editCell = document.createElement("button");
    editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
    editCell.className = "open-editList btn btn-warning btn-small";
    editCell.setAttribute("data-toggle", "modal");
    editCell.setAttribute("href", "#renderEditList");
    editCell.setAttribute("data-id", "{'id':" + newRow.listeners_id + ", 'name':" + '"' + newRow.name + '"' + ",'email':" + '"' + newRow.email + '"' + ",'collection_id':" + '"' + newRow.collections_collection_id + '"' + "}");
    $(editCell).modal('hide');

    // clear check mark and insert new collection name to approprate edit modal
    if (colCheck) {
        $('#modalSelectCol').append('<option value="' + newRow.collections_collection_id + '">' + newRow.collection_name + '</option>');
        $('select[name=modalSelectCol]').val(newRow.collections_collection_id); $('.selectpicker').selectpicker('refresh');
        $('#input-listColName').append('<option value="' + newRow.collections_collection_id + '">' + newRow.collection_name + '</option>');
        $('select[name=input-listColName]').val(newRow.collections_collection_id); $('.selectpicker').selectpicker('refresh');
    }

    actionCell.appendChild(editCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));
    actionCell.appendChild(deleteCell);

    var tableRef = document.getElementById('listener-table').getElementsByTagName('tbody')[0];

    row.appendChild(idCell);
    row.appendChild(listenerNameCell);
    row.appendChild(listenerEmailCell);
    row.appendChild(listenerColIdCell);
    row.appendChild(listenerColNameCell);
    row.appendChild(actionCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.listeners_id);
    tableRef.appendChild(row);
}


// EDIT
// Bellow helper function to move data from front end tables to bootstrap modal for Update/Edit
// Citation for the below function:
// Date: 8/08/2022
// Adapted from: Stackoverflow answer by mg1075
// Source URL:  https://stackoverflow.com/questions/10626885/passing-data-to-a-bootstrap-modal
$(document).on("click", ".open-editList", function () {
    var myList = $(this).data('id');
    if (typeof myList === 'string') {
        var string = myList
        eval('var obj=' + string);
        $(".modal-body #listeditId").val(obj.id);
        $(".modal-body #listeditName").val(obj.name);
        $(".modal-body #listediEmail").val(obj.email);
        $(".modal-body #listeditColName").val(obj.collection_name);
        $('select[name=modalSelectCol]').val(obj.collection_id); $('.selectpicker').selectpicker('refresh');
    } else {
        $(".modal-body #listeditId").val(myList.id);
        $(".modal-body #listeditName").val(myList.name);
        $(".modal-body #listediEmail").val(myList.email);
        $(".modal-body #listeditColName").val(myList.collection_name);
        $('select[name=modalSelectCol]').val(myList.collection_id); $('.selectpicker').selectpicker('refresh');
    }
});

// Update
let updateListenerForm = document.getElementById('update-listener');

if (updateListenerForm) {
    // Modify the objects we need
    updateListenerForm.addEventListener("submit", function (e) {

        // Prevent the form from submitting
        e.preventDefault();
        $(".modal-header button").click();

        // Get form fields we need to get data from
        let inputListId = document.getElementById("listeditId");
        let inputListName = document.getElementById("listeditName");
        let inputListEmail = document.getElementById("listediEmail");
        let inputColSelect = document.getElementById("modalSelectCol");

        // Get the values from the form fields
        let listIdValue = inputListId.value;
        let listNameValue = inputListName.value;
        let listEmailValue = inputListEmail.value;
        let listColIdSelectValue = inputColSelect.value;

        if (isNaN(listIdValue)) {
            return;
        }

        if (isNaN(listColIdSelectValue)) {
            return;
        }

        // Put our data we want to send in a javascript object
        let data = {
            listenerId: listIdValue,
            listenerName: listNameValue,
            listenerEmail: listEmailValue,
            // listenerColName: listColNameValue,
            listenerColIdSelect: listColIdSelectValue
        }

        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/listeners/edit-listeners", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                // Add the new data to the table
                updateListenerRow(xhttp.response, listIdValue, listNameValue, listEmailValue, listColIdSelectValue);
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
}


// Update render rows
function updateListenerRow(data, listenerId, listName, listEmail, listColIdSelect) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("listener-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == listenerId) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of collectionName value
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            let td3 = updateRowIndex.getElementsByTagName("td")[3];
            let td4 = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign collectionName to our value we updated to
            td1.innerHTML = parsedData[i - 1].name;
            td2.innerHTML = parsedData[i - 1].email;
            td3.innerHTML = parsedData[i - 1].collections_collection_id;
            td4.innerHTML = parsedData[i - 1].collection_name;
            
            // Delete existing Action cell
            row.deleteCell(5)

            let actionCell = document.createElement("TD");

            // render new buttons in new action cell
            editCell = document.createElement("button");
            editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
            editCell.className = "open-editList btn btn-warning btn-small";
            editCell.setAttribute("data-toggle", "modal");
            editCell.setAttribute("href", "#renderEditList");
            editCell.setAttribute("data-id", "{'id':" + listenerId + ", 'name':" + '"' + listName + '"' + ",'email':" + '"' + listEmail + '"' + ",'collection_id':" + '"' + listColIdSelect + '"' + "}");
            $(editCell).modal('hide');

            deleteCell = document.createElement("button");
            deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
            deleteCell.onclick = function () {
                deleteListener(listenerId);
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
function deleteListener(listenerID) {
    let link = '/listeners/delete-listeners';
    let data = {
        id: listenerID
    };
    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteListRow(listenerID);
        },
        error: function (errorThrown) {
            Success = false;
        }
    });
}

function deleteListRow(listenerID) {
    let table = document.getElementById("listener-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == listenerID) {
            table.deleteRow(i);
            break;
        }
    }
}
