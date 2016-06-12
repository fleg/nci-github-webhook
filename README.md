# nci-github-webhook

github webhook plugin for [nci](https://github.com/node-ci/nci)

## Dependencies

[nci-express](https://github.com/fleg/nci-express)

## Installation

```sh
npm install nci-github-webhook
```

## Usage

Add this plugin to the `plugins` section at server config
```yml
plugins:
    - nci-github-webhook
```
after that you can set github webhook at project config
```yml
webhooks:
    github:
        secret: '123456'
```
plugin will listen `POST /webhooks/:projectName/github/123456` route.

## License

[The MIT License](https://raw.githubusercontent.com/fleg/nci-github-webhook/master/LICENSE)
