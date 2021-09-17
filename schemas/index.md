# Automation module metadata JSON schemas

There are two major schemas (with a number of sub-types) that define the automation module metadata:

- Module
- Catalog

## Schemas

### Module

The module schema defines the metadata for an individual module. It contains a `name` and `id` to identify the module and a `versions` array that contains the versioned interface for the module.

[Module schema](module.json)

### Catalog

The catalog schema defines the collection of module metadata, organized into categories.

[Catalog schema](catalog.json)

## Usage

The schemas are used to validate the module metadata and the catalog metadata during the module and catalog CI/CD process.

### Manual validation

The YAML catalog can be manually validated against the schema using the `ajv-cli`.

```
npm i ajv-cli
curl -LsO https://modules.cloudnativetoolkit.dev/schemas/catalog.json
npx ajv validate -s catalog.json -d index.yaml
```
