// ADD
// Get the objects we need to modify
let addPerfForm = document.getElementById('add-performance');

// Modify the objects we need
if (addPerfForm) {
    addPerfForm.addEventListener("submit", function (e) {
        console.log(e)

        // Prevent the form from submitting
        e.preventDefault();

        // Get form fields we need to get data from
        let inputPerfFn = document.getElementById("input-perfFn");
        let inputPerfLn = document.getElementById("input-perfLn");
        let inputAlbName = document.getElementById("input-albName");

        // Get the values from the form fields
        let muscFnValue = inputPerfFn.value;
        let muscLnValue = inputPerfLn.value;
        let albNameValue = inputAlbName.value;

        // Put our data we want to send in a javascript object
        let data = {

            first_name: muscFnValue,
            last_name: muscLnValue,
            album_name: albNameValue
        }


        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/performances/add-performance", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {

            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                addRowToPerfTable(xhttp.response);

                // Clear the input fields for another transaction
                inputPerfFn.value = '';
                inputPerfLn.value = '';
                inputAlbName.value = '';
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
};

addRowToPerfTable = (data) => {
   
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("performance-table");
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
    let muscIDCell = document.createElement("TD");
    let muscFirstNameCell = document.createElement("TD");
    let muscLastNameCell = document.createElement("TD");
    let albIDCell = document.createElement("TD");
    let albNameCell = document.createElement("TD");
    let actionCell = document.createElement("TD");
    //console.log(newRow);
    // Fill the cells with correct data
    idCell.innerText = newRow.performance_id;
    muscIDCell.innerText = newRow.musicians_musician_id;
    muscFirstNameCell.innerText = newRow.first_name;
    muscLastNameCell.innerText = newRow.last_name;
    albIDCell.innerText = newRow.albums_album_id;
    albNameCell.innerText = newRow.name;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
    deleteCell.onclick = function () {
        console.log('deleting ', newRow.performance_id);
        deletePerformance(newRow.performance_id);
    };
    deleteCell.className = "btn btn-danger btn-small";


    editCell = document.createElement("button");
    editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
    editCell.className = "open-editPerf btn btn-warning btn-small";
    editCell.setAttribute("data-toggle", "modal");
    editCell.setAttribute("href", "#renderEditPerf");
    editCell.setAttribute("data-id", "{'id':" + newRow.performance_id + ", 'musician_id':" + newRow.musician_id + ", 'first_name':" + '"' + newRow.first_name + '"' + ", 'last_name':" + '"' + newRow.last_name + '"' + ", 'album_id':" + newRow.album_id + ", 'name':" + '"' + newRow.name + '"' + "}");
    $(editCell).modal('hide');

    // actionCell.appendChild(editCell);
    // actionCell.appendChild(document.createTextNode('\u00A0'));
    actionCell.appendChild(deleteCell);
    actionCell.appendChild(document.createTextNode('\u00A0'));
    

    var tableRef = document.getElementById('performance-table').getElementsByTagName('tbody')[0];

    // let idCell = document.createElement("TD");
    // let muscIDCell = document.createElement("TD");
    // let muscFirstNameCell = document.createElement("TD");
    // let muscLastNameCell = document.createElement("TD");
    // let albIDCell = document.createElement("TD");
    // let albNameCell = document.createElement("TD");
    // let actionCell = document.createElement("TD");

    row.appendChild(idCell);
    row.appendChild(muscIDCell)
    row.appendChild(muscFirstNameCell);
    row.appendChild(muscLastNameCell);
    row.appendChild(albIDCell);
    row.appendChild(albNameCell);
    row.appendChild(actionCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.performance_id);
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



$(document).on("click", ".open-editPerf", function () {
    var myPerf = $(this).data('id');
    console.log(myPerf)
    if (typeof myPerf === 'string') {
        var string = myPerf
        eval('var obj=' + string);
        $(".modal-body #perfeditId").val(obj.id);
        $(".modal-body #perfeditFn").val(obj.first_name);
        $(".modal-body #perfeditLn").val(obj.last_name);
        $(".modal-body #perfeditInst").val(obj.name);
    } else {

        $(".modal-body #perfeditId").val(myPerf.id);
        $(".modal-body #perfeditFn").val(myPerf.first_name);
        $(".modal-body #perfeditLn").val(myPerf.last_name);
        $(".modal-body #perfeditInst").val(myPerf.name);
    }

});


// Get the objects we need to modify
let updatePerfForm = document.getElementById('update-musician');


if (updatePerfForm) {
    // Modify the objects we need
    updatePerfForm.addEventListener("submit", function (e) {

        // Prevent the form from submitting
        e.preventDefault();
        $(".modal-header button").click();

        // Get form fields we need to get data from
        let inputPerfId = document.getElementById("perfeditId");
        let inputPerfFn = document.getElementById("perfeditFn");
        let inputPerfLn = document.getElementById("perfeditLn");
        let inputAlbName = document.getElementById("albName");

        // Get the values from the form fields
        let musIdValue = inputPerfId.value;
        let musFnValue = inputPerfFn.value;
        let musLnValue = inputPerfLn.value;
        let albNameValue = inputAlbName.value;

        // currently the database table for bsg_people does not allow updating values to NULL
        // so we must abort if being bassed NULL for collectionName

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

        // console.log(data)

        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/performances/edit-performance", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                // Add the new data to the table
                // console.log(colIdValue)
                updatePerfRow(xhttp.response, musIdValue, musFnValue, musLnValue, musInstrValue);


            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    })
}


function updatePerfRow(data, perfId, perfFn, perfLn, perfInstr) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("performance-table");

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

            // let actioncell = updateRowIndex.getElementsByTagName("td")[2];
            // console.log(actioncell)
            row.deleteCell(4)

            let actionCell = document.createElement("TD");

            viewcell = document.createElement("button");
            viewcell.innerHTML += `<i class="bi bi-eyeglasses"></i> View`;
            viewcell.className = "btn btn-info btn-small"

            // editCell = document.createElement("button");
            // editCell.innerHTML += `<i class="bi bi-pencil-square"></i> Edit`;
            // editCell.className = "open-editPerf btn btn-warning btn-small";
            // editCell.setAttribute("data-toggle", "modal");
            // editCell.setAttribute("href", "#renderEditPerf");
            // editCell.setAttribute("data-id", "{'id':" + muscId + ", 'first_name':" + '"' + muscFn + '"' + ", 'last_name':" + '"' + muscLn + '"' + ", 'instrument':" + '"' + muscInstr + '"' + "}");
            // $(editCell).modal('hide');


            deleteCell = document.createElement("button");
            deleteCell.innerHTML += `<i class="bi bi-trash3-fill"></i>Delete`;
            deleteCell.onclick = function () {
                deletePerformance(perfId);
            };
            deleteCell.className = "btn btn-danger btn-small";

            // actionCell.appendChild(editCell)
            // actionCell.appendChild(document.createTextNode('\u00A0'));
            actionCell.appendChild(deleteCell)
            actionCell.appendChild(document.createTextNode('\u00A0'));
            // actionCell.appendChild(viewcell)
            // row.appendChild(actionCell);

        }
    }
}


//DELETE

// code for deletePerson function using jQuery
function deletePerformance(performanceId) {
    // console.log("personID ", personID)

    let link = '/performances/delete-performance';
    let data = {
        id: performanceId
    };

    // console.log(data)

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deletePerfRow(performanceId);
        }
    });
}


function deletePerfRow(performanceId) {

    let table = document.getElementById("performance-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // console.log(row)
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == performanceId) {
            table.deleteRow(i);
            break;
        }
    }
}