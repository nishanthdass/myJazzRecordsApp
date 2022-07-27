// ADD
// Get the objects we need to modify
let addAlbForm = document.getElementById('add-album');

// Modify the objects we need
if (addAlbForm) {
    addAlbForm.addEventListener("submit", function (e) {
        // console.log(e)

        // Prevent the form from submitting
        e.preventDefault();

        // Get form fields we need to get data from
        let inputAlbName = document.getElementById("input-albName");
        let inputAlbRec = document.getElementById("input-albRec");
        let inputAlbRel = document.getElementById("input-albRel");
        let inputAlbGen = document.getElementById("input-albGen");
        let inputAlbBlFn = document.getElementById("input-albBlFn");
        let inputAlbBlLn = document.getElementById("input-albBlLn");

        // Get the values from the form fields
        let albNameValue = inputAlbName.value;
        let albRecalue = inputAlbRec.value;
        let albRelValue = inputAlbRel.value;
        let albGenValue = inputAlbGen.value;
        let albBlFnValue = inputAlbBlFn.value;
        let albBlLnValue = inputAlbBlLn.value;

        // Put our data we want to send in a javascript object
        let data = {
            name: albNameValue,
            recYr: albRecalue,
            relYr: albRelValue,
            genre: albGenValue,
            bandFn: albBlFnValue,
            bandLn: albBlLnValue
        }


        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/albums/add-album", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {

            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                addRowToAlbTable(xhttp.response);

                // Clear the input fields for another transaction
                inputAlbName.value = '';
                inputAlbRec.value = '';
                inputAlbRel.value = '';
                inputAlbGen.value = '';
                inputAlbBlFn.value = '';
                inputAlbBlLn.value = '';

            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
};


addRowToAlbTable = (data) => {
    console.log(data)

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("albums-table");
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
    let albumNameCell = document.createElement("TD");
    let albumRecCell = document.createElement("TD");
    let albumRelCell = document.createElement("TD");
    let genreIdCell = document.createElement("TD");
    let genreNameCell = document.createElement("TD");
    let bandIdCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let LastNameCell = document.createElement("TD");
    let actionCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.album_id;
    albumNameCell.innerText = newRow.name;
    albumRecCell.innerText = newRow.recording_year;
    albumRelCell.innerText = newRow.release_year;
    genreIdCell.innerText = newRow.genres_genre_id;
    genreNameCell.innerText = newRow.genname;
    bandIdCell.innerText = newRow.bandleader_id;
    firstNameCell.innerText = newRow.first_name;
    LastNameCell.innerText = newRow.last_name;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
    deleteCell.onclick = function () {
        deleteAlbum(newRow.album_id);
    };
    deleteCell.className = "btn btn-danger btn-small";


    // editCell = document.createElement("button");
    // editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
    // editCell.className = "open-editList btn btn-warning btn-small";
    // editCell.setAttribute("data-toggle", "modal");
    // editCell.setAttribute("href", "#renderEditList");
    // console.log(newRow.listeners_id, newRow.name, newRow.email, newRow.collection_name)
    // editCell.setAttribute("data-id", "{'id':" + newRow.listeners_id + ", 'name':" + '"' + newRow.name + '"' + ",'email':" + '"' + newRow.email + '"' + ",'collection_name':" + '"' + newRow.collection_name + '"' + "}");
    // $(editCell).modal('hide');

    viewcell = document.createElement("button");
    viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
    viewcell.className = "btn btn-info btn-small"

    // actionCell.appendChild(editCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));
    actionCell.appendChild(deleteCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));
    actionCell.appendChild(viewcell);

    var tableRef = document.getElementById('albums-table').getElementsByTagName('tbody')[0];

    row.appendChild(idCell);
    row.appendChild(albumNameCell);
    row.appendChild(albumRecCell);
    row.appendChild(albumRelCell);
    row.appendChild(genreIdCell);
    row.appendChild(genreNameCell);
    row.appendChild(bandIdCell);
    row.appendChild(firstNameCell);
    row.appendChild(LastNameCell);


    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.album_id);
    tableRef.appendChild(row);

}





$(document).on("click", ".open-editAlb", function () {
    var myAlb = $(this).data('id');
    $(".modal-body #albeditId").val(myAlb.id);
    $(".modal-body #albeditName").val(myAlb.name);
    $(".modal-body #albeditRec").val(myAlb.recording_year);
    $(".modal-body #albeditRel").val(myAlb.release_year)
    $(".modal-body #albeditgenre").val(myAlb.genre_name);
    $(".modal-body #albeditfn").val(myAlb.first_name);
    $(".modal-body #albeditln").val(myAlb.last_name);
});


