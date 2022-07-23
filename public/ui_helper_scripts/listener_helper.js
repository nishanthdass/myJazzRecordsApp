$(document).on("click", ".open-editList", function () {
    var myList = $(this).data('id');
    $(".modal-body #listeditId").val(myList.id);
    $(".modal-body #listeditName").val(myList.name);
    $(".modal-body #listediEmail").val(myList.email);
    $(".modal-body #listeditColName").val(myList.collection_name);
});
