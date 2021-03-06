import gql from "graphql-tag";

import { TypedQuery } from "../../core/queries";
import {
  basicProductFragment,
  productPricingFragment,
} from "../Product/queries";
import { Collection, CollectionVariables } from "./gqlTypes/Collection";
import {
  CollectionProducts,
  CollectionProductsVariables,
} from "./gqlTypes/CollectionProducts";

export const collectionProductsDataQuery = gql`
  query Collection($id: ID!, $channel: String!) {
    collection(id: $id, channel: $channel) {
      id
      slug
      name
      seoDescription
      seoTitle
      backgroundImage {
        url
      }
    }
    attributes(
      filter: {
        channel: $channel
        inCollection: $id
        filterableInStorefront: true
      }
      first: 100
    ) {
      edges {
        node {
          id
          name
          slug
          values {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

export const TypedCollectionProductsDataQuery = TypedQuery<
  Collection,
  CollectionVariables
>(collectionProductsDataQuery);

export const collectionProductsQuery = gql`
  ${basicProductFragment}
  ${productPricingFragment}
  query CollectionProducts(
    $id: ID!
    $attributes: [AttributeInput]
    $after: String
    $pageSize: Int
    $sortBy: ProductOrder
    $priceLte: Float
    $priceGte: Float
    $channel: String!
  ) {
    collection(id: $id, channel: $channel) {
      id
      products(
        after: $after
        first: $pageSize
        sortBy: $sortBy
        filter: {
          channel: $channel
          attributes: $attributes
          minimalPrice: { gte: $priceGte, lte: $priceLte }
        }
      ) {
        totalCount
        edges {
          node {
            ...BasicProductFields
            ...ProductPricingField
            category {
              id
              name
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

export const TypedCollectionProductsQuery = TypedQuery<
  CollectionProducts,
  CollectionProductsVariables
>(collectionProductsQuery);
