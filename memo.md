
PS C:\TK\github\HackathonApp1> npx expo export --platform web
env: load .env
env: export EXPO_ROUTER_APP_ROOT EXPO_ROUTER_IMPORT_MODE API_KEY AUTH_DOMAIN PROJECT_ID STORAGE_BUCKET MESSAGING_SENDER_ID APP_ID DATABASE_URL MEASUREMENT_ID
Starting Metro Bundler
Static rendering is enabled. Learn more: https://docs.expo.dev/router/reference/static-rendering/
λ Bundled 2967ms node_modules\expo-router\node\render.js (637 modules)


Metro error: No routes found

  Error: No routes found
    at apply (C:\TK\github\HackathonApp1\node_modules\expo-router\build\static\getServerManifest.js:29:15)
    at getBuildTimeServerManifestAsync (C:\TK\github\HackathonApp1\node_modules\@expo\cli\src\start\server\getStaticRenderFunctions.ts:112:25)
    at MetroBundlerDevServer.getStaticRenderFunctionAsync (C:\TK\github\HackathonApp1\node_modules\@expo\cli\src\start\server\metro\MetroBundlerDevServer.ts:290:29)
    at async Promise.all (index 1)
    at exportFromServerAsync (C:\TK\github\HackathonApp1\node_modules\@expo\cli\src\export\exportStaticAsync.ts:164:66)     
    at exportAppAsync (C:\TK\github\HackathonApp1\node_modules\@expo\cli\src\export\exportApp.ts:352:9)
    at exportAsync (C:\TK\github\HackathonApp1\node_modules\@expo\cli\src\export\exportAsync.ts:21:3)
Web node_modules\expo-router\entry.js ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100.0% (601/601)Error: No routes found
Error: No routes found
    at apply (C:\TK\github\HackathonApp1\node_modules\expo-router\build\static\getServerManifest.js:29:15)
    at getBuildTimeServerManifestAsync (C:\TK\github\HackathonApp1\node_modules\@expo\cli\src\start\server\getStaticRenderFunctions.ts:112:25)
    at MetroBundlerDevServer.getStaticRenderFunctionAsync (C:\TK\github\HackathonApp1\node_modules\@expo\cli\src\start\server\metro\MetroBundlerDevServer.ts:290:29)
    at async Promise.all (index 1)
    at exportFromServerAsync (C:\TK\github\HackathonApp1\node_modules\@expo\cli\src\export\exportStaticAsync.ts:164:66)     
    at exportAppAsync (C:\TK\github\HackathonApp1\node_modules\@expo\cli\src\export\exportApp.ts:352:9)
    at exportAsync (C:\TK\github\HackathonApp1\node_modules\@expo\cli\src\export\exportAsync.ts:21:3)





ReactNativeWebでexpo-routerを使ってビルドしたらMetro error: No routes foundが出てきます
GPTとかに聞いてEXPO_ROUTER_APP_ROOT=appしましたし,appフォルダがあるのに