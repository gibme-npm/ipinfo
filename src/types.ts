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
export interface PrefixInfo {
    address: string;
    zone: string;
    asn: number;
    prefix: string;
    country: string;
    registry: string;
    allocated: Date;
    as?: ASNEntry;
}

export namespace Workers {
    export interface Response {
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
}

export interface CheckIPResponse {
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
