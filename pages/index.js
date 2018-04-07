import Link from 'next/link'
import Layout from '../components/Layout'
import {InstantSearch, Hits, SearchBox, Pagination, PoweredBy} from 'react-instantsearch/dom';
import Result from '../components/Result'
function Index() {
  return (<Layout>
    <InstantSearch appId="O3D6FXC3ZH" apiKey="457b194f8671a2885cfc7c3c58910d4b" indexName="projects_index">
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
          <Hits hitComponent={Result}></Hits>
        </div>
        <div className="container mt-5">
          <Pagination showFirst={true} showLast={true} showPrevious={true} showNext={true} padding={2}></Pagination>
        </div>
      </main>
    </InstantSearch>
  </Layout>)
}

export default Index
