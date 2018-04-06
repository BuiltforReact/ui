import React from 'react'
import Link from 'next/link'

class Header extends React.Component {
  render() {
    return (<header>
      <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 border-bottom box-shadow header-navbar">
        <h5 className="my-0 mr-md-auto font-weight-normal">
          <Link href="/">
            <a>
              <img src="/static/images/logo_white.png" className="logo"/>
            </a>
          </Link>
        </h5>
        <nav className="my-2 my-md-0 mr-md-3">
          <Link href="/about">
            <a>About</a>
          </Link>&nbsp; &nbsp; | &nbsp; &nbsp;
          <a href="https://github.com/builtforreact/ui" target="_blank">Github</a>
          &nbsp; &nbsp; |&nbsp; &nbsp;
          <a href="https://discord.gg/VEHFpg4" target="_blank">Discord</a>
          &nbsp; &nbsp; |&nbsp; &nbsp;
          <a href="https://www.buymeacoffee.com/G5hRfqkwd" target="_blank">Buy me a coffee!</a>
        </nav>
      </div>
    </header>)
  }
}

export default Header
