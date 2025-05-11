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

import assert from 'assert';
import { it, describe } from 'mocha';
import { ipInfo, getPrefix, getASN } from '../src';

describe('Unit Tests', () => {
    const targets: {ip: string, asn: number}[] = [{
        ip: '1.1.1.1',
        asn: 13335
    }, {
        ip: '8.8.8.8',
        asn: 15169
    }, {
        ip: '2606:4700::1111',
        asn: 13335
    }, {
        ip: '2001:4860:4860::8888',
        asn: 15169
    }, {
        ip: '4.2.2.2',
        asn: 3356
    }];

    describe('getPrefix()', async () => {
        for (const target of targets) {
            it(`Test ${target.ip}`, async () => {
                const result = await getPrefix(target.ip);

                assert.ok((result));
                assert.equal(result.asn, target.asn);
            });
        }
    });

    describe('ipInfo()', async () => {
        for (const target of targets) {
            it(`Test ${target.ip}`, async () => {
                const result = await ipInfo(target.ip);

                assert.ok((result));
                assert.equal(result.as.asn, target.asn);
            });
        }
    });

    describe('getASN()', async () => {
        for (const target of targets) {
            it(`Test ${target.asn}`, async () => {
                const result = await getASN(target.asn);

                assert.ok((result));
                assert.equal(result.asn, target.asn);
            });
        }
    });
});
