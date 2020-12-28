//This is a bit of jquery that configures the checkout modal
$('#checkoutModal').modal({
    keyboard: false,
    backdrop: 'static',
    focus: false,
    show: false
});

function initCheckout() {
    //Open the modal
    $('#checkoutModal').modal('show');


}