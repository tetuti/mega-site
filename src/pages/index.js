import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"

const IndexPage = () => {
  const randomSku = (Math.random() * 25000).toFixed(0)

  return (
    <Layout>
      <Link to={`/product/${randomSku}`}>Go to product {randomSku}</Link>
    </Layout>
  )
}

export default IndexPage
