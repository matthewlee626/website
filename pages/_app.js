import React from 'react'
import Head from 'next/head'
import NextApp from 'next/app'

import { ThemeProvider } from '@mui/material'
import { theme } from '../components/theme'

import '../styles/global.sass'

export default class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>Matthew Lee</title>
        </Head>
        <Component {...pageProps} />
      </>
    )
  }
}