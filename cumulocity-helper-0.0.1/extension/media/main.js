/* eslint-disable @typescript-eslint/naming-convention */
var testObj1 = {
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


var testObj2 = {
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


var simpleFields = [
    "name",
    "type",
    "id",
    "owner",
    "lastUpdated",
];

var compositeFields = [
    "c8y_IsDeviceGroup",
    "childDevices",
    "childAssets",
    "childAdditions",
    "c8y_Connection",
    "c8y_IsDevice",
    "c8y_ActiveAlarmsStatus",
    "c8y_Availability"
];


function createHeading(s) {
    return [
        '<div><b>',
        s,
        '</b></div>'
    ].join('');
}

function createFieldData(s) {
    //<p id="type"></p>
    return [
        '<div id=\"',
        s,
        '\">',
        '</div>'
    ].join('');
}

function populateFromObject(message = testObj2) {
    //console.log(JSON.stringify(message, null, 2));
    const g = document.getElementById('moGrid');
    createEmptyFieldsHTML(g);
    populateFields(message);
};

window.addEventListener('message', event => {
    const message = event.data[0].managedObject; // The JSON data our extension sent
    const g = document.getElementById('moGrid');
    createEmptyFieldsHTML(g);
    populateFields(message);
});


function populateFields(message) {
    simpleFields.forEach((f) => {
        const element = document.getElementById(f);
        if (element && message) {
            element.textContent = (f in message) ? message[f] : "undefined";
            //console.log("FIELD ", f, (f in message), (f in message) ? message[f] : "undefined");
        } else {
            //console.log("MISSING", f);
        }
    });

    compositeFields.forEach((f) => {

        const element = document.getElementById(f);
        if (f === 'c8y_Connection' || f === 'c8y_Availability') {
            element.textContent = (f in message) ? message[f].status : "undefined";
            //console.log("FIELD ", f, (f in message), (f in message) ? message[f].status : "undefined");
        } else if (f === 'c8y_IsDevice' || f === 'c8y_IsDeviceGroup') {
            element.textContent = (f in message) ? "true" : "false";
        } else if (f.includes("child")) {
            if (f in message) {
                let refs = message[f].references;
                if (refs.length > 0) {
                    refs.forEach(r => {
                        if ("name" in r.managedObject) {
                            element.textContent += `${r.managedObject.name},`;
                        } else {
                            element.textContent += `${r.managedObject.id},`;
                        }
                    });

                } else {
                    element.textContent = "empty";
                }
            } else {
                element.textContent = "undefined";
            }
        } else {
            if (f in message) {
                //we want all the fields
                let subObject = message[f];
                Object.keys(subObject).forEach(k => {
                    element.textContent += `${k} = ${subObject[k]},`;
                });

            } else {
                element.textContent = "undefined";
            }

        }
    });
}

function createEmptyFieldsHTML(g) {
    g.innerHTML = "";
    simpleFields.forEach((f) => {
        g.innerHTML = g.innerHTML + createHeading(f);
        g.innerHTML = g.innerHTML + createFieldData(f);
    });
    compositeFields.forEach((f) => {
        g.innerHTML = g.innerHTML + createHeading(f);
        g.innerHTML = g.innerHTML + createFieldData(f);
    });
}

