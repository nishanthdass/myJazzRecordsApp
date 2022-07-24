$(document).on("click", ".open-editPerfRating", function () {
    var myPerfRat = $(this).data('id');
    $(".modal-body #perfrateditId").val(myPerfRat.id);
    $(".modal-body #perfrateditColId").val(myPerfRat.collections_collection_id);
    $(".modal-body #perfrateditColName").val(myPerfRat.ColName);
    $(".modal-body #perfrateditAlbId").val(myPerfRat.performances_albums_album_id)
    $(".modal-body #perfrateditAlbName").val(myPerfRat.AlbName);
    $(".modal-body #perfratRating").val(myPerfRat.rating);
});
