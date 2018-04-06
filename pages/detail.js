import React from 'react'
import r from 'axios'
import m from 'moment'
import n from 'numeral'
import Layout from '../components/Layout'
import Markdown from 'react-markdown'
import {Line} from 'react-chartjs-2'

class Detail extends React.Component {
  state = {
    author: '',
    repo: '',
    version: '0.0.0',
    statsPeriod: 'month',
    versions: [],
    npmInfo: null,
    files: null,
    packageStats: null,
    packageVersionStats: null,
    versionStats: {},
    githubData: null,
    markdown: {
      breaks: true,
      toc: false,
      anchorAttrs: {}
    },
    chartOptions: {
      width: 100,
      height: 20,
      className: 'chart-container',
      options: {
        showAllTooltips: false,
        title: {
          display: false
        },
        tooltips: {
          intersect: false,
          mode: 'nearest',
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10,
          backgroundColor: 'transparent',
          bodyFontFamily: 'Poppins'
        },
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: true,
        hover: {
          mode: 'index'
        },
        scales: {
          xAxes: [
            {
              display: false,
              gridLines: false,
              scaleLabel: {
                display: true,
                labelString: 'Month'
              }
            }
          ],
          yAxes: [
            {
              display: false,
              gridLines: false,
              scaleLabel: {
                display: true,
                labelString: 'Value'
              },
              ticks: {
                beginAtZero: true
              }
            }
          ]
        },
        elements: {
          line: {
            tension: 0.19
          },
          point: {
            radius: 4,
            borderWidth: 12
          }
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 5,
            bottom: 0
          }
        }
      }
    },
    jsDelivrURL: '',
    repoLink: '',
    githubData: null,
    defaultBranch: '',
    forksCount: 0,
    watchersCount: 0,
    stargazersCount: 0,
    subscribersCount: 0,
    npmDownloadsCount: 0,
    jsDelivrHitsCount: 0,
    repoScore: null,
    tags: [],
    qualityScore: 0,
    maintenanceScore: 0,
    popularityScore: 0,
    overallScore: 0,
    description: '',
    license: '',
    npmScoreBadge: '',
    lastUpdatedAt: '',
    repoUrl: '',
    bugsUrl: '',
    npmUrl: '',
    homepageUrl: '',
    defaultFile: '',
    readme: '',
    repoFullName: '',
    authorImage: '',
    defaultFile: '',
    jumbotronChartData: {
      labels: [],
      datasets: []
    }
  }

  getQueryString() {
    return this.props.url.query
  }

  componentDidMount() {
    this.setState({
      author: this.getQueryString().author,
      repo: this.getQueryString().repo
    }, () => {
      this.getRepoData()
    })

  }

  getRepoData() {
    this.fetchNPMData()

    this.fetchVersionsInfo()
    this.fetchStatsInfo()
    this.fetchVersionStatsInfo()
  }

  getMetaData() {
    if (this.state.npmInfo) {
      return this.state.npmInfo.collected.metadata
    }
  }

  getVersion() {
    if (this.state.npmInfo)
      return this.getMetaData().version
  }

  fetchNPMData() {
    let self = this;
    r.get(`https://api.npms.io/v2/package/${this.state.repo}`).then(res => {
      let data = res.data
      self.setState({
        npmInfo: data
      }, () => {
        self.setState({
          version: self.getMetaData().version
        }, () => {
          self.fetchFilesInfo(this.state.version)
          self.fetchUsageInfoByVersion(this.state.version)
          self.setDescription()
        })
        self.setRepoLink()
        self.setNPMDownloadsCount()
        self.setRepoScore()
        self.setTags()
        self.setQualityScore()
        self.setMaintenanceScore()
        self.setPopularityScore()
        self.setOverallScore()
        self.setLicense()
        self.setNPMScore()
        self.setLastUpdated()
        self.setRepoURL()
        self.setBugsLink()
        self.setNPMLink()
        self.setHomepageLink()
      })
    })
  }

  fetchVersionsInfo() {
    let self = this
    r.get(`https://data.jsdelivr.com/v1/package/npm/${this.state.repo}`).then(res => {
      self.setState({versions: res.data})
    })
  }

  fetchFilesInfo(version) {
    let self = this
    r.get(`https://data.jsdelivr.com/v1/package/npm/${this.state.repo}@${version}`).then(res => {
      self.setState({
        files: res.data
      }, () => {
        this.setDefaultFile()
      })
    })
  }

  fetchStatsInfo() {
    let self = this
    r.get(`https://data.jsdelivr.com/v1/package/npm/${this.state.repo}/stats/date`).then(res => {
      self.setState({
        packageStats: res.data
      }, () => {
        self.setJSDelivrDownloadsCount()
        self.setJumbotronChartData()
      })
    })
  }

  fetchVersionStatsInfo() {
    let self = this
    r.get(`https://data.jsdelivr.com/v1/package/npm/${this.state.repo}/stats/version/month`).then(res => {
      self.setState({packageVersionStats: res.data})
    })
  }

  fetchUsageInfoByVersion(version) {
    let self = this
    r.get(`https://data.jsdelivr.com/v1/package/npm/${this.state.repo}@${version}/stats`).then(res => {
      self.setState({versionStats: res.data})
    })
  }

  setRepoLink() {
    if (this.state.npmInfo) {
      if (this.state.repoLink === "")
        this.setState({
          repoLink: this.getMetaData().links.repository
        }, () => {
          this.fetchGithubRepoInfo()
        })
    }
  }

  fetchGithubRepoInfo() {
    let repoLink = this.state.repoLink.replace('https://github.com/', '')
    r.get(`https://api.github.com/repos/${repoLink}`).then(res => {
      this.setState({
        githubData: res.data
      }, () => {
        this.setDefaultBranch()
        this.setForksCount()
        this.setStargazersCount()
        this.setWatchersCount()
        this.setSubscribersCount()
        this.setRepoFullName()
        this.setReadMe()
        // this.fixAnchorTags()
      })
    })
  }

  setDefaultBranch() {
    if (this.state.githubData) {
      this.setState({defaultBranch: this.state.githubData.default_branch})
    }
  }

  setForksCount() {
    if (this.state.githubData) {
      this.setState({forksCount: this.state.githubData.forks_count})
    }
  }

  setWatchersCount() {
    if (this.state.githubData) {
      this.setState({watchersCount: this.state.githubData.watchers_count})
    }
  }

  setStargazersCount() {
    if (this.state.githubData) {
      this.setState({stargazersCount: this.state.githubData.stargazers_count})
    }
  }

  setSubscribersCount() {
    if (this.state.githubData) {
      this.setState({subscribersCount: this.state.githubData.subscribers_count})
    }
  }

  setNPMDownloadsCount() {
    if (this.state.npmInfo) {
      let count = 0
      this.state.npmInfo.collected.npm.downloads.forEach(download => {
        count += download.count
      })

      if (count > 10000000) {
        this.setState({npmDownloadsCount: n(count).format('0,0.00a')})
      } else {
        this.setState({npmDownloadsCount: n(count).format('0,0')})
      }
    }
  }

  setJSDelivrDownloadsCount() {
    if (this.state.packageStats) {
      if (this.state.packageStats.total > 10000000) {
        this.setState({
          jsDelivrHitsCount: n(this.state.packageStats.total).format('0,0.00a')
        })
      } else {
        this.setState({
          jsDelivrHitsCount: n(this.state.packageStats.total).format('0,0')
        })
      }
    }
  }

  setRepoScore() {
    if (this.state.npmInfo) {
      this.setState({
        repoScore: this.state.npmInfo.score
      }, () => {
        this.setQualityScore()
        this.setMaintenanceScore()
        this.setPopularityScore()
        this.setOverallScore()
      })
    }
  }

  setTags() {
    if (this.state.npmInfo) {
      if (this.getMetaData().keywords) {
        this.setState({
          tags: this.getMetaData().keywords.slice(0, 10).filter(r => {
            return (r !== '')
          })
        })
      }
    }
  }

  setDescription() {
    if (this.state.npmInfo) {
      this.setState({description: this.getMetaData().description})
    }
  }

  setQualityScore() {
    if (this.state.repoScore) {
      this.setState({
        qualityScore: Math.ceil(this.state.repoScore.detail.quality * 100)
      })
    }
  }

  setMaintenanceScore() {
    if (this.state.repoScore) {
      this.setState({
        maintenanceScore: Math.ceil(this.state.repoScore.detail.maintenance * 100)
      })
    }
  }

  setPopularityScore() {
    if (this.state.repoScore) {
      this.setState({
        popularityScore: Math.ceil(this.state.repoScore.detail.popularity * 100)
      })
    }
  }

  setOverallScore() {
    if (this.state.repoScore) {
      this.setState({
        overallScore: Math.ceil(this.state.repoScore.final * 100)
      })
    }
  }

  setLicense() {
    if (this.state.npmInfo) {
      this.setState({license: this.getMetaData().license})
    }
  }

  setNPMScore() {
    this.setState({npmScoreBadge: `https://badges.npms.io/${this.repo}.svg?style=flat-square`})
  }

  setLastUpdated() {
    if (this.state.npmInfo) {
      this.setState({
        lastUpdatedAt: m(this.getMetaData().date).fromNow()
      })
    }
  }

  setRepoURL() {
    if (this.state.npmInfo) {
      this.setState({
        repoUrl: this.getMetaData().links.repository
      }, this.setAuthorImage)
    }
  }

  setBugsLink() {
    if (this.state.npmInfo) {
      this.setState({bugsUrl: this.getMetaData().links.bugs})
    }
  }

  setNPMLink() {
    if (this.state.npmInfo) {
      this.setState({npmUrl: this.getMetaData().links.npm})
    }
  }

  setHomepageLink() {
    if (this.state.npmInfo) {
      this.setState({homepageUrl: this.getMetaData().links.homepage})
    }
  }

  setDefaultFile() {
    if (this.state.files) {
      this.setState({defaultFile: this.state.files.default})
    }
  }

  setReadMe() {
    if (this.state.githubData) {
      let repoLink = this.state.repoLink.replace('https://github.com/', '')
      r.get(`https://api.github.com/repos/${repoLink}/readme`).then(res => {
        let data = res.data
        this.setState({
          readme: atob(data.content)
        })
      })

    }
  }

  setRepoFullName() {
    if (this.state.githubData) {
      this.setState({repoFullName: this.state.githubData.full_name})
    }
  }

  setAuthorImage() {
    let repoUrl = this.state.repoUrl
    let sliced = repoUrl.split('/')
    let repoName = sliced[sliced.length - 2]
    this.setState({
      authorImage: 'https://github.com/' + repoName + '.png?size=30'
    })
  }

  setJumbotronChartData() {
    if (this.state.packageStats) {
      let collection = {
        labels: [],
        datasets: []
      }
      let stats = this.state.packageStats.dates
      let keys = Object.keys(stats)
      let data = []

      for (let key of keys) {
        collection.labels.push(m(key).format('MMM Do YY'))
        data.push(stats[key].total)
      }

      collection.datasets.push({label: '', data: data})

      this.setState({jumbotronChartData: collection})
    }
  }

  render() {
    // this.props.url.query.slug
    return (<Layout>
      <main role="main" className="repo-detail">
        <div className="row repo-jumbotron">
          <div className="col">
            <div className="repo-badge">
              <img src="" alt=""/>
              <img src="" alt=""/>
            </div>
            <div className="repository-links-content">
              <ul>
                <li>
                  <a href={this.state.repoUrl} target="_blank">
                    <i className="fab fa-github-alt"></i>
                  </a>
                </li>
                <li>
                  <a href={this.state.npmUrl} target="_blank">
                    <i className="fab fa-npm"></i>
                  </a>
                </li>
                <li>
                  <a href={this.state.bugsUrl} target="_blank">
                    <i className="fa fa-bug"></i>
                  </a>
                </li>
                <li>
                  <a href={this.state.homepageUrl} target="_blank">
                    <i className="fa fa-link"></i>
                  </a>
                </li>
              </ul>
              <div className="clear"></div>
            </div>
            <div className="repo-info">
              <img src={this.state.authorImage} alt=""/>
              <span className="repo-name">{`${this.state.repoFullName}`}</span>
            </div>
            <Line data={this.state.jumbotronChartData} options={this.state.chartOptions.options} width={this.state.chartOptions.width} height={this.state.chartOptions.height} className={this.state.chartOptions.className}/>
          </div>
        </div>
        <div className="container detail-container">
          <div className="row">
            <div className="col-md-8">
              <div className="row repo-description">
                <div className="col-md-12">
                  <div className="repo-info">
                    <span className="repo-name">{`${this.state.repoFullName}`}</span>
                    <a href="#" className="badge badge-secondary repo-version-badge ml-2">v{`${this.state.version}`}</a>
                    <a href="#" className="badge badge-info repo-license-badge ml-2">{this.state.license}</a>
                  </div>
                  <div className="repo-description-text">{this.state.description}</div>
                  <ul className="tags clearfix repo-tags">
                    {
                      this.state.tags.map((tag, index) => {
                        return <li key={index}>
                          <a href="#">{`${tag}`}</a>
                        </li>
                      })
                    }
                  </ul>
                </div>
                <div className="row">
                  <div className="col-md-12 mt-3">
                    <div className="info-block">
                      <dl>
                        <dt>{this.state.forksCount}</dt>
                        <dd>Forks</dd>
                      </dl>
                    </div>
                    <div className="info-block">
                      <dl>
                        <dt>{this.state.watchersCount}</dt>
                        <dd>Watchers</dd>
                      </dl>
                    </div>
                    <div className="info-block">
                      <dl>
                        <dt>{this.state.stargazersCount}</dt>
                        <dd>Stargazers</dd>
                      </dl>
                    </div>
                    <div className="info-block">
                      <dl>
                        <dt>{this.state.subscribersCount}</dt>
                        <dd>Subscribers</dd>
                      </dl>
                    </div>
                    <div className="info-block">
                      <dl>
                        <dt>{this.state.lastUpdatedAt}</dt>
                        <dd>Last Update</dd>
                      </dl>
                    </div>
                    <div className="info-block npm-count">
                      <dl>
                        <dt>{this.state.npmDownloadsCount}</dt>
                        <dd>NPM Downloads Count</dd>
                      </dl>
                    </div>
                    <div className="info-block js-delivr">
                      <dl>
                        <dt>{this.state.jsDelivrHitsCount}</dt>
                        <dd>jsDelivr Hits</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" id="readme-tab" data-toggle="tab" href="#readme" role="tab" aria-controls="readme" aria-selected="true">Read me</a>
                </li>
              </ul>
              <div className="tab-content repo-detail-info">
                <div className="tab-pane fade show active readme" id="readme" role="tabpanel" aria-labelledby="home-tab">
                  <Markdown className="result" source={this.state.readme}/>
                </div>
                <div className="tab-pane fade" id="files" role="tabpanel" aria-labelledby="profile-tab">...</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="legend">install</h3>
                  <h5>npm</h5>
                  <div className="alert alert-dark install-content" role="alert">
                    <i className="fa fa-angle-right"></i>
                    npm install {this.state.repo}
                  </div>
                  <h5>jsdelivr</h5>
                  <div className="alert alert-dark install-content script" role="alert">
                    <pre>&lt;script src="https://cdn.jsdelivr.net/npm/{this.state.repo}@{this.state.version}{this.state.defaultFile}"&gt;&lt;script&gt;</pre>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <h5 className="card-header">Ranking</h5>
                    <div className="card-body">
                      <label className="control-label">QUALITY</label>
                      <div className="progress">
                        <div className="progress-bar" role="progressbar" style={{
                            width: `${this.state.qualityScore}%`
                          }} aria-valuenow="qualityScore" aria-valuemin="0" aria-valuemax="100">{this.state.qualityScore}</div>
                      </div>
                      <br/>
                      <label className="control-label">POPULARITY</label>
                      <div className="progress">
                        <div className="progress-bar" role="progressbar" style={{
                            width: `${this.state.popularityScore}%`
                          }} aria-valuenow="popularityScore" aria-valuemin="0" aria-valuemax="100">{this.state.popularityScore}</div>
                      </div>
                      <br/>
                      <label className="control-label">MAINTENANCE</label>
                      <div className="progress">
                        <div className="progress-bar" role="progressbar" style={{
                            width: `${this.state.maintenanceScore}%`
                          }} aria-valuenow="maintenanceScore" aria-valuemin="0" aria-valuemax="100">{this.state.maintenanceScore}</div>
                      </div>
                      <br/>
                      <label className="control-label">OVERALL</label>
                      <div className="progress">
                        <div className="progress-bar" role="progressbar" style={{
                            width: `${this.state.overallScore}%`
                          }} aria-valuenow="overallScore" aria-valuemin="0" aria-valuemax="100">{this.state.overallScore}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>)
  }
}

export default Detail
