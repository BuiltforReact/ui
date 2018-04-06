import Link from 'next/link'
import Layout from '../components/Layout'
import {InstantSearch, Hits, SearchBox} from 'react-instantsearch/dom';
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
            </div>
          </div>
        </section>
        <div className="container result-container">
          <Hits hitComponent={Result}></Hits>
        </div>
      </main>
    </InstantSearch>
  </Layout>)
}

export default Index
