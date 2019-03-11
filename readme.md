[![Build status for master](https://ci.appveyor.com/api/projects/status/r6g4h1214qyve47j/branch/master?svg=true)](https://ci.appveyor.com/project/wolfie/abracadabra/branch/master)

# How to build

Things you'll need to develop and test abracadabra:

- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/en/docs/install)

Clone the repository and then at the root of your local copy install the dependencies with yarn:

    yarn

Now everything should be good to go.

You can execute tests with the command

    yarn test

and run a local web server serving the application with the command

    yarn start

While the server is running the application is available at `http://localhost:8080/`.
