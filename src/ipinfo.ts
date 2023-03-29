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

import * as dns from 'dns';

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
 * IP Prefix information
 */
export interface PrefixEntry {
    address: string;

    zone: string;
    asn: number;
    prefix: string;
    country: string;
    registry: string;
    allocated: Date;
}

/**
 * @ignore
 * Looks up the prefix information via DNS
 *
 * @param address
 */
const prefix = async (address: string): Promise<PrefixEntry> => new Promise((resolve, reject) => {
    const _address = address;

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

    dns.resolveTxt(address, (error: Error | null, records: string[][]) => {
        if (error) {
            return reject(error);
        }

        if (records.length === 0 || records[0].length === 0) {
            throw new Error('No records found');
        }

        const [asn, prefix, country, registry, allocated] = records[0][0].split('|')
            .map(elem => elem.trim());

        return resolve({
            address: _address,
            zone: address,
            asn: parseInt(asn),
            prefix,
            country: country.toUpperCase(),
            registry: registry.toUpperCase(),
            allocated: new Date(allocated)
        });
    });
});

/**
 * ASN information
 */
export interface ASNEntry {
    asn: number;
    country: string;
    registry: string;
    allocated: Date;
    name: string;
}

/**
 * IP Prefix information including the ASN name (if available)
 */
export interface IPInfo extends PrefixEntry {
    as?: ASNEntry;
}

/**
 * @ignore
 * Looks up information on the ASN via DNS
 *
 * @param as
 */
const asn = async (as: number): Promise<ASNEntry> => {
    return new Promise((resolve, reject) => {
        dns.resolveTxt(`AS${as}.asn.cymru.com`, (error: Error | null, records: string[][]) => {
            if (error) {
                return reject(error);
            }

            if (records.length === 0 || records[0].length === 0) {
                throw new Error('No records found');
            }

            const [, country, registry, allocated, name] = records[0][0].split('|')
                .map(elem => elem.trim());

            return resolve({
                asn: as,
                country: country.toUpperCase(),
                registry: registry.toUpperCase(),
                allocated: new Date(allocated),
                name
            });
        });
    });
};

/**
 * Looks up information regarding the IP address supplied
 *
 * @param address
 */
export const IPInfo = async (address: string): Promise<IPInfo> => {
    const info = await prefix(address);

    try {
        const _asn = await asn(info.asn);

        return {
            ...info,
            as: _asn
        };
    } catch {
        return {
            ...info
        };
    }
};

export default IPInfo;
