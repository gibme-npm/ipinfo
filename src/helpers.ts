// Copyright (c) 2016-2023, Brandon Lehmann <brandonlehmann@gmail.com>
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

import { resolveTxt } from 'dns/promises';
import { ASNEntry, PrefixInfo } from './types';

/** @ignore */
const sleep = async (timeout: number) =>
    new Promise(resolve => setTimeout(resolve, timeout));

/** @ignore */
const countColons = (value: string): number => {
    let count = 0;

    value.replace(/:/g, val => { count++; return val; });

    return count;
};

/**
 * @ignore
 * Expands compressed IPv6 address to uncompressed form
 *
 * @param value
 */
const expandIPv6 = (value: string): string => {
    return value.replace(/::/, () => {
        return `:${Array((7 - countColons(value)) + 1).join(':')}:`;
    })
        .split(':')
        .map(val => {
            return Array(4 - val.length).fill('0').join('') + val;
        })
        .join(':');
};

/**
 * DNS TXT record resolution with automatic retries
 *
 * @param hostname
 * @param max_retries
 * @param retry
 * @ignore
 */
const getTxtRecord = async (
    hostname: string,
    max_retries = 3,
    retry = 0
): Promise<string[][]> => {
    try {
        return await resolveTxt(hostname);
    } catch (error: any) {
        if (error.toString().toLowerCase().includes('refused') && retry < max_retries) {
            await sleep(1000);

            return getTxtRecord(hostname, max_retries, retry);
        }

        throw error;
    }
};

/**
 * Looks up information on the Autonomous System Number (ASN) via DNS
 *
 * @param as
 * @param max_retries
 * @ignore
 */
const getASN = async (
    as: string | number,
    max_retries = 3
): Promise<ASNEntry | undefined> => {
    if (typeof as === 'string') {
        as = parseInt(as);
    }

    const records = await getTxtRecord(`AS${as}.asn.cymru.com`, max_retries);

    if (records.length === 0 || records[0].length === 0) {
        return undefined;
    }

    const [, country, registry, allocated, name] = records[0][0].split('|')
        .map(elem => elem.trim());

    return {
        asn: as,
        country: country.toUpperCase(),
        registry: registry.toUpperCase(),
        allocated: new Date(allocated),
        name: name.split(',')[0]
    };
};

/**
 * Looks up the prefix information via DNS
 *
 * @param address
 * @param max_retries
 * @ignore
 */
const getPrefix = async (
    address: string,
    max_retries = 3
): Promise<PrefixInfo | undefined> => {
    const original_address = address;

    address = address.split('/')[0]; // strip off any CIDR notation

    if (address.includes(':')) {
        address = expandIPv6(address);
        address = address.split(':')
            .join('')
            .split('')
            .reverse()
            .join('.');
        address = `${address}.origin6.asn.cymru.com`;
    } else {
        address = address.split('.')
            .reverse()
            .join('.');
        address = `${address}.origin.asn.cymru.com`;
    }

    const records = await getTxtRecord(address, max_retries);

    if (records.length === 0 || records[0].length === 0) {
        return undefined;
    }

    const [asn, prefix, country, registry, allocated] = records[0][0].split('|')
        .map(elem => elem.trim());

    return {
        address: original_address,
        zone: address,
        asn: parseInt(asn),
        prefix,
        country: country.toUpperCase(),
        registry: registry.toUpperCase(),
        allocated: new Date(allocated),
        as: await getASN(asn)
    } as PrefixInfo;
};

export default {
    getPrefix
};
