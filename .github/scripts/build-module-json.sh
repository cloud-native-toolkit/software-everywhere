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
  OUTPUT_FILE="catalog.json"
fi

if [[ -z "${TMP_DIR}" ]]; then
  TMP_DIR="${BASE_DIR}/.tmp"
fi

rm -rf "${TMP_DIR}"
mkdir -p "${TMP_DIR}"

OUTPUT="${DEST_DIR}/${OUTPUT_FILE}"

echo "[]" > "${OUTPUT}"

yq e -o=json '.' "${BASE_DIR}/catalog.yaml" | jq -r '.categories | .[] | .category' | while read category; do
  echo "*** category: ${category}"

  category_config=$(yq e -o=json '.' "${BASE_DIR}/catalog.yaml" | jq -c --arg CATEGORY "${category}" '.categories | .[] | select(.category == $CATEGORY) | del(.modules)')
  category_name=$(echo "${category_config}" | jq -r '.categoryName // .category')

  echo "Creating empty category"
  echo '[]' | \
    jq \
    --arg NAME "${category_name}" \
    --arg CATEGORY "${category}" \
    '{"category": $CATEGORY, "name": $NAME, "modules": .}' > "${DEST_DIR}/${category}.json"

  echo "Reading catalog metadata"
  yq e -o=json '.' "${BASE_DIR}/catalog.yaml" | \
    jq -c --arg CATEGORY "${category}" '.categories | .[] | select(.category == $CATEGORY) | .modules | .[]' | \
    while read module; do

    module_name=$(echo "${module}" | jq -r '.name')
    module_id=$(echo "${module}" | jq -r '.id')
    module_group=$(echo "${module}" | jq --arg NAME "${module_name}" -r '.group // $NAME')
    module_type=$(echo "${module}" | jq -r '.type // "terraform"')
    module_cloud_provider=$(echo "${module}" | jq -r '.cloudProvider // ""')
    module_software_provider=$(echo "${module}" | jq -r '.softwareProvider // ""')

    echo "Read values: $module_name, $module_id, $module_group, $module_type"

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
      echo "Parsing remote metadata: ${module_url}"

      METADATA="$(curl -sL "${module_url}")"
      id=$(echo "${METADATA}" | yq e '.name // ""' -)
      module_type2=$(echo "${METADATA}" | yq e '.type // ""' -)
      cloud_provider=$(echo "${METADATA}" | yq e '.cloudProvider // ""' -)
      if [[ -n "${cloud_provider}" ]]; then
        module_cloud_provider="${cloud_provider}"
      fi
      software_provider=$(echo "${METADATA}" | yq e '.softwareProvider // ""' -)
      if [[ -n "${software_provider}" ]]; then
        module_software_provider="${software_provider}"
      fi
      version_count=$(echo "${METADATA}" | yq e '.versions | length' -)
      if [[ -n "${module_type2}" ]] && [[ "${module_type}" != "null" ]]; then
        module_type="${module_type2}"
      fi
      echo "Parsed values from remote metadata: $id, $module_type2, $module_type"

      if [[ -z "${id}" ]]; then
        echo "Module name is not set. Skipping... ${module_url}"
        continue
      fi

      module_status="released"
      if [[ "${version_count}" -eq 0 ]]; then
        module_status="pending"
      fi
    fi

    jq --arg NAME "${module_name}" \
      --arg ID "${id}" \
      --arg GROUP "${module_group}" \
      --arg TYPE "${module_type}" \
      --arg LOCATION "${module_location}" \
      --arg RELEASE "${module_release}" \
      --arg BUILD "${module_build}" \
      --arg STATUS "${module_status}" \
      --arg CLOUD "${module_cloud_provider}" \
      --arg SOFTWARE "${module_software_provider}" \
      '.modules += [{"name": $NAME, "id": $ID, "group": $GROUP, "type": $TYPE, "location": $LOCATION, "release": $RELEASE, "build": $BUILD, "status": $STATUS, cloudProvider: $CLOUD softwareProvider: $SOFTWARE}]' \
      "${DEST_DIR}/${category}.json" > "${DEST_DIR}/${category}.json.tmp"
    cp "${DEST_DIR}/${category}.json.tmp" "${DEST_DIR}/${category}.json" && rm "${DEST_DIR}/${category}.json.tmp"
  done

  cat "${DEST_DIR}/${category}.json" | jq '[.]' | jq -s '.[0] + .[1]' "${OUTPUT}" - > "${OUTPUT}.tmp"
  cp "${OUTPUT}.tmp" "${OUTPUT}" && rm "${OUTPUT}.tmp"
  #rm "${DEST_DIR}/${category}.json"
done
