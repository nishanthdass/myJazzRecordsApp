// ADD
// Get the objects we need to modify
let addGenForm = document.getElementById('add-genre');

// Modify the objects we need
if (addGenForm) {
    addGenForm.addEventListener("submit", function (e) {
        // Prevent the form from submitting
        e.preventDefault();

        // Get form fields we need to get data from
        let inputGenName = document.getElementById("input-genName");

        // Get the values from the form fields
        let genNameValue = inputGenName.value;

        // Put our data we want to send in a javascript object
        let data = {
            name: genNameValue
        }

        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/add-genre", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                // Add the new data to the table
                addRowToGenTable(xhttp.response);
                // Clear the input fields for another transaction
                inputGenName.value = '';
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
};

// render newly added row
addRowToGenTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("genre-table");
    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let genreNameCell = document.createElement("TD");
    let actionCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.genre_id;
    genreNameCell.innerText = newRow.name;

    // render new buttons
    deleteCell = document.createElement("button");
    deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
    deleteCell.onclick = function () {
        deleteGenre(newRow.genre_id);
    };
    deleteCell.className = "btn btn-danger btn-small";

    editCell = document.createElement("button");
    editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
    editCell.className = "open-editGen btn btn-warning btn-small";
    editCell.setAttribute("data-toggle", "modal");
    editCell.setAttribute("href", "#renderEditGen");
    editCell.setAttribute("data-id", "{'id':" + newRow.genre_id + ", 'name':" + '"' + newRow.name + '"' + "}");
    $(editCell).modal('hide');

    actionCell.appendChild(editCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));
    actionCell.appendChild(deleteCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));
    // actionCell.appendChild(viewcell);

    var tableRef = document.getElementById('genre-table').getElementsByTagName('tbody')[0];

    row.appendChild(idCell);
    row.appendChild(genreNameCell);
    row.appendChild(actionCell);

    // Add a custom row attribute so the deleteGenreRow function can find a newly added row
    row.setAttribute('data-value', newRow.genre_id);
    tableRef.appendChild(row);
}


// EDIT
// Helper function to move data from front end tables to bootstrap modal for Update/Edit
// https://stackoverflow.com/questions/10626885/passing-data-to-a-bootstrap-modal
$(document).on("click", ".open-editGen", function () {
    var myGen = $(this).data('id');
    if (typeof myGen === 'string') {
        var string = myGen
        eval('var obj=' + string);
        $(".modal-body #geneditId").val(obj.id);
        $(".modal-body #geneditName").val(obj.name);
    } else {
        $(".modal-body #geneditId").val(myGen.id);
        $(".modal-body #geneditName").val(myGen.name);
    }
});

// Get the objects we need to modify
let updateGenreForm = document.getElementById('update-genre');

if (updateGenreForm) {
    // Modify the objects we need
    updateGenreForm.addEventListener("submit", function (e) {
        // Prevent the form from submitting
        e.preventDefault();
        $(".modal-header button").click();

        // Get form fields we need to get data from
        let inputGenId = document.getElementById("geneditId");
        let inputGenName = document.getElementById("geneditName");

        // Get the values from the form fields
        let genIdValue = inputGenId.value;
        let genNameValue = inputGenName.value;

        if (isNaN(genIdValue)) {
            return;
        }

        // Put our data we want to send in a javascript object
        let data = {
            genreId: genIdValue,
            genreName: genNameValue,
        }

        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/edit-genre", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                // Add the new data to the table
                updateGenreRow(xhttp.response, genIdValue, genNameValue);
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
}


function updateGenreRow(data, genreID, genName) {
    let parsedData = JSON.parse(data);
    let table = document.getElementById("genre-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == genreID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of genreName value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign genreName to our value we updated to
            td.innerHTML = parsedData[i - 1].name;

            // delete current action cell
            row.deleteCell(2)

            // render new action cell and buttons
            let actionCell = document.createElement("TD");

            editCell = document.createElement("button");
            editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
            editCell.className = "open-editGen btn btn-warning btn-small";
            editCell.setAttribute("data-toggle", "modal");
            editCell.setAttribute("href", "#renderEditGen");
            editCell.setAttribute("data-id", "{'id':" + genreID + ", 'name':" + '"' + genName + '"' + "}");
            $(editCell).modal('hide');

            deleteCell = document.createElement("button");
            deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
            deleteCell.onclick = function () {
                deleteGenre(genreID);
            };
            deleteCell.className = "btn btn-danger btn-small";

            actionCell.appendChild(editCell)
            actionCell.appendChild(document.createTextNode('\u00A0'));
            actionCell.appendChild(deleteCell)
            actionCell.appendChild(document.createTextNode('\u00A0'));
            // actionCell.appendChild(viewcell)
            row.appendChild(actionCell);

        }
    }
}

//DELETE
// code for deleteGenre function using jQuery
function deleteGenre(genreID) {
    let link = '/delgen';
    let data = {
        id: genreID
    };

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteGenreRow(genreID);
        }
    });
}

function deleteGenreRow(genreID) {
    let table = document.getElementById("genre-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == genreID) {
            table.deleteRow(i);
            break;
        }
    }
}


















// $(document).on("click", ".open-editGen", function () {
//     var mygen = $(this).data('id');
//     $(".modal-body #geneditId").val(mygen.id);
//     $(".modal-body #geneditName").val(mygen.name);
// });
