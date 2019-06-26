

# Shell script for running operations within a clean isolated docker container (ie for tests)
case "$1" in
  tests)
    docker run -it --rm -w "/src/" -v "$PWD:/src" node:10.14-slim npm install && npm run test
    ;;
  bash)
    docker run -it --rm -w "/src/" -v "$PWD:/src" node:10.14-slim bash
    ;;
  *)
    echo $"Usage: $0 {tests|bash}"
    exit 1

esac
