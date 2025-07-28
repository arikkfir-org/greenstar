# Contributing

Hi there! We're thrilled that you'd like to contribute to this project. Your help is essential for keeping it great.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in
this project you agree to abide by its terms.

## Set up your development environment

> [!NOTE]
> Currently, macOS is the only supported development platform. We expect Linux support to come soon.

### TL;DR:

```shell
$ brew install go-task      # Ensure you have the "task" CLI
$ task setup-domain-dns     # Setup your local DNS to resolve *.greenstar.test to 127.0.0.1
$ task dev                  # Starts Skaffold dev loop, that's it! 
```

> [!IMPORTANT]
> The `setup-domain-dns` target invokes `sudo` to set up the local DNS resolving - therefore, you might get some
> password prompts during invocation. The commands that use `sudo` can be found in the `Taskfile` for review.

Navigate to https://acme.app.greenstar.test (yes it will resolve to your local cluster!) to see the app! Any changes
you make to the backend or frontend will be reflected and reloaded automatically (backend changes could take a few
seconds if they require a Docker image rebuild...)

### Teardown

To delete your local `kind` cluster run the following:

```shell
$ task teardown-cluster
```

### What does `setup-domain-dns` do?

The `setup-domain-dns` will enable resolving the `*.greenstar.test` DNS entries in your workstation. You can think of it
as an alias to `localhost`, with the only difference that you can generate TLS certificates for it. In fact, the setup
does exactly that as part of the `setup-cluster` and installs these certificates in the local cluster's Ingress
controller (Traefik).

This way, you will be able to use https://acme.app.greenstar.test (note the use of `HTTPS` protocol!) without getting
any prompts from the browser about bad or missing certificates. In other words, full TLS development right here in your
workstation!

#### Self-signed certificates & macOS

Some tools do not use macOS's native key-chain of trusted certificates, and thus fail when trying to connect via TLS to
the `greenstar.test` domain. This can usually be fixed for common platforms - here are a few:

##### OpenJDK

To make OpenJDK use the native macOS key-chain trust store:

```shell
$ export JAVA_TOOL_OPTIONS="-Djavax.net.ssl.trustStoreType=KeychainStore"
```

This, of course, will only apply to the shell session you run it in. You can add this to your `zsh` or `bash` startup
scripts (e.g. `.bashrc`, `.zshrc`, etc.) so it gets executed for every session.

See details
here: https://stackoverflow.com/questions/14280578/how-to-set-up-java-vm-to-use-the-root-certificates-truststore-handled-by-mac-o

##### OpenSSL

The Homebrew-installed version of OpenSSL **does not** use macOS's Keychain Certificates, which means that it will not
consider the certificates returned as valid.

To make it use the native macOS keychain trust store:

```shell
$ brew tap raggi/ale
$ brew install openssl-osx-ca
$ brew services start openssl-osx-ca
```

See details here: https://akrabat.com/syncing-macos-keychain-certificates-with-homebrews-openssl/

### What does `setup-cluster` do?

This target sets up a local Kubernetes cluster using `kind`, and installs the following components in it:

- Creates a local `kind` cluster
- Installs the Kubernetes Gateway API CRDs
- Installs Traefik as the Ingress Controller & Gateway API implementation
- Installs observability tools such as Prometheus, Jaeger & Grafana

## Developing

Once a local cluster has been created, the easiest way to get up & running is using Skaffold to (continuously)
deploy the Helm chart into the cluster. Skaffold will keep the deployed chart updated with any code changes you make
automatically, and can be run from the CLI, or from the VSCode/JetBrains IDEs (easier).

To run it from the CLI, simply run:

```shell
$ task dev
```

This will keep running in the shell foreground and redeploy whenever you make changes to your source code. To stop,
just press CTRL+C and it will undeploy and stop.

If, however, you prefer to perform a one-off deployment without the Skaffold development loop, use this instead:

```shell
$ task deploy
```

To remove it, use this:

```shell
$ task undeploy
```

### Testing

To run the tests, use this in the root project directory (not in `server` or `frontend`!):

```shell
$ task test
```

## Issues and PRs

If you have suggestions for how this project could be improved, or want to report a bug, open an issue! We'd love all
and any contributions. If you have questions, too, we'd love to hear them.

We'd also love PRs. If you're thinking of a large PR, we advise opening up an issue first to talk about it, though! Look
at the links below if you're not sure how to open a PR.

## Submitting a pull request

1. [Fork](https://github.com/arikkfir-org/greenstar/fork) and clone the repository.
2. Make sure you set up your local development environment as described above.
3. Create a new branch: `git checkout -b my-branch-name`.
4. Make your change, add your feature/bug specific tests, and make sure the entire tests suite passes (see above)
5. Push to your fork, and submit a pull request
6. Pat your self on the back and wait for your pull request to be reviewed and merged.

Here are a few things you can do that will increase the likelihood of your pull request being accepted:

- Write and update tests.
- Keep your changes as focused as possible
    - Smaller PRs make faster & easier reviews, which make faster acceptance & merges
    - Keep each PR focused on one specific change
- Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).
- Provide any and all necessary information in the PR description to help reviewers understand the context and impact of
  your change.

Work in Progress pull requests are also welcome to get feedback early on, or if there is something blocked you.

### Conventions

Please make sure all commit messages are written in accordance with the
[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) standard. Here's a brief summary of how they
should look:

```
<type>[optional scope]: <description>

[optional body]
```

#### Types

- feat: MUST be used when a commit is mostly focused on adding a new feature to the application.
- fix: MUST be used when a commit is mostly focused on fixing a bug or an incorrect behavior.
- tests: MUST be used when the commit is mostly focused on testing.
- docs: MUST be used when the commit is mostly focused on documentation.
- perf: MUST be used when a commit is mostly focused on improving performance for a specific feature or functionality.
- ci: MUST be used when a commit is centered around improvements to the CI pipelines or logic.
- build: MUST be used when a commit is centered around how the application is built & run.
- refactor: MUST be used for code changes that do not affect functionality but rather focused on robustness, 
  readability, maintainability, extensibility, etc.
- chore: MUST be used for any other type of change.

## Resources

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)
- [GitHub Help](https://help.github.com)
