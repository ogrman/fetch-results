#!/usr/bin/env bash
npm run test && \
  npm run build && \
  echo "OK for release, publish from dist"
