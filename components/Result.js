import React from 'react'
import {Highlight} from 'react-instantsearch/dom';
import m from 'moment'
import {Link} from '../router'

class Result extends React.Component {
  state = {
    qualityScore: 0,
    popularityScore: 0,
    maintenanceScore: 0,
    overallScore: 0,
    npmUrl: '',
    homepageUrl: '',
    repositoryUrl: '',
    bugsUrl: '',
    lastUpdatedAt: '',
    tags: [],
    authorUserName: '',
    authorImage: '',
    authorUrl: ''
  }

  getData() {
    return this.props.hit
  }

  setQualityScore() {
    this.setState({
      qualityScore: Math.floor(this.getData().score_quality * 100)
    })
  }

  setPopularityScore() {
    this.setState({
      popularityScore: Math.floor(this.getData().score_popularity * 100)
    })
  }

  setMaintainanceScore() {
    this.setState({
      maintenanceScore: Math.floor(this.getData().score_maintenance * 100)
    })
  }
  setOverallScore() {
    this.setState({
      overallScore: Math.floor(this.getData().final_score * 100)
    })
  }
  setNPMUrl() {
    this.setState({npmUrl: this.getData().npm_url})
  }
  setHomepageUrl() {
    this.setState({homepageUrl: this.getData().homepage})
  }
  setRepositoryUrl() {
    this.setState({
      repositoryUrl: this.getData().repository
    }, this.setAuthorImage)
  }

  setBugsUrl() {
    this.setState({bugsUrl: this.getData().bugs})
  }
  setLastUpdated() {
    this.setState({
      lastUpdatedAt: m(this.getData().project_last_updated).fromNow()
    })
  }
  setTags() {
    this.setState({
      tags: this.getData().keywords.slice(0, 10).filter(r => {
        return (r !== '')
      })
    })
  }
  setAuthorUsername() {
    this.setState({authorUserName: this.getData().author_username})
  }
  setAuthorImage() {
    let repoUrl = this.state.repositoryUrl
    let sliced = repoUrl.split('/')
    let repoName = sliced[sliced.length - 2]
    this.setState({
      authorImage: 'https://github.com/' + repoName + '.png?size=30'
    })
  }
  setAuthorUrl() {
    this.setState({
      authorUrl: 'https://npmjs.com/~' + this.state.authorUsername
    })
  }

  componentDidMount() {
    this.setQualityScore()
    this.setPopularityScore()
    this.setMaintainanceScore()
    this.setOverallScore()
    this.setAuthorImage()
    this.setRepositoryUrl()
    this.setRepositoryUrl()
    this.setNPMUrl()
    this.setHomepageUrl()
    this.setBugsUrl()
    this.setLastUpdated()
    this.setTags()
    this.setAuthorUsername()
    this.setAuthorUrl()
  }

  render() {
    let hit = this.props.hit;
    return (<div className="post-module hover">
      <div className="thumbnail">
        <div className="category">v{`${hit.version}`}</div>
        <div className="date">
          Last Updated: {`${this.state.lastUpdatedAt}`}
        </div>
        <h1 className="title">
          <img src={`${this.state.authorImage}`} alt=""/>
          <Link route={`/${this.state.authorUserName}/${hit.name}`}>
            <a>{`${hit.name}`}</a>
          </Link>
        </h1>
        <div className="repository-score-content d-none d-sm-none d-md-block">
          <ul>
            <li>
              <div className="digits">{`${this.state.qualityScore}`}</div>
              Quality
            </li>
            <li>
              <div className="digits">{`${this.state.popularityScore}`}</div>
              Popularity
            </li>
            <li>
              <div className="digits">{`${this.state.maintenanceScore}`}</div>
              Maintenance
            </li>
            <li>
              <div className="digits">{`${this.state.overallScore}`}</div>
              Overall
            </li>
          </ul>
          <div className="clear"></div>
        </div>
      </div>
      <div className="post-content">
        <div className="repository-links-content">
          <ul>
            <li>
              <a href={`${this.state.repositoryUrl}`} target="_blank">
                <i className="fab fa-github-alt"></i>
              </a>
            </li>
            <li>
              <a href={`${this.state.npmUrl}`} target="_blank">
                <i className="fab fa-npm"></i>
              </a>
            </li>
            <li>
              <a href={`${this.state.bugsUrl}`} target="_blank">
                <i className="fa fa-bug"></i>
              </a>
            </li>
            <li>
              <a href={`${this.state.homepageUrl}`} target="_blank">
                <i className="fa fa-link"></i>
              </a>
            </li>
          </ul>
          <div className="clear"></div>
        </div>
        <p className="description">{`${hit.description}`}</p>
        <ul className="tags clearfix">
          {
            this.state.tags.map((tag, index) => {
              return <li key={index}>
                <a href="#">{`${tag}`}</a>
              </li>
            })
          }
        </ul>
        <div className="post-meta">
          <span className="comments">
            <i className="fa fa-user"></i>
            <a href="authorUrl" target="_blank">&nbsp;{`${this.state.authorUserName}`}</a>
          </span>
        </div>
      </div>
    </div>);
  }
}

export default Result
