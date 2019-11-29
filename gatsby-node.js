const path = require(`path`)

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions
  // name,
  // 	description,
  // 	dimensions,
  // 	units,
  // 	price
  const typeDefs = [
    schema.buildObjectType({
      name: "Product",
      fields: {
        sku: "String",
        name: "String!",
        description: "String",
        dimensions: "[Dimension]",
        units: "[Unit]",
        price: "Int",
      },
      interfaces: ["Node"],
      extensions: {
        infer: true,
      },
    }),
    schema.buildObjectType({
      name: "Dimension",
      fields: {
        key: "String!",
        value: "Int!",
      },
    }),
    schema.buildObjectType({
      name: "Unit",
      fields: {
        name: "String!",
        isBase: "Boolean",
        factor: "Int!",
      },
    }),
  ]
  createTypes(typeDefs)
}

exports.sourceNodes = ({
  actions,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  const { createNode } = actions

  const products = generateProducts(25000)

  activity = reporter.activityTimer(`Sourcing product nodes`)
  activity.start()
  products.forEach(product => {
    createNode({
      ...product,
      id: createNodeId(`product-${product.sku}`),
      parent: null,
      children: [],
      internal: {
        type: "Product",
        contentDigest: createContentDigest(JSON.stringify(product)),
      },
    })
  })
  activity.end()
  return
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const productPageTemplate = path.resolve(`src/templates/product-page.js`)

  const {
    data: { allProduct },
  } = await graphql(`
    query allProductsQuery {
      allProduct {
        edges {
          node {
            sku
            price
            name
            units {
              factor
              isBase
              name
            }
            dimensions {
              key
              value
            }
            description
          }
        }
      }
    }
  `)

  allProduct.edges.forEach(({ node: product }) => {
    const { sku, ...context } = product
    createPage({
      path: `product/${product.sku}`,
      component: productPageTemplate,
      context,
    })
  })
}
function generateProduct(sku) {
  return {
    sku: `${sku}`,
    name: `product-${sku}`,
    description: `product-${sku} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu purus vitae neque cursus consequat a id massa. Curabitur faucibus ultrices condimentum. Pellentesque condimentum, lectus ac cursus euismod, risus elit interdum nulla, sit amet sollicitudin est lacus quis leo. Maecenas scelerisque bibendum accumsan. Vivamus leo tellus, aliquet nec porttitor ullamcorper, luctus et lorem. Praesent et leo porttitor, vestibulum erat sed, fermentum mauris. Mauris id purus iaculis, pretium eros vitae, volutpat justo. Nullam volutpat, leo at molestie auctor, lectus arcu facilisis turpis, in porttitor sem metus sed nulla. In facilisis eros nulla, eu vestibulum felis congue interdum. Cras luctus metus at tellus eleifend, et blandit velit tincidunt`,
    dimensions: [
      { key: "length", value: (Math.random() * 100).toFixed(0) },
      { key: "width", value: (Math.random() * 100).toFixed(0) },
      { key: "height", value: (Math.random() * 100).toFixed(0) },
    ],
    units: [
      { name: "base unit", isBase: true, factor: 1 },
      { name: "10 units", isBase: false, factor: 10 },
      { name: "100 units", isBase: false, factor: 100 },
      { name: "1000 units", isBase: false, factor: 1000 },
    ],
    price: (Math.random() * 1000).toFixed(0),
  }
}

function generateProducts(numberOfProducts) {
  return Array.from({ length: numberOfProducts }, (_, i) => generateProduct(i))
}
