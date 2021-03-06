module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("csv")
      .test(/\.csv$/)
      .use("csv-loader")
      .loader("csv-loader")
      .options({
        header: true,
        delimiter: "\t",
        skipEmptyLines: "greedy",
      })
      .end();
  },
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/sites/204is/SiteAssets/test-generator/"
      : "./",
};
