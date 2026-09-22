#!/bin/bash
set -e

umask 0022

# usage: file_env VAR [DEFAULT]
#    ie: file_env 'XYZ_DB_PASSWORD' 'example'
#  (will allow for "$XYZ_DB_PASSWORD_FILE" to fill in the value of
#   "$XYZ_DB_PASSWORD" from a file, especially for Docker's secrets feature)
function file_env() {
  local var="$1"
  local fileVar="${var}_FILE"
  local def="${2:-}"
  if [ "${!var:-}" ] && [ "${!fileVar:-}" ]; then
    echo >&2 "error: both $var and $fileVar are set (but are exclusive)"
    exit 1
  fi
  local val="$def"
  if [ "${!var:-}" ]; then
    val="${!var}"
  elif [ "${!fileVar:-}" ]; then
    val="$(< "${!fileVar}")"
  fi
  export "$var"="$val"
  unset "$fileVar"
}

# envs=(
#   XYZ_API_TOKEN
# )
# haveConfig=
# for e in "${envs[@]}"; do
#   file_env "$e"
#   if [ -z "$haveConfig" ] && [ -n "${!e}" ]; then
#     haveConfig=1
#   fi
# done

# return true if specified directory is empty
function directory_empty() {
  [ -n "$(find "${1}"/ -prune -empty)" ]
}

function random_token() {
  tr -cd '[:alnum:]' </dev/urandom | fold -w32 | head -n1
}

# inspired by https://www.rfc-editor.org/rfc/rfc3986#appendix-B
# //URL prefix required. Not for IPv6 ([2001:db8::7]) addresses.
readonly URI_REGEX='^(([^:/?#]+):)?(//((([^:/?#]+)@)?([^:/?#]+)(:([0-9]+))?))?(/([^?#]*))?(\?([^#]*))?(#(.*))?'
protFromURL () {
    [[ "$@" =~ $URI_REGEX ]] && echo "${BASH_REMATCH[2],,}"
}
hostFromURL () {
    [[ "$@" =~ $URI_REGEX ]] && echo "${BASH_REMATCH[7],,}"
}
portFromURL () {
    if [[ "$@" =~ $URI_REGEX ]]; then
      if [[ -z "${BASH_REMATCH[9]}" ]]; then
        case "${BASH_REMATCH[2],,}" in
          # some default ports...
          http)  echo "80" ;;
          https) echo "443" ;;
          ldap)  echo "389" ;;
          ldaps) echo "636" ;;
        esac
      else
        echo "${BASH_REMATCH[9]}"
      fi
    fi
}

SERVICE_TIMEOUT=${SERVICE_TIMEOUT:-300s} # wait for dependencies

echo Running: "$@"

export BASE_URL=${BASE_URL:-"http://localhost:3000"}
export API_URL=${API_URL:-${BASE_URL}"/api"}
export MOCK_URL=${MOCK_URL:-${BASE_URL}"/mock"}
export AUTH_URL=${AUTH_URL:-${BASE_URL}"/auth/.well-known/openid-configuration"}
export CLIENT_ID=${CLIENT_ID:-"dns3l-app"}
export DAEMON_CLIENT_ID=${DAEMON_CLIENT_ID:-"dns3ld"} # https://github.com/dns3l/dns3l-core/issues/59

# Nuxt 4 liest die Runtime-Config nur aus NUXT_PUBLIC_* -> bestehende Variablen übersetzen
export NUXT_PUBLIC_BASE_URL=${BASE_URL}
export NUXT_PUBLIC_API_URL=${API_URL}
export NUXT_PUBLIC_MOCK_URL=${MOCK_URL}
export NUXT_PUBLIC_AUTH_URL=${AUTH_URL}
export NUXT_PUBLIC_CLIENT_ID=${CLIENT_ID}
export NUXT_PUBLIC_DAEMON_CLIENT_ID=${DAEMON_CLIENT_ID}
if [[ -n "${VERSION:-}" ]]; then export NUXT_PUBLIC_APP_VERSION=${VERSION}; fi

# Avoid destroying bootstrapping by simple start/stop
if [[ ! -e ${DNS3LPATH}/.bootstrapped ]]; then
  ### list none idempotent code blocks, here...

  touch ${DNS3LPATH}/.bootstrapped
fi

if [ -r /etc/nuxt.config.js -a -s /etc/nuxt.config.js ]; then
  ln -fs /etc/nuxt.config.js ${DNS3LPATH}/nuxt.config.js
else
  : # nop
  # /dckrz -template ${DNS3LPATH}/nuxt.config.tmpl:${DNS3LPATH}/nuxt.config.js
fi

yarn build

if [[ `basename ${1}` == "yarn" ]]; then # prod
    exec "$@" </dev/null #>/dev/null 2>&1
else # dev
    yarn start 2>&1 &
fi

# fallthrough...
exec "$@"
