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
