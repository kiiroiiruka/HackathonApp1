// filepath: c:\TK\github\HackathonApp1\babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true,
    }],
    ['@babel/plugin-transform-private-methods', { loose: true }], // プライベートメソッドの変換プラグイン
    ['@babel/plugin-transform-class-properties', { loose: true }], // クラスプロパティの変換プラグイン
    ['@babel/plugin-transform-private-property-in-object', { loose: true }], // プライベートプロパティの変換プラグイン
  ],
};