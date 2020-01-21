Run tests using "ng e2e --no-webdriver-update". Otherwise the v79 chromedriver will be changed to v75. Then you need to
replace the "chrome-response.mxl" & "update-config.json" file with the versions in the CoreAngularAuthCRUD1 folder.
I shouldn't have to do this but I can't figure out how to make the webdriver-anager update to the latest file.

Note: I have since fudged the config.json ("maxChromedriver": "79") file in the built folder to make "ng e2e work".
I'm not convinced this is the answer though.
