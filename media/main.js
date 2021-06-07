var testObj = {
    "additionParents": {
        "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/43430173/additionParents",
        "references": []
    },
    "owner": "john.heath@softwareag.com",
    "childDevices": {
        "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/43430173/childDevices",
        "references": []
    },
    "childAssets": {
        "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/43430173/childAssets",
        "references": [
            {
                "managedObject": {
                    "name": "FaultyFridge",
                    "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/43430172",
                    "id": "43430172"
                },
                "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/43430173/childAssets/43430172"
            },
            {
                "managedObject": {
                    "name": "Fridge#1",
                    "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/43431239",
                    "id": "43431239"
                },
                "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/43430173/childAssets/43431239"
            },
            {
                "managedObject": {
                    "name": "Fridge #2",
                    "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/43430170",
                    "id": "43430170"
                },
                "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/43430173/childAssets/43430170"
            },
            {
                "managedObject": {
                    "name": "JBHRandom",
                    "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/37443830",
                    "id": "37443830"
                },
                "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/43430173/childAssets/37443830"
            }
        ]
    },
    "creationTime": "2021-04-22T15:15:18.530Z",
    "type": "c8y_DeviceGroup",
    "lastUpdated": "2021-04-22T15:15:18.530Z",
    "childAdditions": {
        "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/43430173/childAdditions",
        "references": []
    },
    "name": "Laboratory",
    "assetParents": {
        "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/43430173/assetParents",
        "references": []
    },
    "deviceParents": {
        "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/43430173/deviceParents",
        "references": []
    },
    "self": "https://industrysolutions.cumulocity.com/inventory/managedObjects/43430173",
    "id": "43430173",
    "c8y_IsDeviceGroup": {}
};


var fields = [
    "name",
    "type",
    "id",
    "owner",
    "lastUpdated",
    "c8y_IsDeviceGroup",
    "childDevices",
    "childAssets",
    "childAdditions"
];


function createHeading(s) {
    return [
        '<p><b>',
        s,
        '</p></b>'
    ].join('');
}

function createFieldData(s) {
    //<p id="type"></p>
    return [
        '<p id=\"',
        s,
        '\">',
        '</p>'
    ].join('');
}

function populateFromObject(message = testObj) {
    console.log(JSON.stringify(message, null, 2));
    const h = document.getElementById('heading');
    const fd = document.getElementById('fielddata');

    h.innerHTML = "";
    fd.innerHTML = "";
    fields.forEach((f) => {
        h.innerHTML = h.innerHTML + createHeading(f);
        fd.innerHTML = fd.innerHTML + createFieldData(f);
    });



    fields.forEach((f) => {
        console.log("FIELD ", f);
        const element = document.getElementById(f);
        if (element) {
            element.textContent = (f in message) ? message[f] : "undefined";
            console.log("FIELD ", f, (f in message), (f in message) ? message[f] : "undefined");
        } else {
            console.log("MISSING", f);
        }

    });
};

window.addEventListener('message', event => {
    const message = event.data[0].managedObject; // The JSON data our extension sent
    const h = document.getElementById('heading');
    const fd = document.getElementById('fielddata');

    h.innerHTML = "";
    fd.innerHTML = "";
    fields.forEach((f) => {
        h.innerHTML = h.innerHTML + createHeading(f);
        fd.innerHTML = fd.innerHTML + createFieldData(f);
    });



    fields.forEach((f) => {
        console.log("FIELD ", f);
        const element = document.getElementById(f);
        if (element) {
            element.textContent = (f in message) ? message[f] : "undefined";
            console.log("FIELD ", f, (f in message), (f in message) ? message[f] : "undefined");
        } else {
            console.log("MISSING", f);
        }

    });
});


