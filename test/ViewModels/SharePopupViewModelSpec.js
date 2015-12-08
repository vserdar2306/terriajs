'use strict';

var SharePopupViewModel = require('../../lib/ViewModels/SharePopupViewModel');
var Terria = require('../../lib/Models/Terria');
var queryToObject = require('terriajs-cesium/Source/Core/queryToObject');
var URI = require('urijs');

describe('SharePopupViewModel', function () {
    var terria;
    var sharePopup;

    beforeEach(function () {
        terria = new Terria({
            baseUrl: './'
        });
        terria.baseMap = {};
    });

    function init() {
        sharePopup = new SharePopupViewModel({
            terria: terria
        });
    }

    describe('share url', function () {
        testActiveIndexInUrl(function () {
            return sharePopup.url;
        });
    });

    describe('embed url', function () {
        testActiveIndexInUrl(function () {
            // Get the src of the embed code
            return /src="(.*)"/.exec(sharePopup.embedCode)[1];
        });
    });

    /**
     * Runs tests to ensure that activeTabIndex for values 1 and 2 is embedded into the url
     * generated by the SharePopupViewModal
     *
     * @param urlGetter a function that returns the url to test, after the sharePopup has been
     *      initialised.
     */
    // Enable creating functions in loop - it makes this function a bunch clearer and creating
    // two functions in a unit test isn't a big performance issue.
    /*jshint -W083 */
    function testActiveIndexInUrl(urlGetter) {
        // Check for multiple values of active tab
        for (var fakeActiveTabIndex = 0; fakeActiveTabIndex < 2; fakeActiveTabIndex++) {

            it('includes activeTabIndex for activeTabIndex=' + fakeActiveTabIndex, function () {
                terria.activeTabIndex = fakeActiveTabIndex;
                init();

                var url = urlGetter();
                var parsed = parseUrl(url);
                expect(parsed.initSources[1].activeTabIndex).toBe(fakeActiveTabIndex);
            });
        }
    }

    /**
     * Parses the data that the share popup encodes in the URL.
     */
    function parseUrl(url) {
        var uri = new URI(url);
        var hash = uri.fragment();
        var query = queryToObject(hash);

        return JSON.parse(query.start);
    }
});
