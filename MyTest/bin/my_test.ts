#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MyTestStack } from '../lib/my_test-stack';

const app = new cdk.App();
new MyTestStack(app, 'MyTestStack');
