// Helper function to move data from front end tables to bootstrap modal for Update/Edit
// https://stackoverflow.com/questions/10626885/passing-data-to-a-bootstrap-modal

$(document).on("click", ".open-editCol", function () {
    var myCol = $(this).data('id');
    $(".modal-body #coleditId").val(myCol.id);
    $(".modal-body #coleditName").val(myCol.name);
});
