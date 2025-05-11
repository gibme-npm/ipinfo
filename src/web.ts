// Copyright (c) 2016-2025, Brandon Lehmann <brandonlehmann@gmail.com>
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

import fetch from '@gibme/fetch/browser';

/**
 * Looks up information regarding the IP address supplied; OR,
 * if no address is supplied, looks up information regarding
 * our client's IP address
 *
 * @param address
 */
export async function ipInfo (
    address?: string
): Promise<ipInfo.Result | undefined> {
    const url = `https://ipinfo.hostmanager.workers.dev/${address ? `?ip=${address}` : ''}`;

    const response = await fetch.get(url);

    if (!response.ok) {
        return undefined;
    }

    const json: ipInfo.Response = await response.json();

    if (json.status === 'fail') {
        return undefined;
    }

    const [as, name] = json.as.split(' ', 2)
        .map(elem => elem.trim());

    const asn = parseInt(as.replace('AS', '')) || 0;

    return {
        ...json,
        as: {
            asn,
            name
        }
    };
}

export namespace ipInfo {
    export type Response = {
        status: 'success' | 'fail';
        message?: string;
        query: string;
        country: string;
        countryCode: string;
        region: string;
        regionName: string;
        city: string;
        zip: string;
        lat: number;
        lon: number;
        timezone: string;
        isp: string;
        org: string;
        as: string;
    }

    export type Result = {
        query: string;
        country: string;
        countryCode: string;
        region: string;
        regionName: string;
        city: string;
        zip: string;
        lat: number;
        lon: number;
        timezone: string;
        isp: string;
        org?: string;
        as: {
            asn: number;
            name: string;
        }
    }
}

export default ipInfo;
