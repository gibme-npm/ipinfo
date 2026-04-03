# @gibme/ipinfo

A simple IP information lookup helper using [Team CYMRU](https://www.team-cymru.com/ip-asn-mapping) DNS services and a lightweight HTTP API.

Supports both IPv4 and IPv6 addresses.

## Requirements

- Node.js >= 22

## Installation

```bash
yarn add @gibme/ipinfo
```

or

```bash
npm install @gibme/ipinfo
```

## Usage

### IP Info (HTTP)

Looks up geolocation and network information for an IP address via HTTP. If no address is provided, returns information for the client's public IP.

```typescript
import { ipInfo } from '@gibme/ipinfo';

const info = await ipInfo('1.1.1.1');

console.log(info);
// {
//   query: '1.1.1.1',
//   country: 'Australia',
//   countryCode: 'AU',
//   region: 'QLD',
//   regionName: 'Queensland',
//   city: 'South Brisbane',
//   zip: '4101',
//   lat: -27.4766,
//   lon: 153.0166,
//   timezone: 'Australia/Brisbane',
//   isp: 'Cloudflare, Inc',
//   as: { asn: 13335, name: 'Cloudflare,' }
// }
```

### Prefix Lookup (DNS)

Queries Team CYMRU's DNS-based IP-to-ASN mapping to retrieve prefix, ASN, country, and registry information.

```typescript
import { getPrefix } from '@gibme/ipinfo';

const prefix = await getPrefix('8.8.8.8');

console.log(prefix);
// {
//   address: '8.8.8.8',
//   zone: '8.8.8.8.origin.asn.cymru.com',
//   asn: 15169,
//   prefix: '8.8.8.0/24',
//   country: 'US',
//   registry: 'ARIN',
//   allocated: 2023-12-28T00:00:00.000Z,
//   as: { asn: 15169, country: 'US', registry: 'ARIN', allocated: 2000-03-30T00:00:00.000Z, name: 'GOOGLE' }
// }
```

### ASN Lookup (DNS)

Retrieves information about an Autonomous System Number.

```typescript
import { getASN } from '@gibme/ipinfo';

const asn = await getASN(13335);

console.log(asn);
// {
//   asn: 13335,
//   country: 'US',
//   registry: 'ARIN',
//   allocated: 2010-07-14T00:00:00.000Z,
//   name: 'CLOUDFLARENET'
// }
```

### Browser Bundle

A webpack browser bundle is also available, exposing only the `ipInfo` HTTP method:

```html
<script src="ipinfo.min.js"></script>
```

## Documentation

Full API documentation is available at [https://gibme-npm.github.io/ipinfo/](https://gibme-npm.github.io/ipinfo/)

## License

MIT
