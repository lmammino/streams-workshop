# streams-workshop

A workshop on Node.js Streams by Luciano Mammino ([@loige](https://twitter.com/loige)). 🤓


## Prerequisites

Before getting started, make sure you have the following prerequisites in your system:

- Node.js 14.16+
- NPM 6.9.0+
- a text editor of your choice
- a bash-compatible shell (if you use Windows you can [install bash](https://www.windowscentral.com/how-install-bash-shell-command-line-windows-10) or use Docker, as [described below](#using-docker))


## Getting started

Clone the repository and run `npm install` to get all the necessary dependencies.

The workshop is divided in chapters and the first chapter starts at [`01-buffer-vs-stream`](01-buffer-vs-stream/README.md).

Every chapter will teach you a specific stream concept and offer you some examples and exercises to familiarize with that concept.

You will often find 2 different types of interactive actions:

- **🎭 PLAY** : commands or instructions you should spend some time with to get familiar with some concepts or APIs

- **🏹 Exercise**: when you have to use some of the concepts you just learned to solve a programming problem. Generally every exercise will have a test that you can run to validate your solution.


Enjoy! 🙃


[➡️ GET STARTED](01-buffer-vs-stream/README.md).


## Using Docker

If you prefer to keep your environment clean and use Docker, you should be able to spin un a workable environment with Docker Compose by running:

```bash
docker-compose run workspace
```

If you use Docker, `npm install` is automatically run for you every time you launch the container.


## Shameless plug 😇

<a href="https://www.nodejsdesignpatterns.com"><img width="240" align="right" src="https://github.com/lmammino/lmammino/blob/master/nodejsdp.jpg?raw=true"></a>

If you like this piece of work, consider supporting me by getting a copy of [Node.js Design Patterns, Third Edition](https://www.nodejsdesignpatterns.com/), which also goes into great depth about Streams and related design patterns.

If you already have this book, **please consider writing a review** on Amazon, Packt, GoodReads or in any other review channel that you generally use. That would support us greatly 🙏.


## Contributing

In the spirit of Open Source, everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/streams-workshop/issues) or by [submitting a PR](https://github.com/lmammino/streams-workshop/pulls).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
