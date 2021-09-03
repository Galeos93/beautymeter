import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/app_style.css';
import * as utils from '../js/utils';
import * as components from '../js/components';

(function (global) {
    var selfieCaptureOptionsUrl = "./snippets/capture_selection_snippet.html";
    var dc = {};
    dc.VideoCaptureSelector = new components.VideoCaptureSelector("#main-content");

    document.addEventListener("DOMContentLoaded", 
        utils.insertHtmlFromUrl("#main-content", selfieCaptureOptionsUrl))

    function on_click_upload_selfie_button() {
        var reader = new FileReader();
        var upload_selfie_form = document.querySelector("#upload_selfie_form")

        upload_selfie_form.addEventListener("change", function () {

            var file = this.files[0];
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://attractiveness-backend-2bwctljf3a-uc.a.run.app/attractiveness/rate', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                     if (xhr.status === 200){
                        var json_response = JSON.parse(xhr.response);
                        var result_displayer = new components.ResultDisplayer("#main-content", json_response["image"], json_response["score"].toString());
                        result_displayer.render()
                    }
                    else {
                        var json_response = JSON.parse(xhr.response);
                        var error_displayer = new components.ErrorDisplayer("#main-content", json_response["message"], xhr.status);
                        error_displayer.render()
                    }
                }
            }

            const formData = new FormData();
            formData.append('file', file, 'filename.png');
            utils.insertLoadingIcon("#main-content")
            xhr.send(formData);
        });

        upload_selfie_form.click();
    }

    dc.on_click_upload_selfie_button = on_click_upload_selfie_button

    global.dc = dc;

})(window);
