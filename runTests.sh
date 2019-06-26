

# Shell script for running tests within a clean isolated Docker container
docker run -it --rm -w "/src/" \
-v "$PWD:/src" \
node:10.14-slim \
npm install && npm run test