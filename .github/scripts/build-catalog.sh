#!/usr/bin/env bash

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd -P)
BASE_DIR=$(cd "${SCRIPT_DIR}/../.." && pwd -P)

DEST_DIR="$1"

if [[ -z "${DEST_DIR}" ]]; then
  DEST_DIR="${BASE_DIR}/dist"
  rm -rf "${DEST_DIR}"
fi

mkdir -p "${DEST_DIR}"

if [[ -z "${TMO_DIR}" ]]; then
  TMP_DIR="${BASE_DIR}/.tmp"
fi

rm -rf "${TMP_DIR}"
mkdir -p "${TMP_DIR}"

yq e '.categories | .[] | .category' "${BASE_DIR}/catalog.yaml" | while read category; do
  echo "*** category: ${category}"

  yq e -o=json "${BASE_DIR}/catalog.yaml" | \
    jq -r --arg CATEGORY "${category}" '.categories | .[] | select(.category == $CATEGORY) | del(.modules)' | \
    yq e --prettyPrint - > "${DEST_DIR}/${category}.full.yaml"
  cp "${DEST_DIR}/${category}.full.yaml" "${DEST_DIR}/${category}.summary.yaml"

  yq e -o=json "${BASE_DIR}/catalog.yaml" | \
    jq -c --arg CATEGORY "${category}" '.categories | .[] | select(.category == $CATEGORY) | .modules | .[]' | \
    while read module; do

    module_name=$(echo "${module}" | jq -r '.name')
    module_display_name=$(echo "${module}" | jq -r --arg NAME "${module_name}" '.displayName // $NAME')
    module_id=$(echo "${module}" | jq -r '.id')
    module_group=$(echo "${module}" | jq -r '.group // empty')
    module_type=$(echo "${module}" | jq -r '.type // "terraform"')
    module_cloud_provider=$(echo "${module}" | jq -r '.cloudProvider // empty')
    module_software_provider=$(echo "${module}" | jq -r '.softwareProvider // empty')
    module_url=$(echo "${module}" | jq -r '.metadataUrl // empty')
    if [[ -z "${module_url}" ]]; then
      module_url=$(echo "${module_id}" | sed -E "s~(.+).com+/([^/]+)/(.*)~https://\2.\1.io/\3/index.yaml~g")
    fi
    module_aliases=$(echo "${module}" | jq -rc '.aliases // [] | .[]' | paste -sd "," -)

    echo "module_url (${module_id}): ${module_url} ${module_aliases}"
    http_status=$(curl -sLI "${module_url}" | grep -E "^HTTP/2" | sed "s~HTTP/2 ~~g")
    if [[ "${http_status}" =~ "200" ]]; then
      type=$(echo "${module_url}" | sed -E "s/.*terraform-([^-]+)-.*/\1/g")
      echo "id: ${module_id}" > "${TMP_DIR}/overlay.yaml"
      echo "group: \"${module_group}\"" >> "${TMP_DIR}/overlay.yaml"
      echo "displayName: \"${module_display_name}\"" >> "${TMP_DIR}/overlay.yaml"
      if [[ -n "${module_aliases}" ]]; then
        echo "aliasIds: [${module_aliases}]" >> "${TMP_DIR}/overlay.yaml"
      fi
      echo "cloudProvider: \"${module_cloud_provider}\"" > "${TMP_DIR}/defaults.yaml"
      echo "softwareProvider: \"${module_software_provider}\"" >> "${TMP_DIR}/defaults.yaml"
      if [[ -z "${module_type}" ]] && [[ "${type}" == "gitops" ]]; then
        module_type="gitops"
      fi
      if [[ -z "${module_cloud_provider}" ]] && [[ "${type}" =~ ^ibm|aws|azure$ ]]; then
        module_cloud_provider="${type}"
      fi
      echo "type: \"${module_type}\"" >> "${TMP_DIR}/defaults.yaml"
      module_metadata=$(curl -sL "${module_url}")
      echo "${module_metadata}" | \
        sed "s~github.com/ibm-garage-cloud~github.com/cloud-native-toolkit~g" |
        yq ea 'select(fileIndex == 0) * select(fileIndex == 1)' - "${TMP_DIR}/overlay.yaml" | \
        yq ea 'select(fileIndex == 0) * select(fileIndex == 1)' "${TMP_DIR}/defaults.yaml" - | \
        yq e '[.]' - | \
        yq e '{"modules": . }' - | \
        yq ea -i 'select(fileIndex == 0) *+ select(fileIndex == 1)' "${DEST_DIR}/${category}.full.yaml" -
      echo "${module_metadata}" | \
        sed "s~github.com/ibm-garage-cloud~github.com/cloud-native-toolkit~g" |
        yq ea 'select(fileIndex == 0) * select(fileIndex == 1)' - "${TMP_DIR}/overlay.yaml" | \
        yq ea 'select(fileIndex == 0) * select(fileIndex == 1)' "${TMP_DIR}/defaults.yaml" - | \
        yq e '.versions = [.versions.[].version]' - | \
        yq e '[.]' - | \
        yq e '{"modules": . }' - | \
        yq ea -i 'select(fileIndex == 0) *+ select(fileIndex == 1)' "${DEST_DIR}/${category}.summary.yaml" -
      rm "${TMP_DIR}/overlay.yaml"
      rm "${TMP_DIR}/defaults.yaml"
    else
      echo "  ** Unable to access module url: ${module_url} - ${http_status}"
    fi
  done
done

rm -f "${DEST_DIR}/index.yaml"

echo "Touching ${DEST_DIR}/index.yaml"
yq eval --null-input '{"categories": []}' > "${DEST_DIR}/index.yaml"

rm -f "${DEST_DIR}/summary.yaml"

echo "Touching ${DEST_DIR}/summary.yaml"
yq eval --null-input '{"categories": []}' > "${DEST_DIR}/summary.yaml"

echo "Merging categories"

ls "${DEST_DIR}"/*.full.yaml | while read category_file; do
  yq e '[.]' "${category_file}" | \
    yq e '{"categories": . }' - | \
    yq ea -i --prettyPrint 'select(fileIndex == 0) *+ select(fileIndex == 1)' "${DEST_DIR}/index.yaml" -
  rm "${category_file}"
done

ls "${DEST_DIR}"/*.summary.yaml | while read category_file; do
  yq e '[.]' "${category_file}" | \
    yq e '{"categories": . }' - | \
    yq ea -i --prettyPrint 'select(fileIndex == 0) *+ select(fileIndex == 1)' "${DEST_DIR}/summary.yaml" -
  rm "${category_file}"
done
