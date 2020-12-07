$('.js-ajax-form').on("submit", function(event) {
    $form = $(this);

    alert('the action is: ' + $form.attr('action'));
});