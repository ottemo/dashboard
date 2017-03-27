angular.module('discountsModule')

/**
 * code
 * amount
 * name
 * recipient_mailbox
 * message
 * delivery_date
 * sku
 */
.service('giftcardsService', [
    '$resource',
    'REST_SERVER_URI',

    function(
        $resource,
        REST_SERVER_URI
    ) {
        return $resource(REST_SERVER_URI, {}, {
            "giftcardGet": {
                method: "GET",
                url: REST_SERVER_URI + "/giftcard/:giftcardID"
            },
            "giftcardList": {
                method: "GET",
                url: REST_SERVER_URI + "/giftcards"
            },
            "giftcardTotal": {
                method: "GET",
                url: REST_SERVER_URI + "/giftcards?action=count"
            },
            "giftcardAdd": {
                method: "POST",
                url: REST_SERVER_URI + "/giftcard"
            },
            "giftcardUpdate": {
                method: "PUT",
                params: { giftcardID: "@_id" },
                url: REST_SERVER_URI + "/giftcard/:giftcardID"
            },
            "giftcardCheckCode": {
                method: "GET",
                url: REST_SERVER_URI + "/check/giftcards/:giftcode"
            },
            "giftcardGenerateCode": {
                method: "GET",
                url: REST_SERVER_URI + "/generate/giftcards/code"
            },
            "giftcardHistory": {
                method: "GET",
                url: REST_SERVER_URI + "/giftcard/:giftcardID/history"
            }
        });
    }
]);

