# micro-sentry

[![npm version](https://img.shields.io/npm/v/@micro-sentry/angular.svg)](https://npmjs.com/package/@micro-sentry/angular)

**@micro-sentry** is a tiny sentry client to monitor your applications without raising your bundle size.

## Why is it better than default sentry client?

👜 **It is small**. So, it is 3 KB size instead of 78 KB (TODO: check sizes) by default client but has all the essential functionality

🛠 **It is easy to set up**. There is a lightweight wrapper for Angular and a browser tool for other frameworks or vanilla.

## Installation

Angular:

```
npm i @micro-sentry/angular
```

Other:

```
npm i @micro-sentry/browser
```

## How to set up

### Angular

Just add it into `app.module.ts` of your application:

```typescript
import { MicroSentryModule } from '@micro-sentry/angular';

@NgModule({
  imports: [
    MicroSentryModule.forRoot({
      dsn: 'https://kj12kj1n23@sentry.domain.com/123',
    }),
  ],
})
export class AppModule {}
```

### Javascript / Typescript

If you do not use Angular framework, you can install `@micro-sentry/browser` module to create client manually.

```ts
const client = new BrowserMicroSentryClient({
  dsn: 'https://kj12kj1n23@sentry.domain.com/123',
});

try {
  // your app code
} catch (e) {
  client.report(e);
}
```

## Core team

<table>
    <tr>
       <td align="center">
            <a href="https://twitter.com/katsuba_igor"
                ><img
                    src="https://github.com/IKatsuba.png?size=100"
                    width="100"
                    style="margin-bottom: -4px; border-radius: 8px;"
                    alt="Igor Katsuba"
                /><br /><sub><b>Igor Katsuba</b></sub></a
            >
            <div style="margin-top: 4px">
                <a
                    href="https://twitter.com/katsuba_igor"
                    title="Twitter"
                    ><img
                        style="width: 16px;"
                        width="16"
                        src="https://raw.githubusercontent.com/feathericons/feather/master/icons/twitter.svg"
                /></a>
                <a href="https://github.com/IKatsuba" title="Github"
                    ><img
                        width="16"
                        src="https://raw.githubusercontent.com/feathericons/feather/master/icons/github.svg"
                /></a>
                <a
                    href="https://t.me/Katsuba"
                    title="Telegram"
                    ><img
                        width="16"
                        src="https://raw.githubusercontent.com/feathericons/feather/master/icons/send.svg"
                /></a>
            </div>
        </td>
        <td align="center">
            <a href="http://marsibarsi.me"
                ><img
                    src="https://github.com/marsibarsi.png?size=100"
                    width="100"
                    style="margin-bottom: -4px; border-radius: 8px;"
                    alt="Roman Sedov"
                /><br /><b>Roman Sedov</b></a
            >
            <div style="margin-top: 4px">
                <a
                    href="https://twitter.com/marsibarsi"
                    title="Twitter"
                    ><img
                        width="16"
                        src="https://raw.githubusercontent.com/feathericons/feather/master/icons/twitter.svg"
                /></a>
                <a
                    href="https://github.com/marsibarsi"
                    title="GitHub"
                    ><img
                        width="16"
                        src="https://raw.githubusercontent.com/feathericons/feather/master/icons/github.svg"
                /></a>
                <a
                    href="https://t.me/marsibarsi"
                    title="Telegram"
                    ><img
                        width="16"
                        src="https://raw.githubusercontent.com/feathericons/feather/master/icons/send.svg"
                /></a>
            </div>
        </td>
    </tr>

</table>

## License

🆓 Feel free to use our library in your commercial and private applications

All ng-morph packages are covered by [Apache 2.0](/LICENSE)

Read more about this license [here](https://choosealicense.com/licenses/apache-2.0/)
