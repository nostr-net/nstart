# Nstart

Nstart aims to guide new users to [Nostr](https://njump.me) offering a easy and no-nonsense onboarding wizard, with useful hints about the protocol and some really exclusive features:

- Easy local backup of your nsec or ncryptsec
- Email yourself your ncryptsec, as additional backup location
- Create a multi-signer bunker URL for Nostr Connect (more info [below](#multi-signature-bunker))
- Auto follow the contacts list of some old Nostr users
- Customize of contact suggestions, useful for onboarding friends & family

Check it now at https://start.njump.me  
Are you a dev? Discover the new [integration for apps](APPS-INTEGRATION.md)!

https://github.com/user-attachments/assets/23dfe2a0-bdb8-4c70-83e0-912f67c41b0c

## How to use

Just share https://start.njump.me with someone that you want to invite to Nostr.
If you want to give him or her the opportunity to follow you and your contact list, personalize the url with your npub (or nprofile):

```
https://start.njump.me?s=<npub1>,<npub2>,<npub3>
```

Example:

```
https://start.njump.me?s=npub10000003zmk89narqpczy4ff6rnuht2wu05na7kpnh3mak7z2tqzsv8vwqk
```

You can pass more profiles, separated by commas.

## Multi-signature bunker

The multi-signer bunker is managed by [promenade](https://git.fiatjaf.com/promenade); it uses FROST to split your nsec in 3 (or more) and distribute each shard to an independent trusted remote signer. This will give you a bunker code that you can use to login in many web, mobile and desktop apps without exposing your nsec. If you ever lose your bunker code, if the signers vanish from Earth and it stops working or if it gets stolen by a malware virus you can use your nsec to create a new and invalidate the old one.

Discaimer: this bunker implementation needs a small update from the classic implementation, so not all apps support it yet, please beg your favorite developer to update their app. It also does not support encryption, so it cannot be used for DMs apps.

## External apps integration

Nstart also offers an onboarding process to external Nostr clients, web and mobile! Taking advantage of this opportunity is really simple, [read more](APPS-INTEGRATION.md).

![Modal](/static/images/apps-integration03.jpg)