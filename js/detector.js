(function() {

SithDetector = function() {
    this.__init__();
};

SithDetector.prototype = {
    __init__: function() {
	this.detectorURL = "{{ hub_url }}/environment/demo/run/sith_detector/sith_detector";
	this.auth = btoa('{{ hub_user }}:{{ hub_password }}');

	this.checking = false;

	this.name = document.getElementById('name');
	this.jobTitle = document.getElementById('jobTitle');
	this.likesCatsYes = document.getElementById('catsYes');
	this.language = document.getElementById('language');
	this.checkButton = document.getElementById('checkButton');

	this.msgJobTitle = document.getElementById('msgJobTitle');
	this.msgName = document.getElementById('msgName');
	this.msgSithName = document.getElementById('msgSithName');
	this.dismissSith = document.getElementById('dismissSith');

	this.msgName2 = document.getElementById('msgName2');
	this.dismissNotSith = document.getElementById('dismissNotSith');

	this.fade = document.getElementById('fade');
	this.sithPopover = document.getElementById('sithPopover');
	this.notSithPopover = document.getElementById('notSithPopover');

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

	this.dismissNotSith.addEventListener('click', function(e) {
	    self.hideNotSith(e);
	});
	this.dismissSith.addEventListener('click', function(e) {
	    self.hideSith(e);
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

	data = {
	    'Name': this.name.value,
	    'JobTitle': this.jobTitle.value,
	    'LikesCats': this.likesCatsYes.checked,
	    'FavouriteLanguage': this.language.value
	}

	url = this.detectorURL
	sep = "?"
	for (var k in data) {
	    url += sep + k + "=" + encodeURIComponent(data[k])
	    sep = "&"
	}

	console.log(url)

	request.open('GET', url, true);
	request.setRequestHeader("Authorization", "Basic " + this.auth)
	request.send();

	this.checking = true;
	this.formChanged();
    },

    onReadyStateChange: function(request) {
	if (request.readyState == XMLHttpRequest.DONE) {
	    if (request.status == 0
		|| (request.status >= 200 && request.status < 400)) {
		result = JSON.parse(request.responseText);

		if (result["sith"]) {
		    this.msgName.innerText = this.name.value;
		    this.msgJobTitle.innerText = this.jobTitle.value;
		    this.msgSithName.innerText = "Darth " + result["sithName"];

		    this.showSith();
		} else {
		    this.msgName2.innerText = this.name.value;

		    this.showNotSith();
		}

		this.name.value = "";
		this.jobTitle.value = "";
		this.language.value = "";
		this.likesCatsYes.checked = true;
	    } else {
		alert("Sith interference detected! Error code " + request.status)
	    }

	    this.checking = false;
	    this.formChanged();
	}
    },

    addClass: function(elt, clss) {
	var classes = elt.className.split(' ');
	var ndx = classes.indexOf(clss);
	if (ndx == -1) {
	    classes.push(clss);
	}
	elt.className = classes.join(' ');
    },

    removeClass: function(elt, clss) {
	var classes = elt.className.split(' ');
	var ndx = classes.indexOf(clss);
	if (ndx > -1) {
	    classes.splice(ndx, 1);
	}
	elt.className = classes.join(' ');
    },

    hideSith: function(e) {
	this.addClass(this.fade, "hidden");
	this.addClass(this.sithPopover, "hidden");
    },

    hideNotSith: function(e) {
	this.addClass(this.fade, "hidden");
	this.addClass(this.notSithPopover, "hidden");
    },

    showSith: function() {
	this.removeClass(this.fade, "hidden");
	this.removeClass(this.sithPopover, "hidden");
    },

    showNotSith: function() {
	this.removeClass(this.fade, "hidden");
	this.removeClass(this.notSithPopover, "hidden");
    }
};

var detector = new SithDetector();

})();
