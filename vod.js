javascript: (function() {
    const qualities = {
        24000000: "UHD 3840x2160 (10 Mb/s)",
        16000000: "Quad HD 2560x1440 (7,5 Mb/s)",
        9100000: "Full HD 1920x1080 (5 Mb/s)",
        5420000: "HD 1280x720 (3,6 Mb/s)",
        2850000: "SD 960x540 (2,2 Mb/s)",
        1750000: "SD 800x450 (1,3 Mb/s)",
        1500000: "SD 720x404 (1,1 Mb/s)",
        1250000: "SD 640x360 (933 kb/s)",
        820000: "SD 480x270 (734 kb/s)",
        590000: "SD 398x224 (534 kb/s)"
    };

    getLink();

    function getLink() {
        let lastComma = window.location.href.lastIndexOf(",");
        if (lastComma > -1) {
            let videoId = window.location.href.substring(lastComma + 1);
            let responseOldId = getUrl("https://vod.tvp.pl/api/products/vods/" + videoId + "?lang=pl&platform=BROWSER");
			responseOldId = JSON.parse(responseOldId);
            let response = getUrl("https://vod.tvp.pl/sess/TVPlayer2/api.php?id=" + responseOldId.externalUid + "&@method=getTvpConfig&@callback=callback");
			response = response.substring(response.indexOf("{"), response.lastIndexOf("}") + 1);
			response = JSON.parse(response);
			console.log(response);
            let files = response.content.files;
            let html = "<h1>Wybierz jakość:</h1><br/>";
            for (let i = 0; i < files.length; i++) {
                if (files[i].type == "any_native" && files[i].url.endsWith(".mp4")) {
                    if (qualities[files[i].quality.bitrate]) {
                        html += "<a href='" + files[i].url + "'>" + qualities[files[i].quality.bitrate] + "</a><br/>";
                    } else {
                        html += "<a href='" + files[i].url + "'>Nieznany</a><br/>";
                    }
                }
            }
            const win = window.open("about:blank", "_blank");
            win.document.write(html);
            win.focus();
        }
    }

    function getUrl(url) {
        let xmlHttp1 = new XMLHttpRequest();
        xmlHttp1.open("GET", url, false);
        xmlHttp1.send();
        return xmlHttp1.responseText;
    }

})();