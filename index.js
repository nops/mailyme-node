(function() {
	var http = require('http'), request;
	
	request = {
		path: 'http://maily.me/api/1.0/send',
		method: 'POST', 
		headers: {
			'Content-Type': 'application/json'
		}
	};
	
	exports.MailyMe = (function() {
		function MailyMe(apiKey) {
			this.apiKey = apiKey != null ? apiKey : null;
		};
		
		MailyMe.prototype.send = function(params, callbacksuccess, callbackerror) {
			if (params == null) {
				params = {};
			}
			params.key = this.apiKey;
			
			var req = http.request(request, (function(_this) {
				return function(res) {
					var json = '';
					res.setEncoding('utf8');
					res.on('data', function(d) {
						return json += d;
					});
					return res.on('end', function() {
						try {
							json = JSON.parse(json);
						} catch (error) {
							json = {
								success: false,
								error: error
							};
						}
						if (!json) {
							json = {
								success: false,
								error: 'Invalid response'
							};
						}
						if (res.statusCode !== 200) {
							if (callbackerror) {
								return callbackerror(json);
							} else {
								return _this.callbackerror(json);
							}
						} else {
							if (callbacksuccess) {
								return callbacksuccess(json);
							}
						}
					});
				};
			})(this));
			req.write(params);
			req.end();
			req.on('error', (function(_this) {
				return function(error) {
					if (callbackerror) {
						return callbackerror(error);
					} else {
						return _this.onerror({
							success: false,
							error: error
						});
					}
				};
			})(this));
			return null;
		};
		
		MailyMe.prototype.onerror = function(err) {
			throw {
				success: err.success,
				error: err.error
			};
		};
	});
})(this);