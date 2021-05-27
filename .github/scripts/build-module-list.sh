#!/usr/bin/env bash

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd -P)
BASE_DIR=$(cd "${SCRIPT_DIR}/../.." && pwd -P)

DEST_DIR="$1"
OUTPUT_FILE="$2"

if [[ -z "${DEST_DIR}" ]]; then
  DEST_DIR="${BASE_DIR}/dist"
  rm -rf "${DEST_DIR}"
fi

mkdir -p "${DEST_DIR}"

if [[ -z "${OUTPUT_FILE}" ]]; then
  OUTPUT_FILE="MODULES.md"
fi

if [[ -z "${TMP_DIR}" ]]; then
  TMP_DIR="${BASE_DIR}/.tmp"
fi

rm -rf "${TMP_DIR}"
mkdir -p "${TMP_DIR}"

OUTPUT="${DEST_DIR}/${OUTPUT_FILE}"

echo "# Automation modules" > "${OUTPUT}"

echo "The Cloud-Native Toolkit provides a library of modules that can be used to automate the provisioning of an environment. These modules have been organized into categories for readability. Any of the modules can be added directly in a terraform template to apply the behavior." >> "${OUTPUT}"
echo "A yaml version of the catalog can be found [here](./index.yaml)" >> "${OUTPUT}"

echo "## Module catalog" >> "${OUTPUT}"

yq r -j "${BASE_DIR}/catalog.yaml" | jq -r '.categories | .[] | .category' | while read category; do
  echo "*** category: ${category}"

  category_config=$(yq r -j "${BASE_DIR}/catalog.yaml" | jq -c --arg CATEGORY "${category}" '.categories | .[] | select(.category == $CATEGORY) | del(.modules)')
  category_name=$(echo "${category_config}" | jq -r '.categoryName // .category')

  echo "### ${category_name}" >> "${OUTPUT}"
  echo "" >> "${OUTPUT}"
  echo "| **Module name** | **Catalog id** | **Module type** | **Module location** | **Latest release** | **Last build status** |" >> "${OUTPUT}"
  echo "|-----------------|----------------|-----------------|---------------------|--------------------|-----------------------|" >> "${OUTPUT}"

  yq r -j "${BASE_DIR}/catalog.yaml" | \
    jq -c --arg CATEGORY "${category}" '.categories | .[] | select(.category == $CATEGORY) | .modules | .[]' | \
    while read module; do

    module_name=$(echo "${module}" | jq -r '.name')
    module_id=$(echo "${module}" | jq -r '.id')
    module_type=$(echo "${module}" | jq -r '.type')
    if [[ -z "${module_type}" ]]; then
      module_type="terraform"
    fi

    module_slug=$(echo "${module_id}" | sed -E "s~[^/]+/(.+)~\1~g")
    module_url=$(echo "${module}" | jq -r '.metadataUrl // empty')
    if [[ -z "${module_url}" ]]; then
      module_url=$(echo "${module_id}" | sed -E "s~(.+).com+/([^/]+)/(.*)~https://\2.\1.io/\3/index.yaml~g")
    fi

    module_location="https://${module_id}"
    module_release="https://img.shields.io/github/v/release/${module_slug}?sort=semver"
    module_build="${module_location}/workflows/Verify%20and%20release%20module/badge.svg"

    id=""
    http_status=$(curl -sLI "${module_url}" | grep -E "^HTTP/2" | sed "s~HTTP/2 ~~g")
    if [[ "${http_status}" =~ "200" ]]; then
      id=$(curl -sL "${module_url}" | yq r - 'name')
    fi

    echo "| *${module_name}* | ${id} | ${module_type} | ${module_location} | ![Latest release](${module_release}) | ![Verify and release module](${module_build}) |" >> "${OUTPUT}"
  done

  echo "" >> "${OUTPUT}"
done
