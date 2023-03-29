import { gql } from 'graphql-request'

export const QueryGetTags = gql`
  query GetTags {
    tags {
      id
      text
    }
  }
`
