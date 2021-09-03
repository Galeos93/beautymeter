import { ajaxUtils } from '../js/ajax-utils';
import * as utils from '../js/utils';

class VideoCaptureSelector {
    constructor(selector) {
        this.videoCaptureUrl = "../snippets/video_capture_snippet.html";
        this.requestHandler = function (html) {
            utils.insertHtml(selector, html);
        };
    };

    render() {
        var request = ajaxUtils.buildGetRequest(this.videoCaptureUrl, this.requestHandler, false);
        if ('null' != this.postRenderFunction) {
            request.onload = this.post_render;
        };
        utils.insertLoadingIcon("#main-content")
        request.send(null);
    };

    post_render() {

        const canvas = document.querySelector("#canvas");
        const hidden_canvas = document.querySelector("#captured_frame");
        var video = document.querySelector("#video");
        var context = canvas.getContext("2d");
        var targetElem = document.querySelector("#main-content");
        targetElem.classList.add("picContainer");
        var photo_button = document.querySelector("#take-photo");

        function startVideo() {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            })



        }

        startVideo()

        video.addEventListener('loadedmetadata', () => {
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight;
            context.lineWidth = 4;
            context.strokeStyle = "#FFFFFF";
            var centerX = canvas.width / 2;
            var centerY = canvas.height * 0.45;
            var width = canvas.clientWidth;
            var height = canvas.clientHeight;
            context.beginPath();
            context.ellipse(centerX, centerY, height * 0.3, height * 0.4, 0, 0, 2 * Math.PI)
            context.stroke();
        })


        photo_button.addEventListener('click', () => {
            var hidden_context = hidden_canvas.getContext("2d");
            hidden_canvas.width = video.clientWidth;
            hidden_canvas.height = video.clientHeight;
            hidden_context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://attractiveness-backend-2bwctljf3a-uc.a.run.app/attractiveness/rate', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200){
                        var json_response = JSON.parse(xhr.response);
                        var result_displayer = new ResultDisplayer("#main-content", json_response["image"], json_response["score"].toString());
                        result_displayer.render()
                    }
                    else {
                        var json_response = JSON.parse(xhr.response);
                        var error_displayer = new ErrorDisplayer("#main-content", json_response["message"], xhr.status);
                        error_displayer.render()
                    }
                }
             }

            hidden_canvas.toBlob(function (blob) {
                const formData = new FormData();
                formData.append('file', blob, 'filename.png');
                // Add any event handlers here...
                utils.insertLoadingIcon("#main-content")
                xhr.send(formData);
            });
            

        })

    };
};

class ErrorDisplayer {
    constructor(selector, message, status_code) {
        this.message = message;
        this.status_code = status_code
        this.errorDisplayerURL = "../snippets/error_snippet.html";
        this.requestHandler = function (html) {
            html = utils.insertProperty(html, "error_message", message);
            html = utils.insertProperty(html, "error_status", status_code.toString());
            utils.insertHtml(selector, html);
        };
    }

    render() {
        var request = ajaxUtils.buildGetRequest(this.errorDisplayerURL, this.requestHandler, false);
        if ('null' != this.postRenderFunction) {
            request.onload = this.post_render;
        };
        request.send(null);

    };

};

class ResultDisplayer {
    constructor(selector, image, score) {
        this.image = image;
        this.score = score;
        this.resultDisplayer = "../snippets/score_result_snippet.html";
        var width_bar = this.get_bar_width(score)
        var color_bar = this.get_color_bar(score)
        this.requestHandler = function (html) {
            html = utils.insertProperty(html, "b64_image", image);
            html = utils.insertProperty(html, "score", score);
            html = utils.insertProperty(html, "width_bar", width_bar);
            html = utils.insertProperty(html, "color_bar", color_bar);
            utils.insertHtml(selector, html);
            
        };
    }

     get_color_bar(score) {
        var color_code = {2 : "bg-danger",
                          3 : "bg-warning",
                          4 : "bg-info",
                          5 : "bg-success"};
        for (var prop in color_code) {
            if (score <= prop){
                var color_bar = color_code[prop];
                break;
            } else {
                var color_bar = "bg-info";
            }
        }
        return color_bar
    };

    get_bar_width(score) {
        score = (score - 1)*25;
        return score.toFixed(2)
    };

    render() {
        var request = ajaxUtils.buildGetRequest(this.resultDisplayer, this.requestHandler, false);
        utils.insertLoadingIcon("#main-content")
        request.send(null);

    };

};

export { VideoCaptureSelector, ResultDisplayer, ErrorDisplayer };