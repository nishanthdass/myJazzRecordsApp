// https://mdbootstrap.com/docs/b4/jquery/forms/search/#:~:text=Bootstrap%20search%20is%20a%20component,an%20even%20better%20user%20experience.

$(document).ready(function () {
    $("#tableSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});