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
            }
        }
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
};


addRowToPerfRatingTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("perfrating-table");
    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let colIdCell = document.createElement("TD");
    let colNameCell = document.createElement("TD");
    let albumIdCell = document.createElement("TD");
    let albumNameCell = document.createElement("TD");
    let ratingCell = document.createElement("TD");
    let actionCell = document.createElement("TD");

    // // Fill the cells with correct data
    idCell.innerText = newRow.performance_rating_id;
    colIdCell.innerText = newRow.collections_collection_id;
    colNameCell.innerText = newRow.ColName;
    albumIdCell.innerText = newRow.performances_albums_album_id;
    albumNameCell.innerText = newRow.AlbName;
    ratingCell.innerHTML = newRow.rating;


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
    // console.log(newRow.listeners_id, newRow.name, newRow.email, newRow.collection_name)
    editCell.setAttribute("data-id", "{'id':" + newRow.performance_rating_id + ", 'collections_collection_id':" + '"' + newRow.collections_collection_id + '"' + ",'ColName':" + '"' + newRow.ColName + '"' + ",'performances_albums_album_id':" + '"' + newRow.performances_albums_album_id + '"' + ",'AlbName':" + '"' + newRow.AlbName + '"' + ",'rating':" + '"' + newRow.rating + '"' + "}");
    $(editCell).modal('hide');

    viewcell = document.createElement("button");
    viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
    viewcell.className = "btn btn-info btn-small"

    actionCell.appendChild(editCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));
    actionCell.appendChild(deleteCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));
    actionCell.appendChild(viewcell);

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

$(document).on("click", ".open-editPerfRating", function () {
    var myPerfRat = $(this).data('id');
    if (typeof myPerfRat === 'string') {
        var string = myPerfRat
        eval('var obj=' + string);
        console.log(obj)
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
            console.log(td)

            let td1 = updateRowIndex.getElementsByTagName("td")[2];
            console.log(td1)

            let td2 = updateRowIndex.getElementsByTagName("td")[3];

            let td3 = updateRowIndex.getElementsByTagName("td")[4];

            let td4 = updateRowIndex.getElementsByTagName("td")[5];

            td.innerHTML = parsedData[i - 1].collections_collection_id;
            td1.innerHTML = parsedData[i - 1].ColName;
            td2.innerHTML = parsedData[i - 1].performances_albums_album_id;
            td3.innerHTML = parsedData[i - 1].AlbName;
            td4.innerHTML = parsedData[i - 1].rating;


            row.deleteCell(6)

            let actionCell = document.createElement("TD");

            viewcell = document.createElement("button");
            viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
            viewcell.className = "btn btn-info btn-small"

            editCell = document.createElement("button");
            editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
            editCell.className = "open-editPerfRating btn btn-warning btn-small";
            editCell.setAttribute("data-toggle", "modal");
            editCell.setAttribute("href", "#renderEditPerfRating");
            // // console.log(parsedData[i - 1])
            collectionId = parsedData[i - 1].collections_collection_id
            colName = parsedData[i - 1].ColName
            albumId = parsedData[i - 1].performances_albums_album_id
            albumName = parsedData[i - 1].AlbName;
            rating = parsedData[i - 1].rating
            // console.log(albId, albName, albRec, albRel, genId, albGen, blId, albBlFn, albBlLn)
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
            actionCell.appendChild(document.createTextNode('\u00A0'));
            actionCell.appendChild(viewcell)
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