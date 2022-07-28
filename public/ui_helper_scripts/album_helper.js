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
    console.log(newRow)
    // console.log(data)

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


    editCell = document.createElement("button");
    editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
    editCell.className = "open-editAlb btn btn-warning btn-small";
    editCell.setAttribute("data-toggle", "modal");
    editCell.setAttribute("href", "#renderEditAlb");
    // console.log(newRow.listeners_id, newRow.name, newRow.email, newRow.collection_name)
    editCell.setAttribute("data-id", "{'id':" + newRow.album_id + ", 'name':" + '"' + newRow.name + '"' + ",'recording_year':" + '"' + newRow.recording_year + '"' + ",'release_year':" + '"' + newRow.release_year + '"' + ",'genre_id':" + '"' + newRow.genres_genre_id + '"' + ",'genre_name':" + '"' + newRow.genname + '"' + ",'bandleader_id':" + '"' + newRow.bandleader_id + '"' + ",'first_name':" + '"' + newRow.first_name + '"' + ",'last_name':" + '"' + newRow.last_name + '"' + "}");
    $(editCell).modal('hide');

    viewcell = document.createElement("button");
    viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
    viewcell.className = "btn btn-info btn-small"

    actionCell.appendChild(editCell);
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
    row.appendChild(actionCell);


    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.album_id);
    tableRef.appendChild(row);

}





$(document).on("click", ".open-editAlb", function () {
    var myAlb = $(this).data('id');
    if (typeof myAlb === 'string') {
        var string = myAlb
        eval('var obj=' + string);
        $(".modal-body #albeditId").val(obj.id);
        $(".modal-body #albeditName").val(obj.name);
        $(".modal-body #albeditRec").val(obj.recording_year);
        $(".modal-body #albeditRel").val(obj.release_year)
        $(".modal-body #albeditgenre").val(obj.genre_name);
        $(".modal-body #albeditfn").val(obj.first_name);
        $(".modal-body #albeditln").val(obj.last_name);

    } else {
        $(".modal-body #albeditId").val(myAlb.id);
        $(".modal-body #albeditName").val(myAlb.name);
        $(".modal-body #albeditRec").val(myAlb.recording_year);
        $(".modal-body #albeditRel").val(myAlb.release_year)
        $(".modal-body #albeditgenre").val(myAlb.genre_name);
        $(".modal-body #albeditfn").val(myAlb.first_name);
        $(".modal-body #albeditln").val(myAlb.last_name);
    }
});


// UPDATE

let updateAlbumForm = document.getElementById('update-album');


if (updateAlbumForm) {
    // Modify the objects we need
    updateAlbumForm.addEventListener("submit", function (e) {

        // Prevent the form from submitting
        e.preventDefault();
        $('#renderEditAlb').modal('hide');

        // Get form fields we need to get data from
        let inputAlbId = document.getElementById("albeditId");
        let inputAlbName = document.getElementById("albeditName");
        let inputAlbRec = document.getElementById("albeditRec");
        let inputAlbRel = document.getElementById("albeditRel");
        let inputAlbGen = document.getElementById("albeditgenre");
        let inputAlbBlFn = document.getElementById("albeditfn");
        let inputAlbBlLn = document.getElementById("albeditln");

        // Get the values from the form fields
        let albIdValue = inputAlbId.value;
        let albNameValue = inputAlbName.value;
        let albRecValue = inputAlbRec.value;
        let albRelValue = inputAlbRel.value;
        let albGenValue = inputAlbGen.value;
        let albBlFnValue = inputAlbBlFn.value;
        let albBlLnValue = inputAlbBlLn.value;

        // console.log(albIdValue, albNameValue, albRecValue, albRelValue, albGenValue, albBlFnValue, albBlLnValue)

        if (isNaN(albIdValue)) {
            return;
        }

        if (isNaN(albRecValue)) {
            return;
        }

        if (isNaN(albRelValue)) {
            return;
        }

        // Put our data we want to send in a javascript object
        let data = {
            albumId: albIdValue,
            albumName: albNameValue,
            albumRec: albRecValue,
            albumRel: albRelValue,
            albumGen: albGenValue,
            albumBlFn: albBlFnValue,
            albumBlLn: albBlLnValue
        }

        console.log(data)

        // console.log(data)

        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/albums/edit-album", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                // console.log(colIdValue)
                updateAlbumRow(xhttp.response, albIdValue, albNameValue, albRecValue, albRelValue, albGenValue, albBlFnValue, albBlLnValue);

            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
}


function updateAlbumRow(data, albId, albName, albRec, albRel, albGen, albBlFn, albBlLn) {
    // console.log(listenerId)
    let parsedData = JSON.parse(data);

    let table = document.getElementById("albums-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == albId) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of collectionName value
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            console.log(td1)


            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            console.log(td2)


            let td3 = updateRowIndex.getElementsByTagName("td")[3];
            console.log(td3)


            let td4 = updateRowIndex.getElementsByTagName("td")[4];
            console.log(td4)

            let td5 = updateRowIndex.getElementsByTagName("td")[5];
            console.log(td5)


            let td6 = updateRowIndex.getElementsByTagName("td")[6];
            console.log(td6)


            let td7 = updateRowIndex.getElementsByTagName("td")[7];
            console.log(td7)

            let td8 = updateRowIndex.getElementsByTagName("td")[8];
            console.log(td8)

            // Reassign collectionName to our value we updated to
            console.log(parsedData[i - 1])
            td1.innerHTML = parsedData[i - 1].name;

            td2.innerHTML = parsedData[i - 1].recording_year;

            td3.innerHTML = parsedData[i - 1].release_year;

            td4.innerHTML = parsedData[i - 1].genres_genre_id;

            td5.innerHTML = parsedData[i - 1].genname;

            td6.innerHTML = parsedData[i - 1].bandleader_id;

            td7.innerHTML = parsedData[i - 1].first_name;

            td8.innerHTML = parsedData[i - 1].last_name;


            row.deleteCell(9)

            let actionCell = document.createElement("TD");

            viewcell = document.createElement("button");
            viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
            viewcell.className = "btn btn-info btn-small"

            editCell = document.createElement("button");
            editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
            editCell.className = "open-editAlb btn btn-warning btn-small";
            editCell.setAttribute("data-toggle", "modal");
            editCell.setAttribute("href", "#renderEditAlb");
            // console.log(parsedData[i - 1])
            genId = parsedData[i - 1].genres_genre_id
            blId = parsedData[i - 1].bandleader_id
            console.log(albId, albName, albRec, albRel, genId, albGen, blId, albBlFn, albBlLn)


            editCell.setAttribute("data-id", "{'id':" + albId + ", 'name':" + '"' + albName + '"' + ",'recording_year':" + '"' + albRec + '"' + ",'release_year':" + '"' + albRel + '"' + ",'genre_id':" + '"' + genId + '"' + ",'genre_name':" + '"' + albGen + '"' + ",'bandleader_id':" + '"' + blId + '"' + ",'first_name':" + '"' + albBlFn + '"' + ",'last_name':" + '"' + albBlLn + '"' + "}");
            $(editCell).modal('hide');


            deleteCell = document.createElement("button");
            deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
            deleteCell.onclick = function () {
                deleteAlbum(albId);
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

function deleteAlbum(album_id) {

    let link = '/albums/delete-album';
    let data = {
        id: album_id
    };

    // console.log(data)

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteAlbRow(album_id);
        }
    });
}

function deleteAlbRow(album_id) {
    let table = document.getElementById("albums-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // console.log(row)
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == album_id) {
            table.deleteRow(i);
            break;

        }
    }
}