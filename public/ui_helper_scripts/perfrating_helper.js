// Citation for the following function: addPerfRatingForm, addRowToPerfRatingTable, updatePerfRatingForm, updatePerfRatingRow, deletePerfRating, deletePerfRatingRow
// Date: 8/08/2022
// Adapted from: Developing in Node.JS Module OSU CS340
// Source URL: https://canvas.oregonstate.edu/courses/1879182/pages/exploration-developing-in-node-dot-js?module_item_id=22241461

// ADD
// Get the objects we need to modify
let addPerfRatingForm = document.getElementById('add-perfrating');

// Modify the objects we need
if (addPerfRatingForm) {
    addPerfRatingForm.addEventListener("submit", function (e) {
        // Prevent the form from submitting
        e.preventDefault();

        // Get form fields we need to get data from
        let inputPerfrateColName = document.getElementById("input-perfrateColName");
        let inputPerfrateAlbName = document.getElementById("input-perfrateAlbName");
        let inputPerfrateRating = document.getElementById("input-perfrateRating");

        // Get the values from the form fields
        let perfrateColNameValue = inputPerfrateColName.value;
        let perfrateAlbNameValue = inputPerfrateAlbName.value;
        let perfrateRatingValue = inputPerfrateRating.value;

        // Put our data we want to send in a javascript object
        let data = {
            colName: perfrateColNameValue,
            albName: perfrateAlbNameValue,
            rating: perfrateRatingValue
        }

        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/perfratings/add-perfrating", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                // Add the new data to the table
                addRowToPerfRatingTable(xhttp.response);
                // Clear the input fields for another transaction
                inputPerfrateRating.value = '';
                $("#input-perfrateColName").val('default').selectpicker("refresh");
                $("#input-perfrateAlbName").val('default').selectpicker("refresh");
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
                showPerfRatingInsertError(xhttp.response)
            }
        }
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
};

function showPerfRatingInsertError(insertPerfRatErr) {
    // popover configuration and content rendering
    // Citation for the below function:
    // Date: 8/08/2022
    // Adapted from: Stackoverflow answer by zim
    // Source URL:  https://stackoverflow.com/questions/68194421/how-do-you-create-and-modify-popover-in-bootstrap-5-using-jquery
    const bsPopover = new bootstrap.Popover(document.querySelector('#insert-perfRatingBtn'), {
        placement: 'right',
        trigger: 'manual',
        html: true
    })

    bsPopover._config.content = insertPerfRatErr
    bsPopover.show();
    $(document).click(function (e) {
        bsPopover.hide();
    })
}

// render newly added row
addRowToPerfRatingTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("perfrating-table");
    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 7 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let colIdCell = document.createElement("TD");
    let colNameCell = document.createElement("TD");
    let albumIdCell = document.createElement("TD");
    let albumNameCell = document.createElement("TD");
    let ratingCell = document.createElement("TD");
    let actionCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.performance_rating_id;
    colIdCell.innerText = newRow.collections_collection_id;
    colNameCell.innerText = newRow.ColName;
    albumIdCell.innerText = newRow.performances_albums_album_id;
    albumNameCell.innerText = newRow.AlbName;
    ratingCell.innerHTML = newRow.rating;

    // render new buttons
    deleteCell = document.createElement("button");
    deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
    deleteCell.onclick = function () {
        deletePerfRating(newRow.performance_rating_id);
    };
    deleteCell.className = "btn btn-danger btn-small";

    editCell = document.createElement("button");
    editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
    editCell.className = "open-editPerfRating btn btn-warning btn-small";
    editCell.setAttribute("data-toggle", "modal");
    editCell.setAttribute("href", "#renderEditPerfRating");
    editCell.setAttribute("data-id", "{'id':" + newRow.performance_rating_id + ", 'collections_collection_id':" + '"' + newRow.collections_collection_id + '"' + ",'ColName':" + '"' + newRow.ColName + '"' + ",'performances_albums_album_id':" + '"' + newRow.performances_albums_album_id + '"' + ",'AlbName':" + '"' + newRow.AlbName + '"' + ",'rating':" + '"' + newRow.rating + '"' + "}");
    $(editCell).modal('hide');

    // viewcell = document.createElement("button");
    // viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
    // viewcell.className = "btn btn-info btn-small"

    actionCell.appendChild(editCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));
    actionCell.appendChild(deleteCell);
    // actionCell.appendChild(document.createTextNode('\u00A0'));
    // actionCell.appendChild(viewcell);

    var tableRef = document.getElementById('perfrating-table').getElementsByTagName('tbody')[0];

    row.appendChild(idCell);
    row.appendChild(colIdCell);
    row.appendChild(colNameCell);
    row.appendChild(albumIdCell);
    row.appendChild(albumNameCell);
    row.appendChild(ratingCell);
    row.appendChild(actionCell);

    // // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.performance_rating_id);
    tableRef.appendChild(row);
}

// EDIT
// Bellow helper function to move data from front end tables to bootstrap modal for Update/Edit
// Citation for the below function:
// Date: 8/08/2022
// Adapted from: Stackoverflow answer by mg1075
// Source URL:  https://stackoverflow.com/questions/10626885/passing-data-to-a-bootstrap-modal
$(document).on("click", ".open-editPerfRating", function () {
    var myPerfRat = $(this).data('id');
    if (typeof myPerfRat === 'string') {
        var string = myPerfRat
        eval('var obj=' + string);
        $(".modal-body #perfrateditId").val(obj.id);
        $(".modal-body #perfrateditColId").val(obj.collections_collection_id);
        $(".modal-body #perfrateditColName").val(obj.ColName);
        $(".modal-body #perfrateditAlbId").val(obj.performances_albums_album_id)
        $(".modal-body #perfrateditAlbName").val(obj.AlbName);
        $(".modal-body #perfratRating").val(obj.rating);

    } else {
        $(".modal-body #perfrateditId").val(myPerfRat.id);
        $(".modal-body #perfrateditColId").val(myPerfRat.collections_collection_id);
        $(".modal-body #perfrateditColName").val(myPerfRat.ColName);
        $(".modal-body #perfrateditAlbId").val(myPerfRat.performances_albums_album_id)
        $(".modal-body #perfrateditAlbName").val(myPerfRat.AlbName);
        $(".modal-body #perfratRating").val(myPerfRat.rating);
    }
});


// UPDATE
let updatePerfRatingForm = document.getElementById('update-perfrating');

if (updatePerfRatingForm) {
    // Modify the objects we need
    updatePerfRatingForm.addEventListener("submit", function (e) {

        // Prevent the form from submitting
        e.preventDefault();
        $(".modal-header button").click();

        // Get form fields we need to get data from
        let inputPerfRateRId = document.getElementById("perfrateditId");
        let inputPerfRateColId = document.getElementById("perfrateditColId");
        let inputPerfRateColName = document.getElementById("perfrateditColName");
        let inputPerfRateAlbId = document.getElementById("perfrateditAlbId");
        let inputPerfRateAlbName = document.getElementById("perfrateditAlbName");
        let inputPerfRateRating = document.getElementById("perfratRating");

        // Get the values from the form fields
        let perfRateIdValue = inputPerfRateRId.value;
        let perfRateColIdValue = inputPerfRateColId.value;
        let perfRateColNameValue = inputPerfRateColName.value;
        let perfRateAlbIDValue = inputPerfRateAlbId.value;
        let perfRateAlbNameValue = inputPerfRateAlbName.value;
        let perfRateRatingValue = inputPerfRateRating.value;

        if (isNaN(perfRateIdValue)) {
            return;
        }

        if (isNaN(perfRateColIdValue)) {
            return;
        }

        if (isNaN(perfRateAlbIDValue)) {
            return;
        }
        if (isNaN(perfRateRatingValue)) {
            return;
        }

        // Put our data we want to send in a javascript object
        let data = {
            perfRateId: perfRateIdValue,
            colId: perfRateColIdValue,
            colName: perfRateColNameValue,
            albId: perfRateAlbIDValue,
            albName: perfRateAlbNameValue,
            rating: perfRateRatingValue
        }

        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/perfratings/edit-perfrating", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                updatePerfRatingRow(xhttp.response, perfRateIdValue);
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
}


function updatePerfRatingRow(data, perfRateIdValue) {

    let parsedData = JSON.parse(data);

    let table = document.getElementById("perfrating-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == perfRateIdValue) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of collectionName value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            let td1 = updateRowIndex.getElementsByTagName("td")[2];

            let td2 = updateRowIndex.getElementsByTagName("td")[3];

            let td3 = updateRowIndex.getElementsByTagName("td")[4];

            let td4 = updateRowIndex.getElementsByTagName("td")[5];

            td.innerHTML = parsedData[i - 1].collections_collection_id;
            td1.innerHTML = parsedData[i - 1].ColName;
            td2.innerHTML = parsedData[i - 1].performances_albums_album_id;
            td3.innerHTML = parsedData[i - 1].AlbName;
            td4.innerHTML = parsedData[i - 1].rating;

            // delete current action cell
            row.deleteCell(6)

            // render new action cell and butons
            let actionCell = document.createElement("TD");

            // viewcell = document.createElement("button");
            // viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
            // viewcell.className = "btn btn-info btn-small"

            editCell = document.createElement("button");
            editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
            editCell.className = "open-editPerfRating btn btn-warning btn-small";
            editCell.setAttribute("data-toggle", "modal");
            editCell.setAttribute("href", "#renderEditPerfRating");
            collectionId = parsedData[i - 1].collections_collection_id
            colName = parsedData[i - 1].ColName
            albumId = parsedData[i - 1].performances_albums_album_id
            albumName = parsedData[i - 1].AlbName;
            rating = parsedData[i - 1].rating
            editCell.setAttribute("data-id", "{'id':" + perfRateIdValue + ", 'collections_collection_id':" + '"' + collectionId + '"' + ",'ColName':" + '"' + colName + '"' + ",'performances_albums_album_id':" + '"' + albumId + '"' + ",'AlbName':" + '"' + albumName + '"' + ",'rating':" + '"' + rating + '"' + "}");
            $(editCell).modal('hide');

            deleteCell = document.createElement("button");
            deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
            deleteCell.onclick = function () {
                deletePerfRating(perfRateIdValue);
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
function deletePerfRating(perfRating_id) {
    let link = '/perfratings/delete-perfrating';
    let data = {
        id: perfRating_id
    };

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deletePerfRatingRow(perfRating_id);
        }
    });
}

function deletePerfRatingRow(perfRating_id) {
    let table = document.getElementById("perfrating-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == perfRating_id) {
            table.deleteRow(i);
            break;
        }
    }
}