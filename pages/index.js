import Link from 'next/link'
import Layout from '../components/Layout'
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  PoweredBy,
  ScrollTo
} from 'react-instantsearch/dom';
import Result from '../components/Result'
import React from 'react'

class Index extends React.Component {

  state = {
    appId: '',
    apiKey: '',
    indexName: ''
  }
  
  render() {
    return (<Layout>
      <InstantSearch appId={`${process.env.APP_ID}`} apiKey={`${process.env.API_KEY}`} indexName={`${process.env.INDEX_NAME}`}>
        <main role="main">
          <section className="jumbotron text-center">
            <div className="container search-container">
              <div className="form-group mx-sm-8">
                <h1 className="title">
                  Search for a React Package</h1>
                {/* <input type="text" className="form-control"/> */}
                <SearchBox></SearchBox>
                <div style={{
                    marginTop: '10px',
                    float: 'right'
                  }}>
                  <PoweredBy className="justify-content-right"></PoweredBy>
                </div>
              </div>
            </div>
          </section>
          <div className="container result-container">
            <ScrollTo>
              <Hits hitComponent={Result}></Hits>
            </ScrollTo>
          </div>
          <div className="container mt-5">
            <Pagination showFirst={true} showLast={true} showPrevious={true} showNext={true} padding={2}></Pagination>
          </div>
        </main>
      </InstantSearch>
    </Layout>)
  }
}

export default Index
