import React from 'react'
import Head from 'next/head'
import Header from './header'
import Footer from './footer'

class Layout extends React.Component {
  render() {
    return (<div id="layout">
      <Head>
        <title>BuiltForReact</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"/>
        <link href="https://fonts.googleapis.com/css?family=Poppins" rel="stylesheet"/>
        <style type="text/css">
          @import url(/static/css/style.css)
        </style>
        <script defer src="https://use.fontawesome.com/releases/v5.0.9/js/all.js" integrity="sha384-8iPTk2s/jMVj81dnzb/iFR2sdA7u06vHJyyLlAd4snFpCl/SnyUjRrbdJsw1pGIl" crossorigin="anonymous"></script>
      </Head>

      <Header/> {this.props.children}
      <Footer/>
      <script src="https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js"></script>
    </div>)
  }
}
export default Layout
