#!/bin/env bash

JSON_FILE="$1"
JSON_KEY="$2"

sed -E "s/.*${JSON_KEY}\": {0,1}\"([^\"]*)\".*/\1/" "${JSON_FILE}" | xargs -I{} echo -n {}
