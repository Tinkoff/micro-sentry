import { BrowserMicroSentryClient } from './browser-micro-sentry-client';
import { Severity } from '@micro-sentry/core';

describe('BrowserMicroSentryClient', () => {
  let client: BrowserMicroSentryClient;

  beforeAll(() => {
    client = new BrowserMicroSentryClient({
      dsn: 'http://secret@exampl.dsn/2',
      release: '1.0.0',
    });
  });

  it('Client is created', () => {
    expect(client).toBeTruthy();
  });

  describe('Tags', () => {
    it('Method setTags sets tags', () => {
      client.setTags({ test: 'tag' });
      expect(client.state).toEqual({ tags: { test: 'tag' } });
    });

    it('Method setTags rewrite tags if there are', () => {
      client.setTags({ anotherTag: 'name' });
      expect(client.state).toEqual({ tags: { anotherTag: 'name' } });

      client.setTags({ someTag: 'awesome' });
      expect(client.state).toEqual({ tags: { someTag: 'awesome' } });
    });

    it('Method setTag expand existing tags', () => {
      client.setTags({ someTag: 'awesome' });
      client.setTag('tag', 'test');

      expect(client.state).toEqual({
        tags: { tag: 'test', someTag: 'awesome' },
      });
    });

    afterAll(() => {
      client.clearState();
    });
  });

  describe('Extra', () => {
    it('Method setExtras sets extra tags', () => {
      client.setExtras({ test: 'tag' });
      expect(client.state).toEqual({ extra: { test: 'tag' } });
    });

    it('Method setExtras rewrites extra tags if there are', () => {
      client.setExtras({ anotherTag: 'name' });
      expect(client.state).toEqual({ extra: { anotherTag: 'name' } });

      client.setExtras({ someTag: 'awesome' });
      expect(client.state).toEqual({ extra: { someTag: 'awesome' } });
    });

    it('Method setExtra расширяет существующие экстра теги', () => {
      client.setExtras({ someTag: 'awesome' });
      client.setExtra('tag', 'test');

      expect(client.state).toEqual({
        extra: { tag: 'test', someTag: 'awesome' },
      });
    });

    afterAll(() => {
      client.clearState();
    });
  });

  describe('Mix Tags Extras and User', () => {
    it('Methods setTag with setExtras set tags and extras', () => {
      client.setTags({ test: 'tag' });
      expect(client.state).toEqual({ tags: { test: 'tag' } });

      client.setExtras({ tag: 'test' });

      expect(client.state).toEqual({
        tags: { test: 'tag' },
        extra: { tag: 'test' },
      });
    });

    it('Methods setTag with setUser set tags and user', () => {
      client.setTags({ test: 'tag' });
      expect(client.state).toEqual({ tags: { test: 'tag' } });

      client.setUser({ username: 'test' });

      expect(client.state).toEqual({
        tags: { test: 'tag' },
        user: { username: 'test' },
      });
    });

    it('Methods setExtras with setTag set tags and extras', () => {
      client.setExtras({ tag: 'test' });
      expect(client.state).toEqual({ extra: { tag: 'test' } });

      client.setTags({ test: 'tag' });

      expect(client.state).toEqual({
        tags: { test: 'tag' },
        extra: { tag: 'test' },
      });
    });

    it('Methods setExtras with setUser set user and extras', () => {
      client.setExtras({ tag: 'test' });
      expect(client.state).toEqual({ extra: { tag: 'test' } });

      client.setUser({ username: 'test' });

      expect(client.state).toEqual({
        user: { username: 'test' },
        extra: { tag: 'test' },
      });
    });

    it('Methods setUser with setExtra set extras and user', () => {
      client.setUser({ username: 'test' });
      expect(client.state).toEqual({ user: { username: 'test' } });

      client.setExtras({ tag: 'test' });
      expect(client.state).toEqual({
        user: { username: 'test' },
        extra: { tag: 'test' },
      });
    });

    it('Methods setUser with setTag set tag and user', () => {
      client.setUser({ username: 'test' });
      expect(client.state).toEqual({ user: { username: 'test' } });

      client.setTags({ test: 'tag' });
      expect(client.state).toEqual({
        user: { username: 'test' },
        tags: { test: 'tag' },
      });
    });

    it('Methods setUser with setTags with setExtra work together', () => {
      client.setUser({ username: 'test' });
      expect(client.state).toEqual({ user: { username: 'test' } });

      client.setTags({ test: 'tag' });
      expect(client.state).toEqual({
        user: { username: 'test' },
        tags: { test: 'tag' },
      });

      client.setExtras({ tag: 'test' });
      expect(client.state).toEqual({
        user: { username: 'test' },
        tags: { test: 'tag' },
        extra: { tag: 'test' },
      });
    });

    afterEach(() => {
      client.clearState();
    });
  });

  describe('Breadcrumbs', () => {
    it('Method addBreadcrumb adds them', () => {
      client.addBreadcrumb({
        event_id: 'id',
        type: 'console',
        level: Severity.critical,
      });

      client.addBreadcrumb({
        event_id: 'id2',
        type: 'console',
        level: Severity.critical,
      });

      expect(client.state).toEqual({
        breadcrumbs: [
          {
            event_id: 'id',
            type: 'console',
            level: 'critical',
            timestamp: expect.any(Number),
          },
          {
            event_id: 'id2',
            type: 'console',
            level: 'critical',
            timestamp: expect.any(Number),
          },
        ],
      });
    });

    afterAll(() => {
      client.clearState();
    });
  });

  describe('clone', () => {
    let clonedClient: BrowserMicroSentryClient;

    beforeAll(() => {
      client
        .setExtra('someExtra', 'extra value')
        .setTags({ tag: 'value' })
        .setUser({ email: 'qwerty@example.com' });

      clonedClient = client.clone();
    });

    it('Cloned client has the same settings', () => {
      expect(clonedClient.state).toStrictEqual(client.state);
      expect(clonedClient.apiUrl).toStrictEqual(client.apiUrl);
      expect(clonedClient.authHeader).toStrictEqual(client.authHeader);
    });

    it('Cloned client is actually a client', () => {
      expect(clonedClient === client).toBe(false);
    });

    it('Cloning creates a new state', () => {
      expect(clonedClient.state === client.state).toBe(false);
    });

    it('withScope is called with a copu of current client', () => {
      client.withScope((clone) => {
        expect(clonedClient.state).toStrictEqual(client.state);
        expect(clonedClient.apiUrl).toStrictEqual(client.apiUrl);
        expect(clonedClient.authHeader).toStrictEqual(client.authHeader);

        expect(clone === client).toBe(false);
      });
    });

    afterAll(() => {
      client.clearState();
    });
  });

  describe('Data sending', () => {
    let sendSpy: jest.SpyInstance;

    beforeAll(() => {
      sendSpy = jest.spyOn(
        // смотрим за супер Methodом, что бы отлавливать мутации в Methodе дочернего класса
        (client.constructor as any).__proto__.prototype,
        'send'
      );

      client.setTags({ tag: 'value' }).setExtras({ tag: 'value' });
    });

    it('Set data is in data to send', () => {
      client.report({ message: 'Error', name: 'Error', stack: '' });

      expect(sendSpy).toHaveBeenCalledWith({
        release: '1.0.0',
        exception: {
          values: [
            {
              stacktrace: {
                frames: [],
              },
              type: 'Error',
              value: 'Error',
            },
          ],
        },
        platform: 'javascript',
        request: {
          headers: {
            'User-Agent': expect.any(String),
          },
          url: expect.any(String),
        },
        sdk: { name: 'micro-sentry.javascript.browser', version: '0.0.0' },
        extra: {
          tag: 'value',
        },
        tags: { tag: 'value' },
        timestamp: expect.any(Number),
      });
    });

    it('Message has correct fields and log level', () => {
      client.captureMessage('Message', Severity.debug);

      expect(sendSpy).toHaveBeenCalledWith({
        release: '1.0.0',
        message: 'Message',
        level: 'debug',
        platform: 'javascript',
        request: {
          headers: {
            'User-Agent': expect.any(String),
          },
          url: expect.any(String),
        },
        sdk: { name: 'micro-sentry.javascript.browser', version: '0.0.0' },
        extra: {
          tag: 'value',
        },
        tags: { tag: 'value' },
        timestamp: expect.any(Number),
      });
    });
  });
});
