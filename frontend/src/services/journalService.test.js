import { test } from 'node:test';
import assert from 'node:assert';
import { saveJournal, getJournalHistory } from './journalService.js';

test('saveJournal should be defined', () => {
    assert.strictEqual(typeof saveJournal, 'function');
});

test('getJournalHistory should be defined', () => {
    assert.strictEqual(typeof getJournalHistory, 'function');
});
