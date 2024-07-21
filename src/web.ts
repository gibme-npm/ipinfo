// Copyright (c) 2016-2024, Brandon Lehmann <brandonlehmann@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { CheckIPResponse, Workers } from './types';
import fetch from '@gibme/fetch';

/**
 * Looks up information regarding the IP address supplied; OR,
 * if no address is supplied, looks up information regarding
 * our client's IP address
 *
 * @param address
 * @constructor
 */
export const CheckIP = async (
    address?: string
): Promise<CheckIPResponse | undefined> => {
    const url = `https://ipinfo.hostmanager.workers.dev/${address ? `?ip=${address}` : ''}`;

    const response = await fetch.get(url);

    if (!response.ok) {
        return undefined;
    }

    const json: Workers.Response = await response.json();

    if (json.status === 'fail') {
        return undefined;
    }

    const [as, name] = json.as.split(' ', 2)
        .map(elem => elem.trim());

    const asn = parseInt(as.replace('AS', '')) || 0;

    return {
        query: json.query,
        country: json.country,
        countryCode: json.countryCode,
        region: json.region,
        regionName: json.regionName,
        city: json.city,
        zip: json.zip,
        lat: json.lat,
        lon: json.lon,
        timezone: json.timezone,
        isp: json.isp,
        org: json.org.length !== 0 ? json.org : undefined,
        as: {
            asn,
            name
        }
    };
};
