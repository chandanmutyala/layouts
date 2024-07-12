/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "layouts/model/models",
        'sap/ui/model/json/JSONModel',
        'sap/f/library',
        'sap/f/FlexibleColumnLayoutSemanticHelper',
    ],
    function (UIComponent, Device, models, JSONModel, fioriLibrary, FlexibleColumnLayoutSemanticHelper) {
        "use strict";

        return UIComponent.extend("layouts.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                var oModel,
				oProductsModel,
				oRouter;
                var oProductsModel;

			UIComponent.prototype.init.apply(this, arguments);
            oModel = new JSONModel();
			this.setModel(oModel);

			// set products demo model on this sample
			oProductsModel = new JSONModel(sap.ui.require.toUrl('sap/ui/demo/mock') + '/products.json');
            

			oProductsModel.setSizeLimit(20);
			this.setModel(oProductsModel, 'products');


                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                oRouter = this.getRouter();
			oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
			oRouter.initialize();
            },
            getHelper: function () {
                return this._getFcl().then(function(oFCL) {
                    var oSettings = {
                        defaultTwoColumnLayoutType: fioriLibrary.LayoutType.TwoColumnsMidExpanded,
                        defaultThreeColumnLayoutType: fioriLibrary.LayoutType.ThreeColumnsMidExpanded,
                        initialColumnsCount: 2
                    };
                    return (FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings));
                });
            },
    
            _onBeforeRouteMatched: function(oEvent) {
                var oModel = this.getModel(),
                    sLayout = oEvent.getParameters().arguments.layout,
                    oNextUIState;
    
                // If there is no layout parameter, set a default layout (normally OneColumn)
                if (!sLayout) {
                    this.getHelper().then(function(oHelper) {
                        oNextUIState = oHelper.getNextUIState(0);
                        oModel.setProperty("/layout", oNextUIState.layout);
                    });
                    return;
                }
    
                oModel.setProperty("/layout", sLayout);
            },

            _getFcl: function () {
                return new Promise(function(resolve, reject) {
                    var oFCL = this.getRootControl().byId('flexibleColumnLayout');
                    if (!oFCL) {
                        this.getRootControl().attachAfterInit(function(oEvent) {
                            resolve(oEvent.getSource().byId('flexibleColumnLayout'));
                        }, this);
                        return;
                    }
                    resolve(oFCL);
    
                }.bind(this));
            }
        });
    }
);