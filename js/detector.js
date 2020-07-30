(function() {

SithDetector = function() {
    this.__init__();
};

SithDetector.prototype = {
    __init__: function() {
	this.detectorURL = "https://hub-master.staging.wpscloud.co.uk/environment/demo/run/WebDemos/python/SithDetector";

	this.checking = false;

	this.name = document.getElementById('name');
	this.jobTitle = document.getElementById('jobTitle');
	this.likesCatsYes = document.getElementById('catsYes');
	this.language = document.getElementById('language');
	this.checkButton = document.getElementById('checkButton');

	var self = this;

	this.name.addEventListener('input', function(e) {
	    self.formChanged(e);
	});
	this.jobTitle.addEventListener('input', function(e) {
	    self.formChanged(e);
	});
	this.likesCatsYes.addEventListener('change', function(e) {
	    self.formChanged(e);
	});
	this.language.addEventListener('input', function(e) {
	    self.formChanged(e);
	});

	this.checkButton.addEventListener('click', function(e) {
	    self.checkColleague(e);
	});

	this.formChanged();
    },

    formChanged: function(e) {
	var ready = !this.checking;

	if (this.name.value.length < 2)
	    ready = false;
	if (this.jobTitle.value.length < 2)
	    ready = false;
	if (this.language.value == "")
	    ready = false;

	this.checkButton.disabled = !ready;
    },

    checkColleague: function(e) {
	var request = new XMLHttpRequest();
	var self = this;

	request.onreadystatechange = function() {
	    self.onReadyStateChange(request);
	};
	request.open('GET', this.detectorURL, true);
	request.send();

	this.checking = true;
	this.formChanged();
    },

    onReadyStateChange: function(request) {
	if (request.readyState == XMLHttpRequest.DONE) {
	    if (request.status == 0
		|| (request.status >= 200 && request.status < 400)) {
		console.log(request.responseText);
		this.name.value = "";
		this.name.jobTitle = "";
		this.language.value = "";
		this.likesCatsYes.value = true;
	    } else {
		alert("Sith interference detected! Error code " + request.status)
	    }

	    this.checking = false;
	    this.formChanged();
	}
    }
};

var detector = new SithDetector();

})();
