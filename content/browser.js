var gCcHandler = {
	
	debug_message : function(str){
		
		//alert(str)
		
	},

    // Smart Getters
    get _icon () {		
return document.getElementById('ccffext-icon');
    },

    get _popup () {
return document.getElementById('ccffext-popup');
    },

    get _popup_work_title () {
return document.getElementById('ccffext-popup-work-title');
    },

    get _popup_attribution () {
return document.getElementById('ccffext-popup-attribution-link');
    },

    get _popup_license () {
return document.getElementById('ccffext-popup-license-link');
    },

    get _popup_license_band () {
return document.getElementById('ccffext-popup-license-band');
    },

    get _popup_attrib_html () {
return document.getElementById('ccffext-popup-attrib-html');
    },

    get _popup_num_licensed_objects () {
return document.getElementById('ccffext-popup-licensed-objects');
    },

    get _license_frame_browser () {
return document.getElementById('ccffext-license-frame');
    },

    get _license_frame () {
return licenseloader;
    },

    resetPopup : function() {
// hide popup elements which may or may not be shown for this page
this._popup_license.hidden = true;
this._popup_work_title.hidden = true;
this._popup_num_licensed_objects.hidden = true;
this._popup_attribution.hidden = true;
this._popup_attrib_html.value = "";
this._popup_attrib_html.hidden = true;
this._popup_license_band.setAttribute(
"class", "band-reset");
    },

    // Popup Handlers
    handleIconClick : function(e,clicked) {
		
		var statements = ccffext.cache.get(content.document.location.href).statements;	
		
		ccffext.gc_class.debug_message(statements)

		this.resetPopup();
		
		// update the popup with the license information
		var doc_subject = {uri:content.document.location.href};
		
		// -- license
		
		ccffext.gc_class.debug_message("get license ")
		
		var license = ccffext.objects.getLicense(content.document.location.href, doc_subject);
		
		//ccffext.gc_class.debug_message("past license " + license.uri)
		
		//cc_statement = license.uri.split("/")[4];
		
		//ccffext.gc_class.debug_message("past split ")
		
		ccffext.gc_class.debug_message(license)
		
		/*switch (cc_statement) {
		case "by":
		case "by-sa":
		case "mark":
		case "zero":
		case "publicdomain":
		    license.color = "green";
		    break;

		case "by-nc":
		case "by-nd":
		case "by-nc-nd":
		case "by-nc-sa":
		case "sampling+":
		case "nc-sampling+":
		    license.color = "yellow";
		    break;

		case "sampling":
		case "devnations":
		    license.color = red;
		    break;
		}*/
		
		ccffext.gc_class.debug_message("set attrib")
		
		gCcHandler._popup_license_band.setAttribute("class", "band-" + license.color);
		
		ccffext.gc_class.debug_message("band colour set ")
		
		var is_doc_licensed = false;
		
		if ("undefined" != typeof license) {
		// document is licensed
		is_doc_licensed = true;
		
		//this._popup_license.hidden = false;
		this._popup_license.value = license.uri;
		this._popup_license.setAttribute('href', license.uri);
		
		//alert(" passed into attro html" + doc_subject.uri)
		
		//ccffext.objects.getAttributionHtml(content.document.location.href, doc_subject, gCcHandler);
		
		//alert("never")
		
		//
		
		ccffext.gc_class.debug_message("get license details?")
		
		// ---- get the license details and update the popup when ready
		ccffext.objects.getLicenseDetails(
		content.document.location.href, doc_subject,
		function(document, object, license) {
			
			gCcHandler._popup_license.value = license.name;
		
		
			// -- show the copy and paste HTML
			// -- this is handled in the callback so we are certain
			// -- the license document has been dereferenced and
			// -- parsed
			
			gCcHandler._popup_attrib_html.value = ccffext.objects.getAttributionHtml(content.document.location.href, doc_subject, gCcHandler);
			gCcHandler._popup_attrib_html.hidden = false;
		
		},
		licenseloader, []);
		
		// -- title
		this._popup_work_title.hidden = false;
		this._popup_work_title.value = ccffext.objects.getDisplayTitle(
		content.document.location.href, doc_subject);
		
		// -- attribution link
		let author = ccffext.objects.getAuthor(
		content.document.location.href, doc_subject);
		let author_uri = ccffext.objects.getAuthorUri(
		content.document.location.href, doc_subject);
		
		if ("undefined" != typeof author ||
		"undefined" != typeof author_uri) {
		
		// at least one has been provided
		this._popup_attribution.hidden = false;
		
		if ("undefined" == typeof author &&
		"undefined" != typeof author_uri)
		author = author_uri;
		
		if ("undefined" != typeof author) {
		// attribution name was supplied
		this._popup_attribution.value = author;
		}
		
		if ("undefined" != typeof author_uri) {
		this._popup_attribution.setAttribute('href',
		author_uri.uri);
		this._popup_attribution.setAttribute(
		"class", "identity-popup-label text-link");
		} else {
		// no attribution URL
		this._popup_attribution.setAttribute(
		"class", "identity-popup-label");
		}
		}

	} // if license is not undefined
	
	// how many licensed objects described by this page, excluding the page
	var count = ccffext.objects.getLicensedSubjects(content.document.location.href).length - (is_doc_licensed?1:0);
	
	if (count > 0) {
		this._popup_num_licensed_objects.value = ccffext.l10n.get("icon.title.label", count);
		this._popup_num_licensed_objects.hidden = false;
	}
	
	// show the popup

	if(clicked){

		this._popup.hidden = false;

		var position = (getComputedStyle(gNavToolbox, "").direction == "rtl") ? 'after_end' : 'after_start';

		this._popup.openPopup(this._icon, position);	
	
	}

    },

    handleMoreInfo : function(e) {
gCcHandler.hidePopup();
BrowserPageInfo(null,'ccffext-tab');
    },

    hidePopup : function() {
document.getElementById('ccffext-popup').hidePopup();
    },

    // URL Bar manipulators
    hideIcon : function() {
this._icon.hidden = true;
    },
    
    showIcon : function(document) {
		
		const objects = ccffext.objects.getLicensedSubjects(document.location.href);

		this._icon.hidden = false;
		gCcHandler._icon.setAttribute("tooltiptext",ccffext.l10n.get("icon.title.label",objects.length));
		
    },

    showIconIfLicenseInfo : function(document) {
		
		// if no document is provided, default to the active document
		if ("undefined" == typeof document) {
			document = gBrowser.contentDocument;
		}
		
		// if this is the active document, hide the icon
		if (gBrowser.contentDocument == document)
			gCcHandler.hideIcon();
		
		if (document instanceof HTMLDocument) {
			ccffext.objects.callbackify(document, 
			
										function(document,objects) { 
										
											if (gBrowser.contentDocument == document)
					
												gCcHandler.showIcon(document);
			
											},
										
										function(document) {
											
											// license not cached		
											
											ccffext.gc_class = gCcHandler;	
										
											ccffext.objects.parse(document.location.href, document);
											
											gCcHandler.handleIconClicked(event,false);
											
										}
								);
		}
	
    }
};

/**
* Register window load listener which adds event listeners for tab,
* location, and state changes.
**/
window.addEventListener("load",function() {

    gBrowser.addEventListener(
"TabSelect",
function(e) { gCcHandler.showIconIfLicenseInfo();}, false);
    gBrowser.tabContainer.addEventListener(
"TabSelect",
function(e) { gCcHandler.showIconIfLicenseInfo();}, false);

    gBrowser.addTabsProgressListener({
onLocationChange : function(browser, progress,request,uri) {

// A tab is opened, closed, or switched to
// Show the location bar icon if license information is present
gCcHandler.showIconIfLicenseInfo(progress.DOMWindow.document);

},

onStateChange : function(browser, progress,request,flag,status) {

// A document in an existing tab stopped loading
if (flag & Components.interfaces.nsIWebProgressListener.STATE_STOP)
{
const doc = progress.DOMWindow.document;

gCcHandler.showIconIfLicenseInfo(progress.DOMWindow.document);
}
},

    });

    licenseloader.init(gCcHandler._license_frame_browser);

},false);