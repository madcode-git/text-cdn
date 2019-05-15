$("#contactForm").validator().on("submit", function (event) {
    if (event.isDefaultPrevented()) {
        // handle the invalid form...
        formError();
        submitMSG(false, "Please enter the text properly?");
    } else {
        // everything looks good!
        event.preventDefault();
        var response = grecaptcha.getResponse();
        if (!response) {
            formError();
            submitMSG(false, "You must complete Captcha!");
	    } else {
            submitForm();
	    }
    }
});


function submitForm(){
    // Initiate Variables With Form Content
    var message = $("#message").val();
    var lang = $("#lang").val();
    $("#form-submit").prop('disabled', true);
    $("#msgSubmit").delay( 800 ).empty();
    $('#activity_panel').showLoading();
    $.ajax({
        type: "POST",
        url: "process.php?action=tts",
        data: { 'message' : message, 'lang' : lang , 'captcha' : grecaptcha.getResponse() },
        dataType: 'json',
        success : function(text){
            if ( text.hasOwnProperty('success') ){
                $("#contactForm")[0].reset();
                grecaptcha.reset();
                submitMSG(true,'<a href="download.php?id='+Base64.encodeURI(text.success)+'">Download the file...</a>');
            } else {
                formError();
                submitMSG(false,text.error);
            }
        }
    });
}

function formSuccess(){
    $("#contactForm")[0].reset();
    submitMSG(true, "Message Submitted!")
}

function formError(){
    $("#contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $(this).removeClass();
    });
}

function submitMSG(valid, msg){
    if(valid){
        var msgClasses = "h3 text-center tada animated text-success";
    } else {
        var msgClasses = "h3 text-center text-danger";
    }
    $('#activity_panel').delay(500).hideLoading();
    $("#msgSubmit").removeClass().addClass(msgClasses).delay( 800 ).html(msg);
    $("#form-submit").prop('disabled', false);
}
