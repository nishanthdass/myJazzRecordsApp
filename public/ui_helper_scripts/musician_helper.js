$(document).on("click", ".open-editMusc", function () {
    var myMusc = $(this).data('id');
    $(".modal-body #musceditId").val(myMusc.id);
    $(".modal-body #musceditFn").val(myMusc.first_name);
    $(".modal-body #musceditLn").val(myMusc.last_name);
    $(".modal-body #musceditInst").val(myMusc.instrument)
});
