
let newURL = window.location.protocol + "//" + window.location.host + '/listeners'


if (window.location.href == newURL) {
    // console.log(window.location.href)
    window.addEventListener("load", function () {
        document.getElementById("collection-check").addEventListener("change", function () {
            var selectobject;
            // document.getElementById("input-listColName").disabled = this.checked;
            selectobject = document.getElementById("input-listColName")
            selectobject.disabled = this.checked;
            // $("#input-listColName").selectpicker('refresh');
            // console.log(document.getElementById("input-listColName").disabled)
            // console.log(document.getElementById("input-listColName").getElementsByTagName("option"))

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
}

$(document).ready(function () {
    $("#tableSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});


// ADD
// Get the objects we need to modify
let addListForm = document.getElementById('add-listener');

// Modify the objects we need
if (addListForm) {
    addListForm.addEventListener("submit", function (e) {
        // console.log(e)

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
        // console.log(listCheckNewColValue)

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

// disableForm = (data) => {
//     let collectionForm = document.getElementById("input-listColName");

// }

addRowToListTable = (data, colCheck) => {
    console.log(data)

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("listener-table");
    // console.log(currentTable.className)
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
    console.log(newRow.listeners_id, newRow.name, newRow.email, newRow.collections_collection_id)
    editCell.setAttribute("data-id", "{'id':" + newRow.listeners_id + ", 'name':" + '"' + newRow.name + '"' + ",'email':" + '"' + newRow.email + '"' + ",'collection_id':" + '"' + newRow.collections_collection_id + '"' + "}");
    // $('select[name=modalSelectCol]').val(newRow.collections_collection_id); $('.selectpicker').selectpicker('refresh');
    console.log(colCheck)
    if (colCheck) {
        $('#modalSelectCol').append('<option value="' + newRow.collections_collection_id + '">' + newRow.collection_name + '</option>');
        $('select[name=modalSelectCol]').val(newRow.collections_collection_id); $('.selectpicker').selectpicker('refresh');
        $('#input-listColName').append('<option value="' + newRow.collections_collection_id + '">' + newRow.collection_name + '</option>');
        $('select[name=input-listColName]').val(newRow.collections_collection_id); $('.selectpicker').selectpicker('refresh');
    }
    $(editCell).modal('hide');

    viewcell = document.createElement("button");
    viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
    viewcell.className = "btn btn-info btn-small"

    actionCell.appendChild(editCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));
    actionCell.appendChild(deleteCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));
    actionCell.appendChild(viewcell);

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



$(document).on("click", ".open-editList", function () {
    var myList = $(this).data('id');

    if (typeof myList === 'string') {
        var string = myList
        eval('var obj=' + string);
        console.log(obj)
        $(".modal-body #listeditId").val(obj.id);
        $(".modal-body #listeditName").val(obj.name);
        $(".modal-body #listediEmail").val(obj.email);
        $(".modal-body #listeditColName").val(obj.collection_name);
        $('select[name=modalSelectCol]').val(obj.collection_id); $('.selectpicker').selectpicker('refresh');
    } else {
        console.log(myList)
        $(".modal-body #listeditId").val(myList.id);
        $(".modal-body #listeditName").val(myList.name);
        $(".modal-body #listediEmail").val(myList.email);
        $(".modal-body #listeditColName").val(myList.collection_name);
        $('select[name=modalSelectCol]').val(myList.collection_id); $('.selectpicker').selectpicker('refresh');
    }
});


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
        // let inputListColName = document.getElementById("listeditColName");
        let inputColSelect = document.getElementById("modalSelectCol");

        // Get the values from the form fields
        let listIdValue = inputListId.value;
        let listNameValue = inputListName.value;
        let listEmailValue = inputListEmail.value;
        // let listColNameValue = inputListColName.value;
        let listColIdSelectValue = inputColSelect.value;

        // currently the database table for bsg_people does not allow updating values to NULL
        // so we must abort if being bassed NULL for collectionName

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

        // console.log(data)

        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/listeners/edit-listeners", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                // console.log(colIdValue)
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



function updateListenerRow(data, listenerId, listName, listEmail, listColIdSelect) {
    // console.log(listenerId)
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


            row.deleteCell(5)

            let actionCell = document.createElement("TD");

            viewcell = document.createElement("button");
            viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
            viewcell.className = "btn btn-info btn-small"

            editCell = document.createElement("button");
            editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
            editCell.className = "open-editList btn btn-warning btn-small";
            editCell.setAttribute("data-toggle", "modal");
            editCell.setAttribute("href", "#renderEditList");
            // console.log(personID, colName)


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
            actionCell.appendChild(document.createTextNode('\u00A0'));
            actionCell.appendChild(viewcell)
            row.appendChild(actionCell);

        }
    }
}



//DELETE

// code for deletePerson function using jQuery
function deleteListener(listenerID) {
    // console.log("personID ", personID)

    let link = '/listeners/delete-listeners';
    let data = {
        id: listenerID
    };

    // console.log(data)

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            // console.log(result)
            deleteListRow(listenerID);
        },
        error: function (errorThrown) {
            // console.log(errorThrown)
            Success = false;//doesn't go here
        }
    });
}


function deleteListRow(listenerID) {

    let table = document.getElementById("listener-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // console.log(row)
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == listenerID) {
            table.deleteRow(i);
            break;
        }
    }
}
