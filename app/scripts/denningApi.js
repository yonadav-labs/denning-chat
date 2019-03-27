/*
 * Denning chat application
 *
 * Denning API Wrapper
 *
 */
define([
    'jquery',
    'config',
    'Helpers',
    'cryptojs'
], function(
    $,
    DCCONFIG,
    Helpers,
    CryptoJS
) {    

    var self,
        email,
        baseUrl,
        sessionID;

    function DenningApi() {
        self = this;
    }

    DenningApi.prototype = {
        isReady: function() {
            self.init();
            return baseUrl && sessionID && email;
        },
        getEmail: function() {
            return email;
        },
        init: function() {
            try {
                var userInfo = JSON.parse(localStorage.userInfo);
                baseUrl = userInfo.catDenning[0].APIServer;
                sessionID = userInfo.sessionID;
                email = userInfo.email;
            } catch (e) {
                baseUrl = Helpers.getURLParameter('server');
                sessionID = Helpers.getURLParameter('sid');
                email = Helpers.getURLParameter('uid');
            }
        },
        call: function (method, path, data, callback) {
            self.init();

            if (path == 'v2/chat/contact' || path == 'v1/chat/contact/fav') {
                url = 'https://denningonline.com.my/denningapi/' + path;
                _sessionID = "{334E910C-CC68-4784-9047-0F23D37C9CF9}";
            } else {
                url = baseUrl + path;
                _sessionID = sessionID;
            }

            return self._call(method, url, _sessionID, data, callback);
        },
        call_crypto: function(method, path, dialog_id, data, callback) {
            url = baseUrl + path;
            _sessionID = CryptoJS.HmacSHA1("webuserid="+email+"&dialog_id="+dialog_id, "Tctz5xEDNWuJQq4").toString(); 

            return self._call(method, url, _sessionID, data, callback);
        },
        _call: function(method, url, _sessionID, data, callback) {
            return $.ajax({
                type: method,
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    "webuser-sessionid": _sessionID,
                    "webuser-id": email
                }, 
                data: data,
                success: function(res) {
                    callback(res);
                },
                error: function(res) {
                    if (res.status == 408) {
                        alert('Denning session expired!');
                    }
                }
            });
        }
    };

    return DenningApi;
});

