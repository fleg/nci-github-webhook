'use strict';

exports.register = function(app) {
	var logger = app.lib.logger('github webhook listener');
	app.httpServer.addRequestListener(function(req, res, next) {
		var matched = req.url.match(/^\/webhooks\/([\-\w]+)\/github\/(.+)/);
		if (!matched || req.method.toLowerCase() !== 'post') {
			return next();
		}

		var projectName = matched[1];
		var secret = matched[2];

		var project = app.projects.get(projectName);

		if (!project) {
			logger.error('project `%s` not found', projectName);
			return next();
		}

		if (project.scm.type !== 'git') {
			logger.error('not git project `%s`', projectName);
			return next();
		}

		if (req.headers['x-github-event'] !== 'push') {
			// just skip non-push events
			return next();
		}

		if (project.githubWebhook.secret !== secret) {
			logger.error('bad secret');
			return next();
		}

		req.setEncoding('utf-8');
		var bodyString = '';
		req.on('data', function(data) {
			bodyString += data;
		});
		req.on('end', function() {
			var body = bodyString ? JSON.parse(bodyString) : {};
			
			if (!body.ref || !body.ref.endsWith(project.githubWebhook.rev)) {
				// skip different branch
				return next();
			}

			app.builds.create({
				projectName: project.name,
				withScmChangesOnly: false,
				initiator: {type: 'github-webhook'}
			});

			res.end('');
		});
		req.on('error', next);
	});
};
