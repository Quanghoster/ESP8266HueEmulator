exports.handler = function (request, context) {

    log("INFO:", "", "Function called");

    if (request.directive.header.namespace === 'Alexa.Discovery' && request.directive.header.name === 'Discover') {
        log("DEBUG:", "Discover request", JSON.stringify(request));
        handleDiscovery(request, context, "");
    }
    else if (request.directive.header.namespace === 'Alexa.PowerController') {
        if (request.directive.header.name === 'TurnOn' || request.directive.header.name === 'TurnOff') {
            log("DEBUG:", "TurnOn or TurnOff Request", JSON.stringify(request));
            handlePowerControl(request, context);
        }
    }
    else if (request.directive.header.namespace === 'Alexa.ColorController') {
        if (request.directive.header.name === 'SetColor') {
            log("DEBUG:", "SetColor Request", JSON.stringify(request));
            handleSetColor(request, context);
        }
    }
    else if (request.directive.header.namespace === 'Alexa.SceneController') {
        if (request.directive.header.name === 'Activate' || request.directive.header.name === 'Deactivate') {
            log("DEBUG:", "(De)Activate Request", JSON.stringify(request));
            handleActivate(request, context);
        }
    }
    
    function handleActivate(request, context) {
        var dt = new Date();
        var response = {
            "context":context,
            "event":{
                "header": request.directive.header,
                "endpoint": request.directive.endpoint,
                "endpointd": request.directive.endpointId,
                "payload": {
                    "cause" : {
                        "type" : "VOICE_INTERACTION"
                    },
                    "timestamp" : dt.toISOString()
                }
            },
        };
        if (request.directive.header.name === 'Activate')
            response.event.header.name = "ActivationStarted";
        else
            response.event.header.name = "DeactivationStarted";
        log("DEBUG:", "(De)Activate Response", JSON.stringify(response));
        context.succeed(response);
    }
    
    function handleSetColor(request, context) {

        var response = getResponse(request);
        response.context.properties[0].namespace = "Alexa.ColorController";
        response.context.properties[0].name = "color";
        var val = {
            hue: request.directive.payload.color.hue,
            saturation: request.directive.payload.color.saturation,
            brightness: request.directive.payload.color.brightness
        };

        response.context.properties[0].value = val;

        log("DEBUG", "Alexa.ColorController ", JSON.stringify(response));
        context.succeed(response);
    }

    function handleDiscovery(request, context) {
        var payload = {

            "endpoints":
            // pull these back from IoT
            [
                {
                    "endpointId": "appliance-001",
                    "friendlyName": "Conservatory Strip",
                    "description": "Smart Light by Sample Manufacturer",
                    "manufacturerName": "Sample Manufacturer",
                    "displayCategories": [
                        "LIGHT"
                    ],
                    "cookie": {
                        "extraDetail1": "optionalDetailForSkillAdapterToReferenceThisDevice",
                        "extraDetail2": "There can be multiple entries",
                        "extraDetail3": "but they should only be used for reference purposes",
                        "extraDetail4": "This is not a suitable place to maintain current device state"
                    },
                    "capabilities": [
                        {
                            "type": "AlexaInterface",
                            "interface": "Alexa.ColorTemperatureController",
                            "version": "3",
                            "properties": {
                                "supported": [
                                    {
                                        "name": "colorTemperatureInKelvin"
                                    }
                                ],
                                "proactivelyReported": true,
                                "retrievable": true
                            }
                        },
                        {
                            "type": "AlexaInterface",
                            "interface": "Alexa.EndpointHealth",
                            "version": "3",
                            "properties": {
                                "supported": [
                                    {
                                        "name": "connectivity"
                                    }
                                ],
                                "proactivelyReported": true,
                                "retrievable": true
                            }
                        },
                        {
                            "type": "AlexaInterface",
                            "interface": "Alexa",
                            "version": "3"
                        },
                        {
                            "type": "AlexaInterface",
                            "interface": "Alexa.ColorController",
                            "version": "3",
                            "properties": {
                                "supported": [
                                    {
                                        "name": "color"
                                    }
                                ],
                                "proactivelyReported": true,
                                "retrievable": true
                            }
                        },
                        {
                            "type": "AlexaInterface",
                            "interface": "Alexa.PowerController",
                            "version": "3",
                            "properties": {
                                "supported": [
                                    {
                                        "name": "powerState"
                                    }
                                ],
                                "proactivelyReported": true,
                                "retrievable": true
                            }
                        },
                        {
                            "type": "AlexaInterface",
                            "interface": "Alexa.BrightnessController",
                            "version": "3",
                            "properties": {
                                "supported": [
                                    {
                                        "name": "brightness"
                                    }
                                ],
                                "proactivelyReported": true,
                                "retrievable": true
                            }
						}
					]
                },
				{
					"endpointId": "scene-001",
					"friendlyName": "Savanna sunset in Andys Bedroom",
					"description": "scene a description that is shown to the customer",
					"manufacturerName": "the manufacturer name of the endpoint",
					"displayCategories": ["ACTIVITY_TRIGGER"],
					"cookie": {
                        "extraDetail1": "optionalDetailForSkillAdapterToReferenceThisDevice",
                        "extraDetail2": "There can be multiple entries",
                        "extraDetail3": "but they should only be used for reference purposes",
                        "extraDetail4": "This is not a suitable place to maintain current device state"
					},
					"capabilities":
					[
						{
							"type": "AlexaInterface",
							"interface": "Alexa.SceneController",
							"version": "3",
							"supportsDeactivation": true,
							"proactivelyReported": true
						}
					]
				}
            ]
        };
        var header = request.directive.header;
        header.name = "Discover.Response";
        log("DEBUG", "**** Discovery Response ****: ", JSON.stringify({ header: header, payload: payload }));
        context.succeed({ event: { header: header, payload: payload } });
    }

    function log(message, message1, message2) {
        console.log(message + message1 + message2);
    }

    function handlePowerControl(request, context) {
        // get device ID passed in during discovery
        var requestMethod = request.directive.header.name;
        // get user token pass in request
        var requestToken = request.directive.endpoint.scope.token;
        var powerResult;

        if (requestMethod === "TurnOn") {

            // Make the call to your device cloud for control 
            // powerResult = stubControlFunctionToYourCloud(endpointId, token, request);
            powerResult = "ON";
        }
        else if (requestMethod === "TurnOff") {
            // Make the call to your device cloud for control and check for success 
            // powerResult = stubControlFunctionToYourCloud(endpointId, token, request);
            powerResult = "OFF";
        }
        var r = getResponse(request);
        r.context.properties[0].namespace = "Alexa.PowerController";
        r.context.properties[0].name = "powerState";
        r.context.properties[0].value = powerResult;
        log("DEBUG", "Alexa.PowerController ", JSON.stringify(r));
        context.succeed(r);
    }
};
function getResponse(request) {
    var dt = new Date();

    var contextResult = {
        "properties": [{
            "namespace": "",
            "name": "",
            "value": "",
            "timeOfSample": dt.toISOString(),//"2017-09-03T16:20:50.52Z", //retrieve from result.
            "uncertaintyInMilliseconds": 500
        }]
    };
    var responseHeader = request.directive.header;
    responseHeader.namespace = "Alexa";
    responseHeader.name = "Response";
    responseHeader.messageId = responseHeader.messageId + "-R";
    var response = {
        context: contextResult,
        event: {
            header: responseHeader
        },
        endpoint: {
            scope: {
                type: "BearerToken",
                token: request.directive.endpoint.scope.token
            },
            endpointId: request.directive.endpoint.endpointId
        },
        payload: {}

    };
    return response;
}