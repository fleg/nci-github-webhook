'use strict';

var BaseWebhook = require('nci-base-webhook').BaseWebhook,
	inherits = require('util').inherits;

var GithubWebhook = function() {
	BaseWebhook.call(this, {name: 'github'});
};

inherits(GithubWebhook, BaseWebhook);

GithubWebhook.prototype.check = function(req, project) {
	return req.headers['x-github-event'] === 'push' &&
		req.body.ref === 'refs/heads/' + project.scm.rev;
};

exports.register = function(app) {
	var githubWebhook = new GithubWebhook();

	githubWebhook.register(app);
};
