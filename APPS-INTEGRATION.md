# Onboarding integration in Nostr apps

Nstart also offers an onboarding process to external Nostr clients, web and mobile! Taking advantage of this opportunity is simple; just redirect the user to:

```
https://start.njump.me?an=<AppName>&at=<web|popup|android|ios>&ac=<returningWebpage|appCode>
```

Where:

`an` is the name of your application;  
`at` is the type, from web, android, ios;  
`ac` is the returning point, it's a URL for a web application, or the app code for a mobile one;  

For example, for a web application:

```
https://start.njump.me?an=Coracle&at=web&ac=https://coracle.social
```

and for an Android app:

```
https://start.njump.me?an=Volare&at=android&ac=com.fiatjaf.volare
```

The welcome page shows a reference to the calling app:

![Start page](/static/images/apps-integration01.jpg)

At the end of the procedure, instead of the usual finish page, the user will be presented with a customized one:

![Start page](/static/images/apps-integration02.jpg)

When the user presses the "Start using Nostr" button, Nstart sends back to the caller application the available credentials, in this order: bunker, ncryptsec, nsec.

For web apps this happens appending "#nostr-login:\<credentials\> to the URL defined in `ac`, for example:

```
https://coracle.social#nostr-login=bunker://xxxxxxxxxx...
```

An Android app is opened passing an intent using the `nostr-login` scheme:

```
intent:bunker://xxxxxxxxxx...#Intent;scheme=nostr-login;package=com.fiatjaf.com;end;
```

and similarly for an IOS app:

```
damus://bunker://xxxxxxxxxx...
```

The caller app has the responsibility to correctly manage the returning credentials.

## Mandatory note for web application security

The use of `#nostr-login` hash in the url allows the use of a simple GET request while manteining a good security, since the hash is not passed to the server (and so not logged). Nevertheless, the app MUST remove the credentials from the url as soon as possibile so that they cannot remain saved, for example in browser history.  
The following is a Javascript code that achieves this goal:

```
if (window.location.hash && window.location.hash.startsWith('#nostr-login')) {
    const urlWithoutHash = window.location.href.split('#')[0];
    history.replaceState(null, '', urlWithoutHash);
}
```

## Popup option

Web applications have the option to open a popup instead of redirecting; this permits to keep the app state (e.g. when posting a first comment), let the user sign-up, and then resume the flow.
To do that instead of "web" use `at=popup` when opening the popup. Njump will not open the `ac` url you provide, but instead will do `window.opener.location.href=ac + "#nostr-login=..."` to force `hashchange` event on your page. Make sure to specify a random `target` to `window.open` instead of `_blank` so that Njump has access to `window.opener`, and then listen to `hashchange` event to accept the `#nostr-login=...` return value (and consume it as described above). 

## Custom relays

While Nstart creates a 10002 event with random picked relays from a selected pool by default , apps can overwrite these read and write relays using the `arr` (read relays) and `awr` (write relays) params. More relays can be passed, separated by commas. For example:

```
http://start.njump.me/?an=Coracle&at=web&ac=https://coracle.social&arr=wss://relay.damus.io&awr=wss://nos.lol,wss://wss://offchain.pub
```

## Disable the multi-signature bunker

Some apps are not ready to manage the multi-signature bunker, or cannot fully take advantage of it since it does not support encryption (e.g. DMs). They can disable this specific step using the `asb=yes` param. For example:

```
https://start.njump.me?an=Coracle&at=web&ac=https://coracle.social&asb=yes
```

## Disable returning the plain nsec

Some apps do not support login by nsec or may prefer not to handle an unencrypted credential for security reasons. With the param `aan=yes` you can force that; in this case the credential passed back will be `null`. For example:

```
https://start.njump.me?an=Coracle&at=web&ac=https://coracle.social&aan=yes
```
