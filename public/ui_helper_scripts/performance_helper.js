$(document).on("click", ".open-editPerf", function () {
    var myPerf = $(this).data('id');
    $(".modal-body #perfeditId").val(myPerf.id);
    $(".modal-body #perfmusceditId").val(myPerf.musicians_musician_id);
    $(".modal-body #perfmusceditFn").val(myPerf.first_name);
    $(".modal-body #perfmusceditLn").val(myPerf.last_name)
    $(".modal-body #perfalbid").val(myPerf.albums_album_id);
    $(".modal-body #perfalbname").val(myPerf.name);
});
