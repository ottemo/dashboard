
tinymce.PluginManager.add('gallery', function (editor) {

    var foundationUrl = angular.appConfigValue("general.app.foundation_url");

    var onclick = function () {
        var images, galleryPath;
        angular.element.get(foundationUrl + "/cms/gallery/path", function (data) {
            galleryPath = data.result;
        });
        angular.element.get(foundationUrl + "/cms/gallery/images", function (data) {
            images = data.result;

            editor.windowManager.open({
                title: 'Gallery',
                type: "container",
                html: getMyHTML(),
                width: 920,
                height: 520,
                resizable: true,
                scrollbars: true,
                buttons: [
                {
                text: "Insert",
                onclick: function () {
                         var args = top.tinymce.activeEditor.windowManager.getParams();
                         var link = args.src, name = args.alt;
                         link = link.split("/media/");
                         editor.insertContent('<p><img class="gallery-item" src="media/' + link[1] + '" alt="' + name + '" width="400" height="400" /></p>');
                     }
                },
                {
                    text: 'Close',
                    onclick: 'close'
                }]
            });
        });

        var getMyHTML = function () {
            var result = '<div style="width:880px; height:500px; padding-left:20px; overflow-y: scroll;" >';

            for (var i =0; i < images.length; i+=1){
                result = result + '<span style="display: block; float: left; margin:5px" onclick="top.tinymce.activeEditor.windowManager.setParams(this.firstChild)";>';
                result = result + '<img class="gallery-item" style="padding:5px; border: 1px solid black; width:150px; height:150px" src="' + "media/" + galleryPath + images[i]+ '" alt="' + images[i]+ '" width="150" height="150"/></span>';
            }
            result = result + "</div>";
            return result;
        };
    };

    var upload = function () {
    // uploading an image by ajax
        var uploadFile = function (upload) {
            var file = upload.currentTarget.files;
            var mediaName = file[0].name;
            var postData = new FormData();
            postData.append("file", file[0]);

            var url = foundationUrl + "/cms/gallery/image/" + mediaName;
            var req = {
                method: 'POST',
                url: url,
                data: postData,
                crossDomain: true,
                dataType: 'json',
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                }
            };

            angular.element.ajax(url, req).success(
            function (data) {
                if (data.error === null){
                    top.tinymce.activeEditor.windowManager.close();
                } else {
                    console.log("Some problems with uploading");
                }
            });
        };

        var data;
        editor.windowManager.open({
            title: 'Picture manager',
            bodyType: 'tabpanel',
            data:data,
            body: [{
                  title: 'Upload',
                  type: 'form',
                  items: [{name: 'file', type: 'textbox', subtype: 'file', label: 'Upload', onchange: uploadFile}]
                 }]
        });

    };

        // Add a button that opens a window
        editor.addButton('gallery', {
            "text": 'Gallery',
            "icon" : false,
            "onclick": onclick
        });

        // Add a button that opens a window
        editor.addButton('galleryUpload', {
            "text": 'Upload',
            "icon" : false,
            "onclick": upload
        });
        
});
