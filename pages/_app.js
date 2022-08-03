import React from 'react'
import Head from 'next/head'
import NextApp from 'next/app'

import { ChakraProvider } from '@chakra-ui/react'


import '../styles/global.sass'

export default class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>Matthew Lee</title>
        </Head>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </>
    )
  }
}
