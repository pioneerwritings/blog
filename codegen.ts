import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema:
    'https://us-east-1-shared-usea1-02.cdn.hygraph.com/content/clfhm6epa081401uieut6fwv8/master',
  generates: {
    'app/types/codegen.ts': {
      plugins: ['typescript'],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
}

export default config
