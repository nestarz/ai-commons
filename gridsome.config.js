// This is where project configuration and plugin options are located. 
// Learn more: https://gridsome.org/docs/config

// Changes here requires a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'aicommons',
  chainWebpack: config => {
    config.mode('development')
    config.module
      .rule('raw-loader')
      .test(/\.md$/i)
        .use('raw-loader')
          .loader('raw-loader')
  },
}