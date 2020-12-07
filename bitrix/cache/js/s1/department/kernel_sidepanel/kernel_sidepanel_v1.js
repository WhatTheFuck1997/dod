; /* /bitrix/js/main/sidepanel/manager.js?160727847230937*/
; /* /bitrix/js/main/sidepanel/slider.js?160727847243258*/

; /* Start:"a:4:{s:4:"full";s:52:"/bitrix/js/main/sidepanel/manager.js?160727847230937";s:6:"source";s:36:"/bitrix/js/main/sidepanel/manager.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function() {

"use strict";

/**
 * @typedef {object} BX.SidePanel.Options
 * @property {function} [contentCallback]
 * @property {number} [width]
 * @property {string} [title]
 * @property {boolean} [cacheable=true]
 * @property {boolean} [autoFocus=true]
 * @property {boolean} [printable=true]
 * @property {boolean} [allowChangeHistory=true]
 * @property {boolean} [allowChangeTitle]
 * @property {string} [requestMethod]
 * @property {object} [requestParams]
 * @property {string} [loader]
 * @property {string} [contentClassName]
 * @property {object} [data]
 * @property {string} [typeLoader] - option for compatibility
 * @property {number} [animationDuration]
 * @property {number} [customLeftBoundary]
 * @property {number} [customRightBoundary]
 * @property {number} [customTopBoundary]
 * @property {object} [label]
 * @property {?object.<string, function>} [events]
 */

/**
 * @typedef {object} BX.SidePanel.Link
 * @property {string} url - URL
 * @property {string} target - Target Attribute
 * @property {Element} anchor - Dom Node
 * @property {array} [matches] - RegExp Matches
 */

/**
 * @typedef {object} BX.SidePanel.Rule
 * @property {string[]|RegExp[]} condition
 * @property {string[]} [stopParameters]
 * @property {function} [handler]
 * @property {function} [validate]
 * @property {boolean} [allowCrossDomain=false]
 * @property {boolean} [mobileFriendly=false]
 * @property {BX.SidePanel.Options} [options]
 */

/**
 * @namespace BX.SidePanel
 */
BX.namespace("BX.SidePanel");

var instance = null;

/**
 * @memberOf BX.SidePanel
 * @name BX.SidePanel#Instance
 * @type BX.SidePanel.Manager
 * @static
 * @readonly
 */
Object.defineProperty(BX.SidePanel, "Instance", {
	enumerable: false,
	get: function() {

		var topWindow = BX.PageObject.getRootWindow();
		if (topWindow !== window)
		{
			return topWindow.BX.SidePanel.Instance;
		}

		if (instance === null)
		{
			instance = new BX.SidePanel.Manager({});
		}

		return instance;
	}
});

/**
 * @class BX.SidePanel.Manager
 * @param {object} options
 * @constructor
 */
BX.SidePanel.Manager = function(options)
{
	this.anchorRules = [];
	this.anchorBinding = true;

	this.openSliders = [];
	this.lastOpenSlider = null;

	this.opened = false;
	this.hidden = false;
	this.hacksApplied = false;

	this.pageUrl = this.getCurrentUrl();
	this.pageTitle = this.getCurrentTitle();
	this.titleChanged = false;

	this.handleAnchorClick = this.handleAnchorClick.bind(this);
	this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
	this.handleWindowResize = BX.throttle(this.handleWindowResize, 300, this);
	this.handleWindowScroll = this.handleWindowScroll.bind(this);
	this.handleTouchMove = this.handleTouchMove.bind(this);

	this.handleSliderOpenStart = this.handleSliderOpenStart.bind(this);
	this.handleSliderOpenComplete = this.handleSliderOpenComplete.bind(this);
	this.handleSliderCloseStart = this.handleSliderCloseStart.bind(this);
	this.handleSliderCloseComplete = this.handleSliderCloseComplete.bind(this);
	this.handleSliderLoad = this.handleSliderLoad.bind(this);
	this.handleSliderDestroy = this.handleSliderDestroy.bind(this);
	this.handleEscapePress = this.handleEscapePress.bind(this);

	BX.addCustomEvent("SidePanel:open", this.open.bind(this));
	BX.addCustomEvent("SidePanel:close", this.close.bind(this));
	BX.addCustomEvent("SidePanel:closeAll", this.closeAll.bind(this));
	BX.addCustomEvent("SidePanel:destroy", this.destroy.bind(this));
	BX.addCustomEvent("SidePanel:hide", this.hide.bind(this));
	BX.addCustomEvent("SidePanel:unhide", this.unhide.bind(this));

	BX.addCustomEvent("SidePanel:postMessage", this.postMessage.bind(this));
	BX.addCustomEvent("SidePanel:postMessageAll", this.postMessageAll.bind(this));
	BX.addCustomEvent("SidePanel:postMessageTop", this.postMessageTop.bind(this));

	BX.addCustomEvent("BX.Bitrix24.PageSlider:close", this.close.bind(this)); //Compatibility
	BX.addCustomEvent("Bitrix24.Slider:postMessage", this.handlePostMessageCompatible.bind(this)); // Compatibility
};

var sliderClassName = null;

/**
 * @static
 * @param {string} className
 */
BX.SidePanel.Manager.registerSliderClass = function(className)
{
	if (BX.type.isNotEmptyString(className))
	{
		sliderClassName = className;
	}
};

/**
 * @static
 * @returns {BX.SidePanel.Slider}
 */
BX.SidePanel.Manager.getSliderClass = function()
{
	var sliderClass = sliderClassName !== null ? BX.getClass(sliderClassName) : null;
	return sliderClass !== null ? sliderClass : BX.SidePanel.Slider;
};

BX.SidePanel.Manager.prototype =
{
	/**
	 * @public
	 * @param {string} url
	 * @param {BX.SidePanel.Options} [options]
	 */
	open: function(url, options)
	{
		if (!BX.type.isNotEmptyString(url))
		{
			return false;
		}

		url = this.refineUrl(url);

		if (this.isHidden())
		{
			this.unhide();
		}

		var topSlider = this.getTopSlider();
		if (topSlider)
		{
			if (topSlider.isOpen() && topSlider.getUrl() === url)
			{
				return false;
			}
		}

		var slider = null;
		if (this.getLastOpenSlider() && this.getLastOpenSlider().getUrl() === url)
		{
			slider = this.getLastOpenSlider();
		}
		else
		{
			if (typeof(options) === "undefined")
			{
				var rule = this.getUrlRule(url);
				options = rule && rule.options ? rule.options : options;
			}

			var sliderClass = BX.SidePanel.Manager.getSliderClass();
			slider = new sliderClass(url, options);

			var zIndex = topSlider ? topSlider.getZindex() + 1 : slider.getZindex();
			var offset = null;
			if (slider.getWidth() === null && slider.getCustomLeftBoundary() === null)
			{
				offset = 0;
				var lastOffset = this.getLastOffset();
				if (topSlider && lastOffset !== null)
				{
					offset = Math.min(lastOffset + this.getMinOffset(), this.getMaxOffset());
				}
			}

			slider.setZindex(zIndex);
			slider.setOffset(offset);

			BX.addCustomEvent(slider, "SidePanel.Slider:onOpenStart", this.handleSliderOpenStart);
			BX.addCustomEvent(slider, "SidePanel.Slider:onBeforeOpenComplete", this.handleSliderOpenComplete);
			BX.addCustomEvent(slider, "SidePanel.Slider:onCloseStart", this.handleSliderCloseStart);
			BX.addCustomEvent(slider, "SidePanel.Slider:onBeforeCloseComplete", this.handleSliderCloseComplete);
			BX.addCustomEvent(slider, "SidePanel.Slider:onLoad", this.handleSliderLoad);
			BX.addCustomEvent(slider, "SidePanel.Slider:onDestroy", this.handleSliderDestroy);
			BX.addCustomEvent(slider, "SidePanel.Slider:onEscapePress", this.handleEscapePress);
		}

		if (!this.isOpen())
		{
			this.applyHacks(slider);
		}

		var success = slider.open();
		if (!success)
		{
			this.resetHacks(slider);
		}

		return success;
	},

	/**
	 * @public
	 * @returns {boolean}
	 */
	isOpen: function()
	{
		return this.opened;
	},

	/**
	 * @public
	 * @param {boolean} [immediately]
	 * @param {function} [callback]
	 */
	close: function(immediately, callback)
	{
		var topSlider = this.getTopSlider();
		if (topSlider)
		{
			topSlider.close(immediately, callback);
		}
	},

	/**
	 * @public
	 * @param {boolean} [immediately]
	 */
	closeAll: function(immediately)
	{
		var openSliders = this.getOpenSliders();
		for (var i = openSliders.length - 1; i >= 0; i--)
		{
			var slider = openSliders[i];
			var success = slider.close(immediately);
			if (!success)
			{
				break;
			}
		}
	},

	/**
	 * @public
	 * @returns {boolean}
	 */
	hide: function()
	{
		if (this.hidden)
		{
			return false;
		}

		var topSlider = this.getTopSlider();

		this.getOpenSliders().forEach(function(slider) {
			slider.hide();
		});

		this.hidden = true;

		this.resetHacks(topSlider);

		return true;
	},

	/**
	 * @public
	 * @returns {boolean}
	 */
	unhide: function()
	{
		if (!this.hidden)
		{
			return false;
		}

		this.getOpenSliders().forEach(function(slider) {
			slider.unhide();
		});

		this.hidden = false;

		setTimeout(function() {
			this.applyHacks(this.getTopSlider());
		}.bind(this), 0);

		return true;
	},

	/**
	 * @public
	 * @returns {boolean}
	 */
	isHidden: function()
	{
		return this.hidden;
	},

	/**
	 * @public
	 * @param {string} url
	 */
	destroy: function(url)
	{
		if (!BX.type.isNotEmptyString(url))
		{
			return;
		}

		url = this.refineUrl(url);
		var sliderToDestroy = this.getSlider(url);

		if (this.getLastOpenSlider() && (sliderToDestroy || this.getLastOpenSlider().getUrl() === url))
		{
			this.getLastOpenSlider().destroy();
		}

		if (sliderToDestroy !== null)
		{
			var openSliders = this.getOpenSliders();
			for (var i = openSliders.length - 1; i >= 0; i--)
			{
				var slider = openSliders[i];
				slider.destroy();

				if (slider === sliderToDestroy)
				{
					break;
				}
			}
		}
	},

	/**
	 * @public
	 */
	reload: function()
	{
		var topSlider = this.getTopSlider();
		if (topSlider)
		{
			topSlider.reload();
		}
	},

	/**
	 * @public
	 * @returns {BX.SidePanel.Slider|null}
	 */
	getTopSlider: function()
	{
		var count = this.openSliders.length;
		return this.openSliders[count - 1] ? this.openSliders[count - 1] : null;
	},

	getPreviousSlider: function(currentSlider)
	{
		var previousSlider = null;
		var openSliders = this.getOpenSliders();
		currentSlider = currentSlider || this.getTopSlider();

		for (var i = openSliders.length - 1; i >= 0; i--)
		{
			var slider = openSliders[i];
			if (slider === currentSlider)
			{
				previousSlider = openSliders[i - 1] ? openSliders[i - 1] : null;
				break;
			}
		}

		return previousSlider;
	},

	/**
	 * @public
	 * @param {string} url
	 * @returns {BX.SidePanel.Slider}
	 */
	getSlider: function(url)
	{
		url = this.refineUrl(url);

		var openSliders = this.getOpenSliders();
		for (var i = 0; i < openSliders.length; i++)
		{
			var slider = openSliders[i];
			if (slider.getUrl() === url)
			{
				return slider;
			}
		}

		return null;
	},

	/**
	 * @public
	 * @param {Window} window
	 * @return {BX.SidePanel.Slider|null}
	 */
	getSliderByWindow: function(window)
	{
		var openSliders = this.getOpenSliders();
		for (var i = 0; i < openSliders.length; i++)
		{
			var slider = openSliders[i];
			if (slider.getFrameWindow() === window)
			{
				return slider;
			}
		}

		return null;
	},

	/**
	 * @public
	 * @returns {BX.SidePanel.Slider[]}
	 */
	getOpenSliders: function()
	{
		return this.openSliders;
	},

	/**
	 * @public
	 * @returns {Number}
	 */
	getOpenSlidersCount: function()
	{
		return this.openSliders.length;
	},

	/**
	 * @private
	 * @param {BX.SidePanel.Slider} slider
	 */
	addOpenSlider: function(slider)
	{
		if (!(slider instanceof BX.SidePanel.Slider))
		{
			throw new Error("Slider is not an instance of BX.SidePanel.Slider");
		}

		this.openSliders.push(slider);
	},

	/**
	 * @private
	 * @returns {boolean}
	 */
	removeOpenSlider: function(slider)
	{
		var openSliders = this.getOpenSliders();
		for (var i = 0; i < openSliders.length; i++)
		{
			var openSlider = openSliders[i];
			if (openSlider === slider)
			{
				this.openSliders.splice(i, 1);
				return true;
			}
		}

		return false;
	},

	/**
	 * @public
	 * @returns {null|BX.SidePanel.Slider}
	 */
	getLastOpenSlider: function()
	{
		return this.lastOpenSlider;
	},

	/**
	 * @private
	 * @param {BX.SidePanel.Slider} slider
	 */
	setLastOpenSlider: function(slider)
	{
		if (this.lastOpenSlider !== slider)
		{
			if (this.lastOpenSlider)
			{
				this.lastOpenSlider.destroy();
			}

			this.lastOpenSlider = slider;
		}
	},

	/**
	 * @private
	 */
	resetLastOpenSlider: function()
	{
		if (this.lastOpenSlider && this.getTopSlider() !== this.lastOpenSlider)
		{
			this.lastOpenSlider.destroy();
		}

		this.lastOpenSlider = null;
	},

	/**
	 * @public
	 */
	adjustLayout: function()
	{
		this.getOpenSliders().forEach(function(/*BX.SidePanel.Slider*/slider) {
			slider.adjustLayout();
		});
	},

	/**
	 * @private
	 * @return {?number}
	 */
	getLastOffset: function()
	{
		var openSliders = this.getOpenSliders();
		for (var i = openSliders.length - 1; i >= 0; i--)
		{
			var slider = openSliders[i];
			if (slider.getOffset() !== null)
			{
				return slider.getOffset();
			}
		}

		return null;
	},

	/**
	 * @public
	 * @param {string} url
	 * @returns {string}
	 */
	refineUrl: function(url)
	{
		if (BX.type.isNotEmptyString(url) && url.match(/IFRAME/))
		{
			return BX.util.remove_url_param(url, ["IFRAME", "IFRAME_TYPE"]);
		}

		return url;
	},

	/**
	 * @public
	 * @returns {string}
	 */
	getPageUrl: function()
	{
		return this.pageUrl;
	},

	/**
	 * @public
	 * @returns {string}
	 */
	getCurrentUrl: function()
	{
		return window.location.pathname + window.location.search + window.location.hash;
	},

	/**
	 * @public
	 * @returns {string}
	 */
	getPageTitle: function()
	{
		return this.pageTitle;
	},

	/**
	 * @public
	 * @returns {string}
	 */
	getCurrentTitle: function()
	{
		var title = document.title;
		if (BX.IM)
		{
			title = title.replace(/^\([0-9]+\) /, ""); //replace a messenger counter.
		}

		return title;
	},

	/**
	 * @public
	 * @param {string|Window|BX.SidePanel.Slider} source
	 * @param {string} eventId
	 * @param {object} data
	 */
	postMessage: function(source, eventId, data)
	{
		var sender = this.getSliderFromSource(source);
		if (!sender)
		{
			return;
		}

		var previousSlider = null;
		var openSliders = this.getOpenSliders();
		for (var i = openSliders.length - 1; i >= 0; i--)
		{
			var slider = openSliders[i];
			if (slider === sender)
			{
				previousSlider = openSliders[i - 1] ? openSliders[i - 1] : null;
				break;
			}
		}

		var sliderWindow = previousSlider && previousSlider.getWindow() || window;
		sliderWindow.BX.onCustomEvent("Bitrix24.Slider:onMessage", [slider, data]); //Compatibility

		var event = new BX.SidePanel.MessageEvent({
			sender: sender,
			slider: previousSlider ? previousSlider : null,
			data: data,
			eventId: eventId
		});

		if (previousSlider)
		{
			previousSlider.firePageEvent(event);
			previousSlider.fireFrameEvent(event);
		}
		else
		{
			BX.onCustomEvent(window, event.getFullName(), [event]);
		}
	},

	/**
	 * @public
	 * @param {string|Window|BX.SidePanel.Slider} source
	 * @param {string} eventId
	 * @param {object} data
	 */
	postMessageAll: function(source, eventId, data)
	{
		var sender = this.getSliderFromSource(source);
		if (!sender)
		{
			return;
		}

		var event = null;
		var openSliders = this.getOpenSliders();
		for (var i = openSliders.length - 1; i >= 0; i--)
		{
			var slider = openSliders[i];
			if (slider === sender)
			{
				continue;
			}

			event = new BX.SidePanel.MessageEvent({
				sender: sender,
				slider: slider,
				data: data,
				eventId: eventId
			});

			slider.firePageEvent(event);
			slider.fireFrameEvent(event);
		}

		event = new BX.SidePanel.MessageEvent({
			sender: sender,
			slider: null,
			data: data,
			eventId: eventId
		});

		BX.onCustomEvent(window, event.getFullName(), [event]);
	},

	/**
	 * @public
	 * @param {string|Window|BX.SidePanel.Slider} source
	 * @param {string} eventId
	 * @param {object} data
	 */
	postMessageTop: function(source, eventId, data)
	{
		var sender = this.getSliderFromSource(source);
		if (!sender)
		{
			return;
		}

		var event = new BX.SidePanel.MessageEvent({
			sender: sender,
			slider: null,
			data: data,
			eventId: eventId
		});

		BX.onCustomEvent(window, event.getFullName(), [event]);
	},

	/**
	 * @private
	 * @returns {number}
	 */
	getMinOffset: function()
	{
		return 63;
	},

	/**
	 * @private
	 * @returns {number}
	 */
	getMaxOffset: function()
	{
		return this.getMinOffset() * 3;
	},

	/**
	 * @public
	 * @param {{rules: BX.SidePanel.Rule[]}} parameters
	 */
	bindAnchors: function(parameters)
	{
		parameters = parameters || {};

		if (BX.type.isArray(parameters.rules) && parameters.rules.length)
		{
			if (this.anchorRules.length === 0)
			{
				window.document.addEventListener("click", this.handleAnchorClick, true);
			}

			if (!(parameters.rules instanceof Object))
			{
				console.error(
					"BX.SitePanel: anchor rules were created in a different context. " +
					"This might be a reason for a memory leak."
				);

				console.trace();
			}

			parameters.rules.forEach((function(rule) {
				if (BX.type.isArray(rule.condition))
				{
					for (var m = 0; m < rule.condition.length; m++)
					{
						if (BX.type.isString(rule.condition[m]))
						{
							rule.condition[m] = new RegExp(rule.condition[m], "i");
						}
					}
				}

				rule.options = BX.type.isPlainObject(rule.options) ? rule.options : {};
				if (BX.type.isNotEmptyString(rule.loader) && !BX.type.isNotEmptyString(rule.options.loader))
				{
					rule.options.loader = rule.loader;
					delete rule.loader;
				}

				this.anchorRules.push(rule);
			}).bind(this));
		}
	},

	/**
	 * @public
	 */
	isAnchorBinding: function()
	{
		return this.anchorBinding;
	},

	/**
	 * @public
	 */
	enableAnchorBinding: function()
	{
		this.anchorBinding = true;
	},

	/**
	 * @public
	 */
	disableAnchorBinding: function()
	{
		this.anchorBinding = false;
	},

	/**
	 * @private
	 * @param {BX.SidePanel.Event} event
	 */
	handleSliderOpenStart: function(event)
	{
		if (!event.isActionAllowed())
		{
			return;
		}

		var slider = event.getSlider();
		if (slider.isDestroyed())
		{
			return;
		}

		if (this.getTopSlider())
		{
			this.getTopSlider().hideOverlay();

			var sameWidth = (
				this.getTopSlider().getOffset() === slider.getOffset() &&
				this.getTopSlider().getWidth() === slider.getWidth() &&
				this.getTopSlider().getCustomLeftBoundary() === slider.getCustomLeftBoundary()
			);

			if (!sameWidth)
			{
				this.getTopSlider().showShadow();
			}

			this.getTopSlider().hideOrDarkenCloseBtn();
			this.getTopSlider().hidePrintBtn();
		}
		else
		{
			slider.setOverlayAnimation(true);
		}

		this.addOpenSlider(slider);

		this.getOpenSliders().forEach(function(slider, index, openSliders) {
			slider.getLabel().moveAt(openSliders.length - index - 1); //move down
		}, this);

		this.losePageFocus();

		if (!this.opened)
		{
			this.pageUrl = this.getCurrentUrl();
			this.pageTitle = this.getCurrentTitle();
		}

		this.opened = true;

		this.resetLastOpenSlider();
	},

	/**
	 * @private
	 * @param {BX.SidePanel.Event} event
	 */
	handleSliderOpenComplete: function(event)
	{
		this.setBrowserHistory(event.getSlider());
		this.updateBrowserTitle();
	},

	/**
	 * @private
	 * @param {BX.SidePanel.Event} event
	 */
	handleSliderCloseStart: function(event)
	{
		if (!event.isActionAllowed())
		{
			return;
		}

		if (event.getSlider() && event.getSlider().isDestroyed())
		{
			return;
		}

		var previousSlider = this.getPreviousSlider();
		var topSlider = this.getTopSlider();

		this.getOpenSliders().forEach(function(slider, index, openSliders) {
			slider.getLabel().moveAt(openSliders.length - index - 2); //move up
		}, this);

		if (previousSlider)
		{
			previousSlider.unhideOverlay();
			previousSlider.hideShadow();
			previousSlider.showOrLightenCloseBtn();

			if (topSlider)
			{
				topSlider.hideOverlay();
				topSlider.hideShadow();
			}
		}
	},

	/**
	 * @private
	 * @param {BX.SidePanel.Event} event
	 */
	handleSliderCloseComplete: function(event)
	{
		var slider = event.getSlider();
		if (slider === this.getTopSlider())
		{
			this.setLastOpenSlider(slider);
		}

		this.cleanUpClosedSlider(slider);
	},

	/**
	 * @private
	 * @param {BX.SidePanel.Event} event
	 */
	handleSliderDestroy: function(event)
	{
		var slider = event.getSlider();

		BX.removeCustomEvent(slider, "SidePanel.Slider:onOpenStart", this.handleSliderOpenStart);
		BX.removeCustomEvent(slider, "SidePanel.Slider:onBeforeOpenComplete", this.handleSliderOpenComplete);
		BX.removeCustomEvent(slider, "SidePanel.Slider:onCloseStart", this.handleSliderCloseStart);
		BX.removeCustomEvent(slider, "SidePanel.Slider:onBeforeCloseComplete", this.handleSliderCloseComplete);
		BX.removeCustomEvent(slider, "SidePanel.Slider:onLoad", this.handleSliderLoad);
		BX.removeCustomEvent(slider, "SidePanel.Slider:onDestroy", this.handleSliderDestroy);
		BX.removeCustomEvent(slider, "SidePanel.Slider:onEscapePress", this.handleEscapePress);

		var frameWindow = event.getSlider().getFrameWindow();
		if (frameWindow)
		{
			frameWindow.document.removeEventListener("click", this.handleAnchorClick, true);
		}

		if (slider === this.getLastOpenSlider())
		{
			this.lastOpenSlider = null;
		}

		this.cleanUpClosedSlider(slider);
	},

	handleEscapePress: function(event)
	{
		if (this.isOnTop() && this.getTopSlider())
		{
			if (this.getTopSlider().canCloseByEsc())
			{
				this.getTopSlider().close();
			}
		}
	},

	/**
	 * @private
	 * @param {BX.SidePanel.Slider} slider
	 */
	cleanUpClosedSlider: function(slider)
	{
		this.removeOpenSlider(slider);

		slider.unhideOverlay();
		slider.hideShadow();

		this.getOpenSliders().forEach(function(slider, index, openSliders) {
			slider.getLabel().moveAt(openSliders.length - index - 1); //update position
		}, this);

		if (this.getTopSlider())
		{
			this.getTopSlider().showOrLightenCloseBtn();
			this.getTopSlider().unhideOverlay();
			this.getTopSlider().hideShadow();

			if (this.getTopSlider().isPrintable())
			{
				this.getTopSlider().showPrintBtn();
			}
			this.getTopSlider().focus();
		}
		else
		{
			window.focus();
		}

		if (!this.getOpenSlidersCount())
		{
			this.resetHacks(slider);
			this.opened = false;
		}

		this.resetBrowserHistory();
		this.updateBrowserTitle();
	},

	/**
	 * @private
	 * @param {BX.SidePanel.Event} event
	 */
	handleSliderLoad: function(event)
	{
		var frameWindow = event.getSlider().getFrameWindow();
		if (frameWindow)
		{
			frameWindow.document.addEventListener("click", this.handleAnchorClick, true);
		}

		this.setBrowserHistory(event.getSlider());
		this.updateBrowserTitle();
	},

	/**
	 * @private
	 * @param {string|Window|BX.SidePanel.Slider} source
	 * @param {object} data
	 */
	handlePostMessageCompatible: function(source, data)
	{
		this.postMessage(source, "", data);
	},

	/**
	 * @private
	 * @param {string|Window|BX.SidePanel.Slider} source
	 */
	getSliderFromSource: function(source)
	{
		if (source instanceof BX.SidePanel.Slider)
		{
			return source;
		}
		else if (BX.type.isNotEmptyString(source))
		{
			return this.getSlider(source);
		}
		else if (source !== null && source === source.window && window !== source)
		{
			return this.getSliderByWindow(source);
		}

		return null;
	},

	/**
	 * @private
	 * @param {BX.SidePanel.Slider} [slider]
	 * @returns {boolean}
	 */
	applyHacks: function(slider)
	{
		if (this.hacksApplied)
		{
			return false;
		}

		slider && slider.applyHacks();

		this.disablePageScrollbar();
		this.bindEvents();

		slider && slider.applyPostHacks();

		this.hacksApplied = true;

		return true;
	},

	/**
	 * @private
	 * @param {BX.SidePanel.Slider} [slider]
	 * @returns {boolean}
	 */
	resetHacks: function(slider)
	{
		if (!this.hacksApplied)
		{
			return false;
		}

		slider && slider.resetPostHacks();

		this.enablePageScrollbar();
		this.unbindEvents();

		slider && slider.resetHacks();

		this.hacksApplied = false;

		return true;
	},

	/**
	 * @private
	 */
	bindEvents: function()
	{
		BX.bind(document, "keydown", this.handleDocumentKeyDown);
		BX.bind(window, "resize", this.handleWindowResize);
		BX.bind(window, "scroll", this.handleWindowScroll); //Live Comments can change scrollTop

		if (BX.browser.IsMobile())
		{
			BX.bind(document.body, "touchmove", this.handleTouchMove);
		}
	},

	/**
	 * @private
	 */
	unbindEvents: function()
	{
		BX.unbind(document, "keydown", this.handleDocumentKeyDown);
		BX.unbind(window, "resize", this.handleWindowResize);
		BX.unbind(window, "scroll", this.handleWindowScroll);

		if (BX.browser.IsMobile())
		{
			BX.unbind(document.body, "touchmove", this.handleTouchMove);
		}
	},

	/**
	 * @private
	 */
	disablePageScrollbar: function()
	{
		var scrollWidth = window.innerWidth - document.documentElement.clientWidth;
		document.body.style.paddingRight = scrollWidth + "px";
		BX.addClass(document.body, "side-panel-disable-scrollbar");
		this.pageScrollTop = window.pageYOffset || document.documentElement.scrollTop;
	},

	/**
	 * @private
	 */
	enablePageScrollbar: function()
	{
		document.body.style.removeProperty("padding-right");
		BX.removeClass(document.body, "side-panel-disable-scrollbar");
	},

	/**
	 * @private
	 */
	losePageFocus: function()
	{
		if (BX.type.isDomNode(document.activeElement))
		{
			document.activeElement.blur();
		}
	},

	/**
	 * @private
	 * @param {Event} event
	 */
	handleDocumentKeyDown: function(event)
	{
		if (event.keyCode !== 27)
		{
			return;
		}

		event.preventDefault(); //otherwise an iframe loading can be cancelled by a browser

		if (this.isOnTop() && this.getTopSlider())
		{
			if (this.getTopSlider().canCloseByEsc())
			{
				this.getTopSlider().close();
			}
		}
	},

	/**
	 * @private
	 */
	handleWindowResize: function()
	{
		this.adjustLayout();
	},

	/**
	 * @private
	 */
	handleWindowScroll: function()
	{
		window.scrollTo(0, this.pageScrollTop);
		this.adjustLayout();
	},

	/**
	 * @private
	 * @param {Event} event
	 */
	handleTouchMove: function(event)
	{
		event.preventDefault();
	},

	/**
	 * @private
	 * @returns {boolean}
	 */
	isOnTop: function()
	{
		//Photo Slider or something else can cover Side Panel.
		var centerX = document.documentElement.clientWidth / 2;
		var centerY = document.documentElement.clientHeight / 2;
		var element = document.elementFromPoint(centerX, centerY);

		return BX.hasClass(element, "side-panel") || BX.findParent(element, { className: "side-panel" }) !== null;
	},

	/**
	 * @private
	 * @param {MouseEvent} event
	 * @returns {BX.SidePanel.Link|null} link
	 */
	extractLinkFromEvent: function(event)
	{
		event = event || window.event;
		var target = event.target;

		if (event.which !== 1 || !BX.type.isDomNode(target) || event.ctrlKey || event.metaKey)
		{
			return null;
		}

		var a = target;
		if (target.nodeName !== "A")
		{
			a = BX.findParent(target, { tag: "A" }, 1);
		}

		if (!BX.type.isDomNode(a))
		{
			return null;
		}

		// do not use a.href here, the code will fail on links like <a href="#SG13"></a>
		var href = a.getAttribute("href");
		if (href)
		{
			return {
				url: href,
				anchor: a,
				target: a.getAttribute("target")
			};
		}

		return null;
	},

	/**
	 * @private
	 * @param {MouseEvent} event
	 */
	handleAnchorClick: function(event)
	{
		if (!this.isAnchorBinding())
		{
			return;
		}

		var link = this.extractLinkFromEvent(event);

		if (!link || BX.data(link.anchor, "slider-ignore-autobinding"))
		{
			return;
		}

		var rule = this.getUrlRule(link.url, link);

		if (!this.isValidLink(rule, link))
		{
			return;
		}

		if (BX.type.isFunction(rule.handler))
		{
			rule.handler(event, link);
		}
		else
		{
			event.preventDefault();
			this.open(link.url, rule.options);
		}
	},
	/**
	 * @public
	 * @param {string} url
	 */
	emulateAnchorClick: function(url)
	{
		var link = {
			url : url,
			anchor : null,
			target : null
		};
		var rule = this.getUrlRule(url, link);

		if (!this.isValidLink(rule, link))
		{
			BX.reload(url);
		}
		else if (BX.type.isFunction(rule.handler))
		{
			rule.handler(
				new Event(
					"slider",
					{
						"bubbles" : false,
						"cancelable" : true
					}
				),
				link
			);
		}
		else
		{
			this.open(link.url, rule.options);
		}
	},
	/**
	 * @private
	 * @param {string} href
	 * @param {BX.SidePanel.Link} [link]
	 * @returns {BX.SidePanel.Rule|null}
	 */
	getUrlRule: function(href, link)
	{
		if (!BX.type.isNotEmptyString(href))
		{
			return null;
		}

		for (var k = 0; k < this.anchorRules.length; k++)
		{
			var rule = this.anchorRules[k];

			if (!BX.type.isArray(rule.condition))
			{
				continue;
			}

			for (var m = 0; m < rule.condition.length; m++)
			{
				var matches = href.match(rule.condition[m]);
				if (matches && !this.hasStopParams(href, rule.stopParameters))
				{
					if (link)
					{
						link.matches = matches;
					}

					return rule;
				}
			}
		}

		return null;
	},
	/**
	 * @private
	 * @param {BX.SidePanel.Rule} rule
	 * @param {BX.SidePanel.Link} link
	 * @returns {boolean}
	 */
	isValidLink: function(rule, link)
	{
		if (!rule)
		{
			return false;
		}

		if (rule.allowCrossDomain !== true && BX.ajax.isCrossDomain(link.url))
		{
			return false;
		}

		if (rule.mobileFriendly !== true && BX.browser.IsMobile())
		{
			return false;
		}

		if (BX.type.isFunction(rule.validate) && !rule.validate(link))
		{
			return false;
		}

		return true;
	},

	/**
	 * @private
	 * @param {BX.SidePanel.Slider} slider
	 */
	setBrowserHistory: function(slider)
	{
		if (!(slider instanceof BX.SidePanel.Slider))
		{
			return;
		}

		if (slider.canChangeHistory() && slider.isOpen() && slider.isLoaded())
		{
			window.history.replaceState({}, "", slider.getUrl());
		}
	},

	/**
	 * @private
	 */
	resetBrowserHistory: function()
	{
		var topSlider = null;
		var openSliders = this.getOpenSliders();
		for (var i = openSliders.length - 1; i >= 0; i--)
		{
			var slider = openSliders[i];
			if (slider.canChangeHistory() && slider.isOpen() && slider.isLoaded())
			{
				topSlider = slider;
				break;
			}
		}

		var url = topSlider ? topSlider.getUrl() : this.getPageUrl();
		if (url)
		{
			window.history.replaceState({}, "", url);
		}
	},

	/**
	 * @public
	 */
	updateBrowserTitle: function()
	{
		var title = null;
		var openSliders = this.getOpenSliders();
		for (var i = openSliders.length - 1; i >= 0; i--)
		{
			title = this.getBrowserTitle(openSliders[i]);
			if (BX.type.isNotEmptyString(title))
			{
				break;
			}
		}

		if (BX.type.isNotEmptyString(title))
		{
			document.title = title;
			this.titleChanged = true;
		}
		else if (this.titleChanged)
		{
			document.title = this.getPageTitle();
			this.titleChanged = false;
		}
	},

	/**
	 * @private
	 * @param {BX.SidePanel.Slider} slider
	 */
	getBrowserTitle: function(slider)
	{
		if (!slider || !slider.canChangeTitle() || !slider.isOpen() || !slider.isLoaded())
		{
			return null;
		}

		var title = slider.getTitle();
		if (!title && !slider.isSelfContained())
		{
			title = slider.getFrameWindow() ? slider.getFrameWindow().document.title : null;
		}

		return BX.type.isNotEmptyString(title) ? title : null;
	},

	/**
	 * @private
	 * @param url
	 * @param params
	 * @returns {boolean}
	 */
	hasStopParams: function(url, params)
	{
		if (!params || !BX.type.isArray(params) || !BX.type.isNotEmptyString(url))
		{
			return false;
		}

		var questionPos = url.indexOf("?");
		if (questionPos === -1)
		{
			return false;
		}

		var query = url.substring(questionPos);
		for (var i = 0; i < params.length; i++)
		{
			var param = params[i];
			if (query.match(new RegExp("[?&]" + param + "=", "i")))
			{
				return true;
			}
		}

		return false;
	},

	/**
	 * @deprecated
	 * @public
	 * @returns {null|BX.SidePanel.Slider}
	 */
	getLastOpenPage: function()
	{
		return this.getLastOpenSlider();
	},

	/**
	 * @deprecated use getTopSlider method
	 * @public
	 * @returns {BX.SidePanel.Slider}
	 */
	getCurrentPage: function()
	{
		return this.getTopSlider();
	}
};

})();

/* End */
;
; /* Start:"a:4:{s:4:"full";s:51:"/bitrix/js/main/sidepanel/slider.js?160727847243258";s:6:"source";s:35:"/bitrix/js/main/sidepanel/slider.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function() {

"use strict";

/**
 * @namespace BX.SidePanel
 */
BX.namespace("BX.SidePanel");

/**
 * @class
 * @param {string} url
 * @param {BX.SidePanel.Options} [options]
 * @constructor
 */
BX.SidePanel.Slider = function(url, options)
{
	options = BX.type.isPlainObject(options) ? options : {};
	this.options = options;

	this.contentCallback = BX.type.isFunction(options.contentCallback) ? options.contentCallback : null;
	this.contentCallbackInvoved = false;
	this.contentClassName = BX.type.isNotEmptyString(options.contentClassName) ? options.contentClassName : null;

	this.url = this.contentCallback ? url : this.refineUrl(url);

	this.zIndex = BX.prop.getInteger(options, 'zIndex', 3000);
	this.offset = null;
	this.width = BX.type.isNumber(options.width) ? options.width : null;
	this.cacheable = options.cacheable !== false;
	this.autoFocus = options.autoFocus !== false;
	this.printable = options.printable === true;
	this.allowChangeHistory = options.allowChangeHistory !== false;
	this.allowChangeTitle = BX.type.isBoolean(options.allowChangeTitle) ? options.allowChangeTitle : null;
	this.data = new BX.SidePanel.Dictionary(BX.type.isPlainObject(options.data) ? options.data : {});

	this.customLeftBoundary = null;
	this.setCustomLeftBoundary(options.customLeftBoundary);

	this.title = null;
	this.setTitle(options.title);
	/**
	 *
	 * @type {HTMLIFrameElement}
	 */
	this.iframe = null;
	this.iframeSrc = null;
	this.iframeId = null;
	this.requestMethod =
		BX.type.isNotEmptyString(options.requestMethod) && options.requestMethod.toLowerCase() === "post"
			? "post"
			: "get"
	;
	this.requestParams = BX.type.isPlainObject(options.requestParams) ? options.requestParams : {};

	this.opened = false;
	this.hidden = false;
	this.destroyed = false;
	this.loaded = false;

	this.handleFrameKeyDown = this.handleFrameKeyDown.bind(this);
	this.handleFrameFocus = this.handleFrameFocus.bind(this);

	/**
	 *
	 * @type {{overlay: Element, container: Element, loader: Element, content: Element, label: Element, closeBtn: Element}}
	 */
	this.layout = {
		overlay: null,
		container: null,
		loader: null,
		content: null,
		closeBtn: null,
		printBtn: null
	};

	this.loader =
		BX.type.isNotEmptyString(options.loader)
			? options.loader
			: BX.type.isNotEmptyString(options.typeLoader) ? options.typeLoader : "default-loader"
	;

	this.animation = null;
	this.animationDuration = BX.type.isNumber(options.animationDuration) ? options.animationDuration : 200;
	this.startParams = { translateX: 100, opacity: 0 };
	this.endParams = { translateX: 0, opacity: 40 };
	this.currentParams = null;
	this.overlayAnimation = false;

	this.label = new BX.SidePanel.Label(this);

	var labelOptions = BX.type.isPlainObject(options.label) ? options.label : {};
	this.label.setText(labelOptions.text);
	this.label.setColor(labelOptions.color);
	this.label.setBgColor(labelOptions.bgColor, labelOptions.opacity);

	//Compatibility
	if (
		this.url.indexOf("crm.activity.planner/slider.php") !== -1 &&
		options.events &&
		BX.type.isFunction(options.events.onOpen) &&
		options.events.compatibleEvents !== false
	)
	{
		var onOpen = options.events.onOpen;
		delete options.events.onOpen;
		options.events.onLoad = function(event) {
			onOpen(event.getSlider());
		};
	}

	if (options.events)
	{
		for (var eventName in options.events)
		{
			if (BX.type.isFunction(options.events[eventName]))
			{
				BX.addCustomEvent(
					this,
					BX.SidePanel.Slider.getEventFullName(eventName),
					options.events[eventName]
				);
			}
		}
	}
};

/**
 * @public
 * @static
 * @param {string} eventName
 * @returns {string}
 */
BX.SidePanel.Slider.getEventFullName = function(eventName)
{
	return "SidePanel.Slider:" + eventName;
};

BX.SidePanel.Slider.prototype =
{
	/**
	 * @public
	 * @returns {boolean}
	 */
	open: function()
	{
		if (this.isOpen())
		{
			return false;
		}

		if (!this.canOpen())
		{
			return false;
		}

		if (this.isDestroyed())
		{
			return false;
		}

		this.createLayout();
		BX.addClass(this.getOverlay(), "side-panel-overlay-open side-panel-overlay-opening");
		this.adjustLayout();

		this.opened = true;

		this.fireEvent("onOpenStart");

		this.animateOpening();

		return true;
	},

	/**
	 * @public
	 * @param {boolean} [immediately]
	 * @param {function} [callback]
	 * @returns {boolean}
	 */
	close: function(immediately, callback)
	{
		if (!this.isOpen())
		{
			return false;
		}

		if (!this.canClose())
		{
			return false;
		}

		this.fireEvent("onCloseStart");

		this.opened = false;

		if (this.isDestroyed())
		{
			return false;
		}

		if (this.animation)
		{
			this.animation.stop();
		}

		if (immediately === true || BX.browser.IsMobile())
		{
			this.currentParams = this.startParams;
			this.completeAnimation(callback);
		}
		else
		{
			this.animation = new BX.easing({
				duration : this.animationDuration,
				start: this.currentParams,
				finish: this.startParams,
				transition : BX.easing.transitions.linear,
				step: BX.delegate(function(state) {
					this.currentParams = state;
					this.animateStep(state);
				}, this),
				complete: BX.delegate(function() {
					this.completeAnimation(callback);
				}, this)
			});

			this.animation.animate();
		}

		return true;
	},

	/**
	 * @public
	 * @returns {string}
	 */
	getUrl: function()
	{
		return this.url;
	},

	focus: function()
	{
		this.getWindow().focus();

		// if (this.isSelfContained())
		// {
		// 	this.getContentContainer().setAttribute("tabindex", "0");
		// 	this.getContentContainer().focus();
		// }
	},

	/**
	 * @public
	 * @returns {boolean}
	 */
	isOpen: function()
	{
		return this.opened;
	},

	/**
	 * @public
	 * @param {number} zIndex
	 */
	setZindex: function(zIndex)
	{
		if (BX.type.isNumber(zIndex))
		{
			this.zIndex = zIndex;
		}
	},

	/**
	 * @public
	 * @returns {number}
	 */
	getZindex: function()
	{
		return this.zIndex;
	},

	/**
	 * @public
	 * @param {?number} offset
	 */
	setOffset: function(offset)
	{
		if (BX.type.isNumber(offset) || offset === null)
		{
			this.offset = offset;
		}
	},

	/**
	 * @public
	 * @returns {?number}
	 */
	getOffset: function()
	{
		return this.offset;
	},

	/**
	 * @public
	 * @param {number} width
	 */
	setWidth: function(width)
	{
		if (BX.type.isNumber(width))
		{
			this.width = width;
		}
	},

	/**
	 * @public
	 * @returns {number}
	 */
	getWidth: function()
	{
		return this.width;
	},

	/**
	 * @public
	 * @param {string} title
	 */
	setTitle: function(title)
	{
		if (BX.type.isNotEmptyString(title))
		{
			this.title = title;
		}
	},

	/**
	 * @public
	 * @returns {null|string}
	 */
	getTitle: function()
	{
		return this.title;
	},

	/**
	 * @public
	 * @returns {BX.SidePanel.Dictionary}
	 */
	getData: function()
	{
		return this.data;
	},

	/**
	 * @public
	 * @returns {boolean}
	 */
	isSelfContained: function()
	{
		return this.contentCallback !== null;
	},

	/**
	 * public
	 * @returns {boolean}
	 */
	isPostMethod: function()
	{
		return this.requestMethod === "post";
	},

	/**
	 * @public
	 * @returns {object}
	 */
	getRequestParams: function()
	{
		return this.requestParams;
	},

	/**
	 * @public
	 * @returns {string}
	 */
	getFrameId: function()
	{
		if (this.iframeId === null)
		{
			this.iframeId = "iframe_" + BX.util.getRandomString(10).toLowerCase();
		}

		return this.iframeId;
	},

	/**
	 * @public
	 * @returns {Window}
	 */
	getWindow: function()
	{
		return this.iframe ? this.iframe.contentWindow : window;
	},

	/**
	 * @public
	 * @returns {Window}
	 */
	getFrameWindow: function()
	{
		return this.iframe ? this.iframe.contentWindow : null;
	},

	/**
	 * @public
	 * @returns {boolean}
	 */
	isHidden: function()
	{
		return this.hidden;
	},

	/**
	 * @public
	 * @returns {boolean}
	 */
	isCacheable: function()
	{
		return this.cacheable;
	},

	/**
	 * @public
	 * @returns {boolean}
	 */
	isFocusable: function()
	{
		return this.autoFocus;
	},

	/**
	 * @public
	 * @returns {boolean}
	 */
	isPrintable: function()
	{
		return this.printable;
	},

	/**
	 * @public
	 * @returns {boolean}
	 */
	isDestroyed: function()
	{
		return this.destroyed;
	},

	/**
	 * @public
	 * @returns {boolean}
	 */
	isLoaded: function()
	{
		return this.loaded;
	},

	canChangeHistory: function()
	{
		return (
			this.allowChangeHistory &&
			!this.isSelfContained() &&
			!this.getUrl().match(/^\/bitrix\/(components|tools)\//i)
		);
	},

	canChangeTitle: function()
	{
		if (this.allowChangeTitle === null)
		{
			if (this.getTitle() !== null)
			{
				return true;
			}

			return this.canChangeHistory();
		}

		return this.allowChangeTitle;
	},

	/**
	 * @public
	 * @param {boolean} [cacheable=true]
	 */
	setCacheable: function(cacheable)
	{
		this.cacheable = cacheable !== false;
	},

	/**
	 * @public
	 * @param {boolean} autoFocus
	 */
	setAutoFocus: function(autoFocus)
	{
		this.autoFocus = autoFocus !== false;
	},

	/**
	 * @public
	 * @param {boolean} printable
	 */
	setPrintable: function(printable)
	{
		this.printable = printable !== false;
		this.printable ? this.showPrintBtn() : this.hidePrintBtn();
	},

	/**
	 * @public
	 * @returns {string}
	 */
	getLoader: function()
	{
		return this.loader;
	},

	/**
	 * @public
	 */
	showLoader: function()
	{
		var loader = this.getLoader();
		if (!this.layout.loader || this.layout.loader.dataset.loader !== loader)
		{
			this.createLoader(loader);
		}

		this.layout.loader.style.opacity = 1;
		this.layout.loader.style.display = "block";
	},

	/**
	 * @public
	 */
	closeLoader: function()
	{
		this.layout.loader.style.display = "none";
		this.layout.loader.style.opacity = 0;
	},

	/**
	 * @public
	 */
	showCloseBtn: function()
	{
		this.getLabel().showCloseBtn();
	},

	/**
	 * @public
	 */
	hideCloseBtn: function()
	{
		this.getLabel().hideCloseBtn();
	},

	/**
	 * @public
	 */
	showOrLightenCloseBtn: function()
	{
		if (BX.Type.isStringFilled(this.getLabel().getText()))
		{
			this.getLabel().showCloseBtn();
		}
		else
		{
			this.getLabel().lightenCloseBtn();
		}
	},

	/**
	 * @public
	 */
	hideOrDarkenCloseBtn: function()
	{
		if (BX.Type.isStringFilled(this.getLabel().getText()))
		{
			this.getLabel().hideCloseBtn();
		}
		else
		{
			this.getLabel().darkenCloseBtn();
		}
	},

	/**
	 * @public
	 */
	showPrintBtn: function()
	{
		this.getPrintBtn().classList.add("side-panel-print-visible");
	},

	/**
	 * @public
	 */
	hidePrintBtn: function()
	{
		this.getPrintBtn().classList.remove("side-panel-print-visible");
	},

	/**
	 * @public
	 * @param {string} className
	 */
	setContentClass: function(className)
	{
		if (BX.type.isNotEmptyString(className))
		{
			this.removeContentClass();
			this.contentClassName = className;
			this.getContentContainer().classList.add(className);
		}
	},

	/**
	 * @public
	 */
	removeContentClass: function()
	{
		if (this.contentClassName !== null)
		{
			this.getContentContainer().classList.remove(this.contentClassName);
			this.contentClassName = null;
		}
	},

	/**
	 * @public
	 * @returns {void}
	 */
	applyHacks: function()
	{

	},

	/**
	 * @public
	 * @returns {void}
	 */
	applyPostHacks: function()
	{

	},

	/**
	 * @public
	 * @returns {void}
	 */
	resetHacks: function()
	{

	},

	/**
	 * @public
	 * @returns {void}
	 */
	resetPostHacks: function()
	{

	},

	/**
	 * @public
	 * @returns {number}
	 */
	getTopBoundary: function()
	{
		return 0;
	},

	/**
	 * @protected
	 * @return {number}
	 */
	calculateLeftBoundary: function()
	{
		var customLeftBoundary = this.getCustomLeftBoundary();
		if (customLeftBoundary !== null)
		{
			return customLeftBoundary;
		}

		return this.getLeftBoundary();
	},

	/**
	 * @public
	 * @returns {number}
	 */
	getLeftBoundary: function()
	{
		var windowWidth = BX.browser.IsMobile() ? window.innerWidth : document.documentElement.clientWidth;
		return windowWidth < 1160 ? this.getMinLeftBoundary() : 300;
	},

	/**
	 * @public
	 * @returns {number}
	 */
	getMinLeftBoundary: function()
	{
		return 65;
	},

	/**
	 * @internal
	 * @returns {number}
	 */
	getLeftBoundaryOffset: function()
	{
		var offset = this.getOffset() !== null ? this.getOffset() : 0;

		return Math.max(this.calculateLeftBoundary(), this.getMinLeftBoundary()) + offset;
	},

	/**
	 * @public
	 * @param {number} boundary
	 */
	setCustomLeftBoundary: function(boundary)
	{
		if (BX.type.isNumber(boundary) || boundary === null)
		{
			this.customLeftBoundary = boundary;
		}
	},

	/**
	 * @public
	 * @return {number}
	 */
	getCustomLeftBoundary: function()
	{
		return this.customLeftBoundary;
	},

	/**
	 * @public
	 * @returns {number}
	 */
	getRightBoundary: function()
	{
		return -window.pageXOffset;
	},

	/**
	 * @public
	 * @returns {boolean}
	 */
	destroy: function()
	{
		this.firePageEvent("onDestroy");
		this.fireFrameEvent("onDestroy");

		var frameWindow = this.getFrameWindow();
		if (frameWindow)
		{
			frameWindow.removeEventListener("keydown", this.handleFrameKeyDown);
			frameWindow.removeEventListener("focus", this.handleFrameFocus);
		}

		BX.remove(this.layout.overlay);

		this.layout.container = null;
		this.layout.overlay = null;
		this.layout.content = null;
		this.layout.closeBtn = null;
		this.layout.printBtn = null;
		this.layout.loader = null;

		this.iframe = null;
		this.destroyed = true;

		if (this.options.events)
		{
			for (var eventName in this.options.events)
			{
				BX.removeCustomEvent(this, BX.SidePanel.Slider.getEventFullName(eventName), this.options.events[eventName]);
			}
		}

		return true;
	},

	/**
	 * @private
	 */
	hide: function()
	{
		this.hidden = true;
		this.getContainer().style.display = "none";
		this.getOverlay().style.display = "none";
	},

	/**
	 * @private
	 */
	unhide: function()
	{
		this.hidden = false;
		this.getContainer().style.removeProperty("display");
		this.getOverlay().style.removeProperty("display");
	},

	/**
	 * @public
	 */
	reload: function()
	{
		if (this.isSelfContained())
		{
			this.contentCallbackInvoved = false;
			this.setContent();
		}
		else
		{
			this.showLoader();
			this.getFrameWindow().location.reload();
		}
	},

	/**
	 * @public
	 */
	adjustLayout: function()
	{
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		var windowHeight = BX.browser.IsMobile() ? window.innerHeight : document.documentElement.clientHeight;

		var topBoundary = this.getTopBoundary();
		var isTopBoundaryVisible = topBoundary - scrollTop > 0;
		topBoundary = isTopBoundaryVisible ? topBoundary : scrollTop;

		var height = isTopBoundaryVisible > 0 ? windowHeight - topBoundary + scrollTop : windowHeight;
		var leftBoundary = this.getLeftBoundaryOffset();

		this.getOverlay().style.left = window.pageXOffset + "px";
		this.getOverlay().style.top = topBoundary + "px";
		this.getOverlay().style.right = this.getRightBoundary() + "px";
		this.getOverlay().style.height = height + "px";

		this.getContainer().style.width = "calc(100% - " + leftBoundary + "px)";
		this.getContainer().style.height = height + "px";

		if (this.getWidth() !== null)
		{
			this.getContainer().style.maxWidth = this.getWidth() + "px";
		}

		this.getLabel().adjustLayout();
	},

	/**
	 * @private
	 */
	createLayout: function()
	{
		if (this.layout.overlay !== null && this.layout.overlay.parentNode)
		{
			return;
		}

		if (this.isSelfContained())
		{
			this.getContentContainer().style.overflow = "auto";
			document.body.appendChild(this.getOverlay());
			this.setContent();
		}
		else
		{
			this.getContentContainer().appendChild(this.getFrame());
			document.body.appendChild(this.getOverlay());
			this.setFrameSrc(); //setFrameSrc must be below than appendChild, otherwise POST method fails.
		}
	},

	/**
	 * @public
	 * @returns {HTMLIFrameElement}
	 */
	getFrame: function()
	{
		if (this.iframe !== null)
		{
			return this.iframe;
		}

		this.iframe = BX.create("iframe", {
			attrs: {
				"src": "about:blank",
				"frameborder": "0"
			},
			props: {
				className: "side-panel-iframe",
				name: this.getFrameId(),
				id: this.getFrameId()
			},
			events: {
				load: this.handleFrameLoad.bind(this)
			}
		});

		return this.iframe;
	},

	/**
	 * @public
	 * @returns {Element}
	 */
	getOverlay: function()
	{
		if (this.layout.overlay !== null)
		{
			return this.layout.overlay;
		}

		this.layout.overlay = BX.create("div", {
			props: {
				className: "side-panel side-panel-overlay"
			},
			events: {
				click: this.handleOverlayClick.bind(this)
			},
			style: {
				zIndex: this.getZindex()
			},
			children: [
				this.getContainer()
			]
		});

		return this.layout.overlay;
	},

	unhideOverlay: function()
	{
		this.getOverlay().classList.remove("side-panel-overlay-hidden");
	},

	hideOverlay: function()
	{
		this.getOverlay().classList.add("side-panel-overlay-hidden");
	},

	hideShadow: function()
	{
		this.getContainer().classList.remove("side-panel-show-shadow");
	},

	showShadow: function()
	{
		this.getContainer().classList.add("side-panel-show-shadow");
	},

	setOverlayAnimation: function(animate)
	{
		if (BX.type.isBoolean(animate))
		{
			this.overlayAnimation = animate;
		}
	},

	getOverlayAnimation: function()
	{
		return this.overlayAnimation;
	},

	/**
	 * @public
	 * @returns {Element}
	 */
	getContainer: function()
	{
		if (this.layout.container !== null)
		{
			return this.layout.container;
		}

		this.layout.container = BX.create("div", {
			props: {
				className: "side-panel side-panel-container"
			},
			style: {
				zIndex: this.getZindex() + 1
			},
			children: [
				this.getContentContainer(),
				this.getLabel().getContainer(),
				this.getPrintBtn()
			]
		});

		return this.layout.container;
	},

	/**
	 * @public
	 * @returns {Element}
	 */
	getContentContainer: function()
	{
		if (this.layout.content !== null)
		{
			return this.layout.content;
		}

		this.layout.content = BX.create("div", {
			props: {
				className:
					"side-panel-content-container" +
					(this.contentClassName !== null ? " " + this.contentClassName : "")
			}
		});

		return this.layout.content;
	},

	/**
	 * @public
	 * @returns {Element}
	 */
	getCloseBtn: function()
	{
		return this.getLabel().getCloseBtn();
	},

	/**
	 * @public
	 * @returns {BX.SidePanel.Label}
	 */
	getLabel: function()
	{
		return this.label;
	},

	/**
	 * @public
	 * @returns {Element}
	 */
	getPrintBtn: function()
	{
		if (this.layout.printBtn !== null)
		{
			return this.layout.printBtn;
		}

		this.layout.printBtn = BX.create("span", {
			props: {
				className: "side-panel-print",
				title: BX.message("MAIN_SIDEPANEL_PRINT")
			},
			events: {
				click: this.handlePrintBtnClick.bind(this)
			}
		});

		return this.layout.printBtn;
	},

	/**
	 * @private
	 */
	setContent: function()
	{
		if (this.contentCallbackInvoved)
		{
			return;
		}

		this.contentCallbackInvoved = true;

		BX.cleanNode(this.getContentContainer());
		this.showLoader();

		var promise = this.contentCallback(this);
		var isPromiseReturned =
				promise &&
				(
					Object.prototype.toString.call(promise) === "[object Promise]" ||
					promise.toString() === "[object BX.Promise]"
				)
		;

		if (!isPromiseReturned)
		{
			promise = Promise.resolve(promise);
		}

		promise.then(
			function(result)
			{
				if (this.isDestroyed())
				{
					return;
				}

				if (BX.type.isPlainObject(result) && BX.type.isNotEmptyString(result.html))
				{
					BX.html(this.getContentContainer(), result.html).then(
						function() {
							this.removeLoader();
							this.loaded = true;
							this.firePageEvent("onLoad");
						}.bind(this),

						function(reason) {
							this.removeLoader();
							this.getContentContainer().innerHTML = reason;
						}.bind(this)
					);
				}
				else
				{
					if (BX.type.isDomNode(result))
					{
						this.getContentContainer().appendChild(result);
					}
					else if (BX.type.isNotEmptyString(result))
					{
						this.getContentContainer().innerHTML = result;
					}

					this.removeLoader();
					this.loaded = true;
					this.firePageEvent("onLoad");
				}
			}.bind(this),
			function(reason)
			{
				this.removeLoader();
				this.getContentContainer().innerHTML = reason;
			}.bind(this)
		);
	},

	/**
	 * @private
	 */
	setFrameSrc: function()
	{
		if (this.iframeSrc === this.getUrl())
		{
			return;
		}

		var url = BX.util.add_url_param(this.getUrl(), { IFRAME: "Y", IFRAME_TYPE: "SIDE_SLIDER" });

		if (this.isPostMethod())
		{
			var form = document.createElement("form");
			form.method = "POST";
			form.action = url;
			form.target = this.getFrameId();
			form.style.display = "none";

			BX.util.addObjectToForm(this.getRequestParams(), form);

			document.body.appendChild(form);

			form.submit();

			BX.remove(form);
		}
		else
		{
			this.iframeSrc = this.getUrl();
			this.iframe.src = url;
		}

		this.showLoader();
	},

	/**
	 * @private
	 * @param loader
	 */
	createLoader: function(loader)
	{
		BX.remove(this.layout.loader);

		loader = BX.type.isNotEmptyString(loader) ? loader : "default-loader";

		var oldLoaders = [
			"task-new-loader",
			"task-edit-loader",
			"task-view-loader",
			"crm-entity-details-loader",
			"crm-button-view-loader",
			"crm-webform-view-loader",
			"create-mail-loader",
			"view-mail-loader"
		];

		var matches = null;
		if (BX.util.in_array(loader, oldLoaders) && this.loaderExists(loader))
		{
			this.layout.loader = this.createOldLoader(loader);
		}
		else if (loader.charAt(0) === "/")
		{
			this.layout.loader = this.createSvgLoader(loader);
		}
		else if (matches = loader.match(/^([a-z0-9-_.]+):([a-z0-9-_.]+)$/i))
		{
			var moduleId = matches[1];
			var svgName = matches[2];
			var svg = "/bitrix/images/" + moduleId + "/slider/" + svgName + ".svg";
			this.layout.loader = this.createSvgLoader(svg);
		}
		else
		{
			loader = "default-loader";
			this.layout.loader = this.createDefaultLoader();
		}

		this.layout.loader.dataset.loader = loader;
		this.getContainer().appendChild(this.layout.loader);
	},

	createSvgLoader: function(svg)
	{
		return BX.create("div", {
			props: {
				className: "side-panel-loader"
			},
			children: [
				BX.create("div", {
					props: {
						className: "side-panel-loader-container"
					},
					style: {
						backgroundImage: 'url("' + svg +'")'
					}
				})
			]
		});
	},

	createDefaultLoader: function()
	{
		return BX.create("div", {
			props: {
				className: "side-panel-loader"
			},
			children: [
				BX.create("div", {
					props: {
						className: "side-panel-default-loader-container"
					},
					html:
						'<svg class="side-panel-default-loader-circular" viewBox="25 25 50 50">' +
							'<circle ' +
								'class="side-panel-default-loader-path" ' +
								'cx="50" cy="50" r="20" fill="none" stroke-miterlimit="10"' +
							'/>' +
						'</svg>'
				})
			]
		});
	},

	/**
	 * @private
	 * @param {string} loader
	 * @returns {Element}
	 */
	createOldLoader: function(loader)
	{
		if (loader === "crm-entity-details-loader")
		{
			return BX.create("div", {
				props: {
					className: "side-panel-loader " + loader
				},
				children: [
					BX.create("img", {
						attrs: {
							src:
								"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAA1BMVEX" +
								"///+nxBvIAAAAAXRSTlMAQObYZgAAAAtJREFUeAFjGMQAAACcAAG25ruvAAAAAElFTkSuQmCC"
						},
						props: {
							className: "side-panel-loader-mask top"
						}
					}),
					BX.create("div", {
						props: {
							className: "side-panel-loader-bg left"
						},
						children: [
							BX.create("img", {
								attrs: {
									src:
										"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAA1B" +
										"MVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAtJREFUeAFjGMQAAACcAAG25ruvAAAAAElFTkSuQmCC"
								},
								props: {
									className: "side-panel-loader-mask left"
								}
							})
						]
					}),
					BX.create("div", {
						props: {
							className: "side-panel-loader-bg right"
						},
						children: [
							BX.create("img", {
								attrs: {
									src:
										"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAA1BM" +
										"VEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAtJREFUeAFjGMQAAACcAAG25ruvAAAAAElFTkSuQmCC"
								},
								props: {
									className: "side-panel-loader-mask right"
								}
							})
						]
					})
				]
			});
		}
		else
		{
			return BX.create("div", {
				props: {
					className: "side-panel-loader " + loader
				},
				children: [
					BX.create("img", {
						attrs: {
							src:
								"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAA1BMVEX" +
								"///+nxBvIAAAAAXRSTlMAQObYZgAAAAtJREFUeAFjGMQAAACcAAG25ruvAAAAAElFTkSuQmCC"
						},
						props: {
							className: "side-panel-loader-mask left"
						}
					}),
					BX.create("img", {
						attrs: {
							src:
								"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAA" +
								"1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAtJREFUeAFjGMQAAACcAAG25ruvAAAAAElFTkSuQmCC"
						},
						props: {
							className: "side-panel-loader-mask right"
						}
					})
				]
			});
		}
	},

	loaderExists: function(loader)
	{
		if (!BX.type.isNotEmptyString(loader))
		{
			return false;
		}

		for (var i = 0; i < document.styleSheets.length; i++)
		{
			var style = document.styleSheets[i];
			if (!BX.type.isNotEmptyString(style.href) || style.href.indexOf("sidepanel") === -1)
			{
				continue;
			}

			var rules = style.rules || style.cssRules;
			for (var j = 0; j < rules.length; j++)
			{
				var rule = rules[j];
				if (BX.type.isNotEmptyString(rule.selectorText) && rule.selectorText.indexOf(loader) !== -1)
				{
					return true;
				}

			}
		}

		return false;
	},

	/**
	 * @private
	 */
	removeLoader: function()
	{
		BX.remove(this.layout.loader);
		this.layout.loader = null;
	},

	/**
	 * @private
	 */
	animateOpening: function()
	{
		if (this.isPrintable())
		{
			this.showPrintBtn();
		}

		if (this.animation)
		{
			this.animation.stop();
		}

		if (BX.browser.IsMobile())
		{
			this.currentParams = this.endParams;
			this.animateStep(this.currentParams);
			this.completeAnimation();
			return;
		}

		this.currentParams = this.currentParams ? this.currentParams : this.startParams;
		this.animation = new BX.easing({
			duration : this.animationDuration,
			start: this.currentParams,
			finish: this.endParams,
			transition : BX.easing.transitions.linear,
			step: BX.delegate(function(state) {
				this.currentParams = state;
				this.animateStep(state);
			}, this),
			complete: BX.delegate(function() {
				this.completeAnimation();
			}, this)
		});

		this.animation.animate();
	},

	/**
	 * @private
	 * @param {object} state
	 */
	animateStep: function(state)
	{
		this.getContainer().style.transform = "translateX(" + state.translateX + "%)";
		if(state.translateX === 0 && BX.browser.IsIE10())
		{
			this.getContainer().style.transform = 'none';
		}
		if (this.getOverlayAnimation())
		{
			this.getOverlay().style.backgroundColor = "rgba(0, 0, 0, " + state.opacity / 100 + ")";
		}
	},

	/**
	 * @private
	 * @param callback
	 */
	completeAnimation: function(callback)
	{
		this.animation = null;
		if (this.isOpen())
		{
			this.currentParams = this.endParams;

			BX.removeClass(this.getOverlay(), "side-panel-overlay-opening");

			this.firePageEvent("onBeforeOpenComplete");
			this.fireFrameEvent("onBeforeOpenComplete");

			this.firePageEvent("onOpenComplete");
			this.fireFrameEvent("onOpenComplete");

			if (this.isFocusable())
			{
				this.focus();
			}
		}
		else
		{
			this.currentParams = this.startParams;

			BX.removeClass(this.getOverlay(), "side-panel-overlay-open side-panel-overlay-opening");

			this.getContainer().style.removeProperty("width");
			this.getContainer().style.removeProperty("right");
			this.getContainer().style.removeProperty("max-width");
			this.getContainer().style.removeProperty("min-width");
			this.getCloseBtn().style.removeProperty("opacity");

			this.firePageEvent("onBeforeCloseComplete");
			this.fireFrameEvent("onBeforeCloseComplete");

			this.firePageEvent("onCloseComplete");
			this.fireFrameEvent("onCloseComplete");

			if (BX.type.isFunction(callback))
			{
				callback(this);
			}

			if (!this.isCacheable())
			{
				this.destroy();
			}
		}
	},

	/**
	 * @package
	 * @param eventName
	 * @returns {BX.SidePanel.Event}
	 */
	firePageEvent: function(eventName)
	{
		var event = this.getEvent(eventName);
		if (event === null)
		{
			throw new Error("'eventName' is invalid.");
		}

		BX.onCustomEvent(this, event.getFullName(), [event]);

		//Events for compatibility
		if (BX.util.in_array(eventName, ["onClose", "onOpen"]))
		{
			BX.onCustomEvent("BX.Bitrix24.PageSlider:" + eventName, [this]);
			BX.onCustomEvent("Bitrix24.Slider:" + eventName, [this]);
		}

		return event;
	},

	/**
	 * @package
	 * @param eventName
	 * @returns {BX.SidePanel.Event}
	 */
	fireFrameEvent: function(eventName)
	{
		var event = this.getEvent(eventName);
		if (event === null)
		{
			throw new Error("'eventName' is invalid.");
		}

		var frameWindow = this.getFrameWindow();
		if (frameWindow && frameWindow.BX)
		{
			frameWindow.BX.onCustomEvent(this, event.getFullName(), [event]);

			//Events for compatibility
			if (BX.util.in_array(eventName, ["onClose", "onOpen"]))
			{
				frameWindow.BX.onCustomEvent("BX.Bitrix24.PageSlider:" + eventName, [this]);
				frameWindow.BX.onCustomEvent("Bitrix24.Slider:" + eventName, [this]); // Compatibility
			}
		}

		return event;
	},

	fireEvent: function(eventName)
	{
		this.firePageEvent(eventName);
		this.fireFrameEvent(eventName);
	},

	/**
	 * @private
 	 * @param {string|BX.SidePanel.Event} eventName
	 * @returns {BX.SidePanel.Event|null}
	 */
	getEvent: function(eventName)
	{
		var event = null;
		if (BX.type.isNotEmptyString(eventName))
		{
			event = new BX.SidePanel.Event();
			event.setSlider(this);
			event.setName(eventName);
		}
		else if (eventName instanceof BX.SidePanel.Event)
		{
			event = eventName;
		}

		return event;
	},

	/**
	 * @private
	 * @returns {boolean}
	 */
	canOpen: function()
	{
		return this.canAction("open");
	},

	/**
	 * @private
	 * @returns {boolean}
	 */
	canClose: function()
	{
		return this.canAction("close");
	},

	/**
	 * @package
	 * @returns {boolean}
	 */
	canCloseByEsc: function()
	{
		return this.canAction("closeByEsc");
	},

	/**
	 * @private
	 * @param {string} action
	 * @returns {boolean}
	 */
	canAction: function(action)
	{
		if (!BX.type.isNotEmptyString(action))
		{
			return false;
		}

		var eventName = "on" + action.charAt(0).toUpperCase() + action.slice(1);

		var pageEvent = this.firePageEvent(eventName);
		var frameEvent = this.fireFrameEvent(eventName);

		return pageEvent.isActionAllowed() && frameEvent.isActionAllowed();
	},

	/**
	 * @private
	 * @param {Event} event
	 */
	handleFrameLoad: function(event)
	{
		var frameWindow = this.iframe.contentWindow;
		var iframeLocation = frameWindow.location;

		if (iframeLocation.toString() === "about:blank")
		{
			return;
		}

		frameWindow.addEventListener("keydown", this.handleFrameKeyDown);
		frameWindow.addEventListener("focus", this.handleFrameFocus);

		if (BX.browser.IsMobile())
		{
			frameWindow.document.body.style.paddingBottom = window.innerHeight * 2 / 3 + "px";
		}

		var iframeUrl = iframeLocation.pathname + iframeLocation.search + iframeLocation.hash;
		this.iframeSrc = this.refineUrl(iframeUrl);
		this.url = this.iframeSrc;

		if (this.isPrintable())
		{
			this.injectPrintStyles();
		}

		if (this.loaded)
		{
			this.firePageEvent("onLoad");
			this.fireFrameEvent("onLoad");

			this.firePageEvent("onReload");
			this.fireFrameEvent("onReload");
		}
		else
		{
			this.loaded = true;
			this.firePageEvent("onLoad");
			this.fireFrameEvent("onLoad");
		}

		if (this.isFocusable())
		{
			this.focus();
		}

		this.closeLoader();
	},

	/**
	 * @private
	 * @param {Event} event
	 */
	handleFrameKeyDown: function(event)
	{
		if (event.keyCode !== 27)
		{
			return;
		}

		var popups = BX.findChildren(this.getWindow().document.body, { className: "popup-window" }, false);
		for (var i = 0; i < popups.length; i++)
		{
			var popup = popups[i];
			if (popup.style.display === "block")
			{
				return;
			}
		}

		var centerX = this.getWindow().document.documentElement.clientWidth / 2;
		var centerY = this.getWindow().document.documentElement.clientHeight / 2;
		var element = this.getWindow().document.elementFromPoint(centerX, centerY);

		if (BX.hasClass(element, "bx-core-dialog-overlay") || BX.hasClass(element, "bx-core-window"))
		{
			return;
		}

		if (BX.findParent(element, { className: "bx-core-window" }))
		{
			return;
		}

		this.firePageEvent("onEscapePress");
		this.fireFrameEvent("onEscapePress");
	},

	/**
	 * @private
	 * @param {Event} event
	 */
	handleFrameFocus: function(event)
	{
		this.firePageEvent("onFrameFocus");
	},

	/**
	 * @private
	 * @param {MouseEvent} event
	 */
	handleOverlayClick: function(event)
	{
		if (event.target !== this.getOverlay() || this.animation !== null)
		{
			return;
		}

		this.close();
		event.stopPropagation();
	},

	/**
	 * @private
	 * @param {MouseEvent} event
	 */
	handlePrintBtnClick: function(event)
	{
		if (this.isSelfContained())
		{
			var frame = document.createElement("iframe");
			frame.src = "about:blank";
			frame.name = "sidepanel-print-frame";
			frame.style.display = "none";
			document.body.appendChild(frame);

			var frameWindow = frame.contentWindow;
			var frameDoc = frameWindow.document;
			frameDoc.open();
			frameDoc.write('<html><head>');

			var headTags = "";
			var links = document.head.querySelectorAll("link, style");
			for (var i = 0; i < links.length; i++)
			{
				var link = links[i];
				headTags += link.outerHTML;
			}

			headTags += "<style>html, body { background: #fff !important; height: 100%; }</style>";

			frameDoc.write(headTags);

			frameDoc.write('</head><body>');
			frameDoc.write(this.getContentContainer().innerHTML);
			frameDoc.write('</body></html>');
			frameDoc.close();

			frameWindow.focus();
			frameWindow.print();

			setTimeout(function() {
				document.body.removeChild(frame);
				window.focus();
			}, 1000);

		}
		else
		{
			this.focus();
			this.getFrameWindow().print();
		}
	},

	/**
	 * @private
	 */
	injectPrintStyles: function()
	{
		var frameDocument = this.getFrameWindow().document;

		var bodyClass = "";

		var classList = frameDocument.body.classList;
		for (var i = 0; i < classList.length; i++)
		{
			var className = classList[i];
			bodyClass += "." + className;
		}

		var bodyStyle = "@media print { body" + bodyClass + " { " +
			"background: #fff !important; " +
			"-webkit-print-color-adjust: exact;" +
			"color-adjust: exact; " +
		"} }";

		var style = frameDocument.createElement("style");
		style.type = "text/css";
		if (style.styleSheet)
		{
			style.styleSheet.cssText = bodyStyle;
		}
		else
		{
			style.appendChild(frameDocument.createTextNode(bodyStyle));
		}

		frameDocument.head.appendChild(style);
	},

	/**
	 * @public
	 * @param {string} url
	 * @returns {string}
	 */
	refineUrl: function(url)
	{
		if (BX.type.isNotEmptyString(url) && url.match(/IFRAME/))
		{
			return BX.util.remove_url_param(url, ["IFRAME", "IFRAME_TYPE"]);
		}

		return url;
	},
};

/**
 *
 * @constructor
 */
BX.SidePanel.Event = function()
{
	this.slider = null;
	this.action = true;
	this.name = null;
};

BX.SidePanel.Event.prototype =
{
	/**
	 * @public
	 */
	allowAction: function()
	{
		this.action = true;
	},

	/**
	 * @public
	 */
	denyAction: function()
	{
		this.action = false;
	},

	/**
	 * @public
	 * @returns {boolean}
	 */
	isActionAllowed: function()
	{
		return this.action;
	},

	/**
	 * @deprecated use getSlider method
	 * @returns {BX.SidePanel.Slider}
	 */
	getSliderPage: function()
	{
		return this.slider;
	},

	/**
	 * @public
	 * @returns {BX.SidePanel.Slider}
	 */
	getSlider: function()
	{
		return this.slider;
	},

	/**
	 * @public
	 * @param {BX.SidePanel.Slider} slider
	 */
	setSlider: function(slider)
	{
		if (slider instanceof BX.SidePanel.Slider)
		{
			this.slider = slider;
		}
	},

	/**
	 *
	 * @returns {string}
	 */
	getName: function()
	{
		return this.name;
	},

	/**
	 *
	 * @param {string} name
	 */
	setName: function(name)
	{
		if (BX.type.isNotEmptyString(name))
		{
			this.name = name;
		}
	},

	/**
	 *
	 * @returns {string}
	 */
	getFullName: function()
	{
		return BX.SidePanel.Slider.getEventFullName(this.getName());
	}
};

/**
 *
 * @param {object} [options]
 * @param {BX.SidePanel.Slider} [options.sender]
 * @param {object} [options.data]
 * @param {string} [options.name]
 * @param {string} [options.eventId]
 * @param {BX.SidePanel.Slider} [options.slider]
 * @extends {BX.SidePanel.Event}
 * @constructor
 */
BX.SidePanel.MessageEvent = function(options)
{
	BX.SidePanel.Event.apply(this);

	options = BX.type.isPlainObject(options) ? options : {};

	if (!(options.sender instanceof BX.SidePanel.Slider))
	{
		throw new Error("'sender' is not an instance of BX.SidePanel.Slider");
	}

	this.setName("onMessage");
	this.setSlider(options.slider);

	this.sender = options.sender;
	this.data = "data" in options ? options.data : null;
	this.eventId = BX.type.isNotEmptyString(options.eventId) ? options.eventId : null;
};

BX.SidePanel.MessageEvent.prototype =
{
	__proto__: BX.SidePanel.Event.prototype,
	constructor: BX.SidePanel.MessageEvent,

	/**
	 * @public
	 * @returns {BX.SidePanel.Slider|null}
	 */
	getSlider: function()
	{
		return this.slider;
	},

	/**
	 * @public
	 * @returns {BX.SidePanel.Slider}
	 */
	getSender: function()
	{
		return this.sender;
	},

	/**
	 * @public
	 * @returns {*}
	 */
	getData: function()
	{
		return this.data;
	},

	/**
	 * @public
	 * @returns {?string}
	 */
	getEventId: function()
	{
		return this.eventId;
	}
};

/**
 *
 * @param {object} [plainObject]
 * @constructor
 */
BX.SidePanel.Dictionary = function(plainObject)
{
	if (plainObject && !BX.type.isPlainObject(plainObject))
	{
		throw new Error("The argument must be a plain object.");
	}

	this.data = plainObject ? plainObject : {};
};

BX.SidePanel.Dictionary.prototype =
{
	/**
	 * @public
	 * @param {string} key
	 * @param {*} value
	 */
	set: function(key, value)
	{
		if (!BX.type.isNotEmptyString(key))
		{
			throw new Error("The 'key' must be a string.")
		}

		this.data[key] = value;
	},

	/**
	 * @public
	 * @param {string} key
	 * @returns {*}
	 */
	get: function(key)
	{
		return this.data[key];
	},

	/**
	 * @public
	 * @param {string} key
	 */
	delete: function(key)
	{
		delete this.data[key];
	},

	/**
	 * @public
	 * @param {string} key
	 * @returns {boolean}
	 */
	has: function(key)
	{
		return key in this.data;
	},

	/**
	 * @public
	 */
	clear: function()
	{
		this.data = {};
	},

	/**
	 * @public
	 * @returns {object}
	 */
	entries: function()
	{
		return this.data;
	}
};

/**
 * @internal
 * @param {BX.SidePanel.Slider} slider
 * @constructor
 */
BX.SidePanel.Label = function(slider)
{
	/** @type {BX.SidePanel.Slider} */
	this.slider = slider;

	this.layout = {
		label: null,
		closeBtn: null,
		text: null
	};

	this.color = null;
	this.bgColor = null;
	this.text = null;
};

BX.SidePanel.Label.MIN_LEFT_OFFSET = 25;
BX.SidePanel.Label.MIN_TOP_OFFSET = 21;
BX.SidePanel.Label.INTERVAL_TOP_OFFSET = 50;

BX.SidePanel.Label.prototype =
{
	/**
	 *
	 * @returns {Element}
	 */
	getContainer: function()
	{
		if (this.layout.label !== null)
		{
			return this.layout.label;
		}

		this.layout.label = BX.create("div", {
			props: {
				className: "side-panel-label",
			},
			children : [
				this.getCloseBtn(),
				this.getTextContainer(),
			],
			events: {
				click: this.handleClick.bind(this)
			}
		});

		return this.layout.label;
	},

	adjustLayout: function()
	{
		var maxWidth = this.getSlider().getOverlay().offsetWidth - this.getSlider().getContainer().offsetWidth;
		if (maxWidth <= this.getSlider().getMinLeftBoundary())
		{
			this.hideText();
		}
		else
		{
			this.showText();
		}

		this.getContainer().style.maxWidth = (maxWidth - BX.SidePanel.Label.MIN_LEFT_OFFSET) + "px";
	},

	/**
	 * @public
	 * @returns {Element}
	 */
	getCloseBtn: function()
	{
		if (this.layout.closeBtn !== null)
		{
			return this.layout.closeBtn;
		}

		this.layout.closeBtn = BX.create("div", {
			props: {
				className: "side-panel-close-btn",
				title: BX.message("MAIN_SIDEPANEL_CLOSE")
			},
			children : [
				BX.create("div", {
					props: {
						className: "side-panel-close-btn-inner"
					}
				})
			]
		});

		return this.layout.closeBtn;
	},

	/**
	 * @private
	 * @param {MouseEvent} event
	 */
	handleClick: function(event)
	{
		this.getSlider().close();
		event.stopPropagation();
	},

	/**
	 * @public
	 */
	showCloseBtn: function()
	{
		this.getContainer().classList.remove("side-panel-hide-close-btn");
	},

	/**
	 * @public
	 */
	hideCloseBtn: function()
	{
		this.getContainer().classList.add("side-panel-hide-close-btn");
	},

	/**
	 * @public
	 */
	darkenCloseBtn: function()
	{
		this.getContainer().classList.add("side-panel-darken-close-btn");
	},

	/**
	 * @public
	 */
	lightenCloseBtn: function()
	{
		this.getContainer().classList.remove("side-panel-darken-close-btn");
	},

	hideText: function()
	{
		this.getTextContainer().classList.add("side-panel-label-text-hidden");
	},

	showText: function()
	{
		this.getTextContainer().classList.remove("side-panel-label-text-hidden");
	},

	isTextHidden: function()
	{
		return this.getTextContainer().classList.contains("side-panel-label-text-hidden");
	},

	getTextContainer: function()
	{
		if (this.layout.text === null)
		{
			this.layout.text = BX.create("span", {
				props: {
					className: "side-panel-label-text"
				}
			})
		}

		return this.layout.text;
	},

	setColor: function(color)
	{
		if (BX.type.isNotEmptyString(color))
		{
			this.color = color;
			this.getTextContainer().style.color = color;
		}
	},

	getColor: function()
	{
		return this.color;
	},

	setBgColor: function(bgColor, opacity)
	{
		if (BX.type.isNotEmptyString(bgColor))
		{
			var matches = bgColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
			if (matches)
			{
				var hex = matches[1];
				if (hex.length === 3)
				{
					hex = hex.replace(/([a-f0-9])/gi, "$1$1");
				}

				opacity = BX.type.isNumber(opacity) && opacity >= 0 && opacity <= 100 ? opacity : 95;
				var rgb = BX.util.hex2rgb(hex);
				bgColor = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," +  (opacity / 100) + ")";
			}

			this.bgColor = bgColor;
			this.getContainer().style.backgroundColor = bgColor;
		}
		else if (bgColor === null)
		{
			this.bgColor = bgColor;
			this.getContainer().style.removeProperty("backgroundColor");
		}
	},

	getBgColor: function()
	{
		return this.bgColor;
	},

	setText: function(text)
	{
		if (BX.type.isNotEmptyString(text))
		{
			this.text = text;
			this.getTextContainer().textContent = text;
		}
		else if (text === null)
		{
			this.text = text;
			this.getTextContainer().textContent = "";
		}
	},

	getText: function()
	{
		return this.text;
	},

	/**
	 *
	 * @returns {BX.SidePanel.Slider}
	 */
	getSlider: function()
	{
		return this.slider;
	},

	moveAt: function(position)
	{
		if (BX.type.isNumber(position) && position >= 0)
		{
			this.getContainer().style.top =
				BX.SidePanel.Label.MIN_TOP_OFFSET + (position * BX.SidePanel.Label.INTERVAL_TOP_OFFSET) + "px";
		}
	},
};


})();

/* End */
;