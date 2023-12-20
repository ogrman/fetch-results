import * as chai from 'chai';
import { TestServer } from './test-server';
import { Err, Ok, Result } from 'ts-results';
import { fetchResult } from ".";

const expect = chai.expect;

let server = new TestServer(9999);

describe("fetchResult", () => {
  afterAll(() => {
    server.close();
  });

  it("should return the expected connection error", async () => {
    const result = await fetchResult("http://localhost:9999/refuse");
    expect(server.lastAction).to.equal("refused");
    result.mapErr(err => {
      expect(err.connectionError).to.equal("SocketError: other side closed");
    });
    expect(result.err).to.be.true;
  });

  it("should return the expected response", async () => {
    const result = await fetchResult("http://localhost:9999/text");
    expect(server.lastAction).to.equal("get_text");
    if (!result.ok) {
      fail("Expected a response");
    } else {
      const text = await result.val.text();
      expect(text).to.equal("Text");
    }
  });

  it("should give a ParseError when parsing json fails", async () => {
    const result = await fetchResult("http://localhost:9999/invalid_json");
    expect(server.lastAction).to.equal("get_invalid_json");
    if (!result.ok) {
      fail("Expected a response");
    } else {
      const json = await result.val.json();
      json.mapErr(err => {
        expect(err.parseError).to.equal("SyntaxError: Expected ':' after property name in JSON at position 11");
      });
      expect(json.err).to.be.true;
    }
  });

  it("should give the result back when parsing json succeeds", async () => {
    const result = await fetchResult("http://localhost:9999/json");
    expect(server.lastAction).to.equal("get_json");
    if (!result.ok) {
      fail("Expected a response");
    } else {
      const json = await result.val.json();
      if (!json.ok) {
        fail("Expected a JSON response");
      } else {
        expect(json.val).to.equal("a string can be json");
      }
    }
  });
});
