$(document).on("click", ".open-editGen", function () {
    var mygen = $(this).data('id');
    $(".modal-body #geneditId").val(mygen.id);
    $(".modal-body #geneditName").val(mygen.name);
});
