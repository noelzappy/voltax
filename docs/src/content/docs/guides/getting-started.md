---
title: Getting Started
description: Learn how to install and configure the Voltax SDK.
---

import { Tabs, TabItem } from '@astrojs/starlight/components';

## Installation

Install the Voltax SDK using your preferred package manager.

<Tabs>
  <TabItem label="npm">
  ```bash
  npm install @voltax/node
  ```
  </TabItem>
  <TabItem label="pnpm">
  ```bash
  pnpm add @voltax/node
  ```
  </TabItem>
  <TabItem label="yarn">
  ```bash
  yarn add @voltax/node
  ```
  </TabItem>
</Tabs>

## Basic Usage

Here is a simple example of how to initialize the Voltax SDK.

```typescript
import { Voltax } from '@voltax/node';

const client = new Voltax({
  apiKey: 'YOUR_API_KEY',
});

// Use the client to interact with the API
```
